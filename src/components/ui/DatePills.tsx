import React, { useState, useEffect, useRef } from 'react';

interface DatePillsProps {
  selected: Date | null;
  onSelect: (date: Date) => void;
}

const DatePills: React.FC<DatePillsProps> = ({ selected, onSelect }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(new Date());
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dayLabels = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

  const getWeekStart = (date: Date): Date => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getWeekDates = (weekStart: Date): Date[] => {
    const dates: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  useEffect(() => {
    const today = new Date();
    setCurrentWeekStart(getWeekStart(today));
  }, []);

  const weekDates = getWeekDates(currentWeekStart);

  const goToPreviousWeek = () => {
    setIsAnimating(true);
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToNextWeek = () => {
    setIsAnimating(true);
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const isDateSelected = (date: Date): boolean => {
    if (!selected) return false;
    return date.toDateString() === selected.toDateString();
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
      goToNextWeek();
    } else if (isRightSwipe) {
      // Add haptic feedback if available
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
      goToPreviousWeek();
    }
  };

  return (
    <div className="date-pills-container w-full">
      <div 
        ref={containerRef}
        className={`date-pills w-full touch-pan-x ${isAnimating ? 'animating' : ''}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {weekDates.map((date, idx) => {
          const isActive = isDateSelected(date);
          const isTodayDate = isToday(date);
          const isPast = isPastDate(date);
          return (
            <button
              key={date.toISOString()}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(date)}
              className={`date-pill ${isActive ? 'active' : ''} ${isTodayDate ? 'today' : ''} ${isPast ? 'past' : ''}`}
            >
              <div className="date-num">{date.getDate()}</div>
              <span className="date-day">{dayLabels[idx] ?? ''}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DatePills;
