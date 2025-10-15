import React from 'react';

interface RoleToggleProps {
  value: 'employee' | 'manager';
  onChange: (v: 'employee' | 'manager') => void;
}

const RoleToggle: React.FC<RoleToggleProps> = ({ value, onChange }) => {
  return (
    <div className="w-full mt-3">
      <div className="w-full flex bg-[#f3f4f6] rounded-full p-1">
        <button
          type="button"
          aria-pressed={value === 'employee'}
          onClick={() => onChange('employee')}
          className={`flex-1 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors duration-150 focus:outline-none ${
            value === 'employee'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'bg-transparent text-gray-400'
          }`}
        >
          <span className="leading-none">Сотрудник</span>
        </button>

        <button
          type="button"
          aria-pressed={value === 'manager'}
          onClick={() => onChange('manager')}
          className={`flex-1 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors duration-150 focus:outline-none ${
            value === 'manager'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'bg-transparent text-gray-400'
          }`}
        >
          <span className="leading-none">Руководитель</span>
        </button>
      </div>
    </div>
  );
};

export default RoleToggle;
