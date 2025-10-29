import React, { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

interface CameraCaptureProps {
  open: boolean;
  onClose: () => void;
  onCapture?: (imageData: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ open, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [faceBox, setFaceBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const progressIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!open) {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      return;
    }

    let faceMesh: any = null;
    let cameraInstance: any = null;

    const init = async () => {
      try {
        // @ts-ignore - dynamic CDN import: these UMD builds don't have TS module declarations
        await import("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js");
        // @ts-ignore - dynamic CDN import
        await import("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
      } catch (e) {
        console.error("Failed to load mediapipe libraries from CDN:", e);
        alert("Camera/face detection libraries failed to load.");
        return;
      }

      const FaceMesh = (window as any).FaceMesh as any;
      const CameraCtor = (window as any).Camera as any;

      if (!FaceMesh || !CameraCtor) {
        console.error("FaceMesh or Camera not found on window after loading mediapipe libs.");
        alert("Camera/face detection libraries unavailable.");
        return;
      }

      faceMesh = new FaceMesh({
        locateFile: (file: string) =>
          `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
      });

      faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.6,
        minTrackingConfidence: 0.6,
      });

      faceMesh.onResults((results: any) => {
        const landmarks = results.multiFaceLandmarks && results.multiFaceLandmarks[0];
        if (landmarks && videoRef.current) {
          // compute normalized bounding box from landmarks
          let minX = Infinity,
            minY = Infinity,
            maxX = -Infinity,
            maxY = -Infinity;
          for (const lm of landmarks) {
            if (typeof lm.x === "number" && typeof lm.y === "number") {
              minX = Math.min(minX, lm.x);
              minY = Math.min(minY, lm.y);
              maxX = Math.max(maxX, lm.x);
              maxY = Math.max(maxY, lm.y);
            }
          }

          // require face region to be fully inside the view (before padding)
          const fullyInside = minX >= 0.02 && minY >= 0.02 && maxX <= 0.98 && maxY <= 0.98;

          const rect = videoRef.current.getBoundingClientRect();
          // add padding (visual) after checking fullyInside
          const padX = (maxX - minX) * 0.1;
          const padY = (maxY - minY) * 0.2;
          const nMinX = Math.max(0, minX - padX);
          const nMinY = Math.max(0, minY - padY);
          const nMaxX = Math.min(1, maxX + padX);
          const nMaxY = Math.min(1, maxY + padY);

          const box = {
            x: nMinX * rect.width,
            y: nMinY * rect.height,
            width: Math.max(20, (nMaxX - nMinX) * rect.width),
            height: Math.max(20, (nMaxY - nMinY) * rect.height),
          };
          setFaceBox(box);

          // center the video view on the detected face
          if (videoRef.current) {
            const centerX = ((minX + maxX) / 2) * 100;
            const centerY = ((minY + maxY) / 2) * 100;
            videoRef.current.style.objectPosition = `${centerX}% ${centerY}%`;
            const radiusPx = Math.max(box.width, box.height) / 2;
            // clip the visible video to a circle centered in the container
            videoRef.current.style.clipPath = `circle(${radiusPx}px at 50% 50%)`;
            videoRef.current.style.borderRadius = "50%";
          }

          if (fullyInside) {
            // start a 4s timer if not already running
            if (!timerRef.current) {
              const totalMs = 4000;
              const startTime = Date.now();
              setProgress(0);

              // Update progress every 50ms for smooth animation
              progressIntervalRef.current = window.setInterval(() => {
                const elapsed = Date.now() - startTime;
                const newProgress = Math.min((elapsed / totalMs) * 100, 100);
                setProgress(newProgress);
              }, 50);

              timerRef.current = window.setTimeout(() => {
                if (progressIntervalRef.current) {
                  clearInterval(progressIntervalRef.current);
                  progressIntervalRef.current = null;
                }
                timerRef.current = null;
                takePhoto();
                setFaceBox(null);
                setProgress(0);
              }, totalMs);
            }
          } else {
            // not fully inside: reset timer
            if (timerRef.current) {
              clearTimeout(timerRef.current);
              timerRef.current = null;
            }
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
            setProgress(0);
          }
        } else {
          // reset if no landmarks
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          setProgress(0);
          setFaceBox(null);
          if (videoRef.current) {
            videoRef.current.style.objectPosition = `50% 50%`;
            videoRef.current.style.clipPath = "none";
            videoRef.current.style.borderRadius = "12px";
          }
        }
      });

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          
          // Wait for video to be ready before starting camera instance
          await new Promise<void>((resolve) => {
            if (videoRef.current) {
              videoRef.current.onloadedmetadata = () => {
                resolve();
              };
            }
          });

          // Ensure video dimensions are available
          await videoRef.current.play();

          cameraInstance = new CameraCtor(videoRef.current, {
            onFrame: async () => {
              // Check if video element and dimensions are valid before sending to faceMesh
              if (videoRef.current && 
                  videoRef.current.videoWidth > 0 && 
                  videoRef.current.videoHeight > 0 &&
                  videoRef.current.readyState >= 2) {
                await faceMesh.send({ image: videoRef.current });
              }
            },
            width: 640,
            height: 480,
          });
          cameraInstance.start();
        }
      } catch (err) {
        console.error("Camera error:", err);
        alert("Camera access denied or unavailable.");
      }
    };

    init();

    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      // attempt to stop camera instance if created
      try {
        if (cameraInstance && typeof cameraInstance.stop === "function") cameraInstance.stop();
      } catch (e) {}
      // attempt to close faceMesh if available
      try {
        if (faceMesh && typeof faceMesh.close === "function") faceMesh.close();
      } catch (e) {}
    };
  }, [open]);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    if (onCapture) onCapture(imageData);

    if (stream) stream.getTracks().forEach((t) => t.stop());
    setTimeout(onClose, 500);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="relative bg-white mt-[10%] w-full h-full rounded-4xl p-6 flex flex-col items-center space-y-4 shadow-lg">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black transition"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative w-64 h-64">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full bg-black object-cover camera-video-transition"
          />

          {/* Progress circle that fills up over 4 seconds */}
          {faceBox && (() => {
            const rect = videoRef.current?.getBoundingClientRect();
            const vw = rect?.width ?? 256;
            const vh = rect?.height ?? 256;

            const centerX = faceBox.x + faceBox.width / 2;
            const centerY = faceBox.y + faceBox.height / 2;
            const radius = Math.round(Math.max(faceBox.width, faceBox.height) / 2);

            const objectPos = `${(centerX / vw) * 100}% ${(centerY / vh) * 100}%`;
            if (videoRef.current) {
              videoRef.current.style.objectPosition = objectPos;
              videoRef.current.style.clipPath = `circle(${radius}px at 50% 50%)`;
              videoRef.current.style.borderRadius = "50%";
            }

            // Calculate circle circumference for progress
            const circumference = 2 * Math.PI * 48;
            const offset = circumference - (progress / 100) * circumference;

            return (
              <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{
                  width: `${radius * 2}px`,
                  height: `${radius * 2}px`,
                }}
              >
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  style={{
                    transform: "rotate(-90deg)",
                  }}
                >
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="rgba(0, 255, 0, 0.2)"
                    strokeWidth="4"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="none"
                    stroke="#00FF00"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                      transition: "stroke-dashoffset 0.05s linear",
                    }}
                  />
                </svg>
              </div>
            );
          })()}
        </div>
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
};

export default CameraCapture;
