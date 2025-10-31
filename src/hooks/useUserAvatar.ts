// src/hooks/useUserAvatar.ts
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { getMyAvatarUrl } from "@/requests/Client/ClientReqeusts";

export function useUserAvatar() {
  const { accessToken } = useAuth();

  return useQuery({
    queryKey: ["my-avatar-url", accessToken],
    enabled: !!accessToken,
    staleTime: 60_000,
    queryFn: () => getMyAvatarUrl(accessToken!),
  });
}
