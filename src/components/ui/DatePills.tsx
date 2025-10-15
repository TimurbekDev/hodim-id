import React from 'react';

interface DatePillsProps {
  days: number[];
  selected: number;
  onSelect: (index: number) => void;
}

const DatePills: React.FC<DatePillsProps> = ({ days, selected, onSelect }) => {
  const dayLabels = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  return (
    <div className="date-pills w-full">
      {days.map((d, idx) => {
        const key = idx + 1;
        const isActive = selected === key;
        return (
          <button
            key={key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(key)}
            className={`date-pill ${isActive ? 'active' : ''}`}
          >
            <div className="date-num">{d}</div>
            <span className="date-day">{dayLabels[idx] ?? ''}</span>
          </button>
        );
      })}
    </div>
  );
};

export default DatePills;
