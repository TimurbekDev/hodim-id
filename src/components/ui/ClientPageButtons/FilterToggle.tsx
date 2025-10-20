interface FilterToggleProps {
    value: ('vse'| 'naRabote'| 'nePriwel');
    onChange: (v: 'vse' | 'naRabote' | 'nePriwel') => void;
}

const FilterToggle: React.FC<FilterToggleProps> = ({
    value = 'vse', 
    onChange = () => {},

}) => {
    return (
    <div className="flex w-full h-11.5 p-1 rounded-full bg-[#B4B8CC24] drop-shadow-sm">
        <button 
            type="button"
            aria-pressed={value === 'vse'}
            onClick={() => onChange('vse')}
            className={`border-0 bg-white w-full h-full rounded-full duration-150 ${
                value === 'vse'
                ? '!bg-white text-gray-900 shadow-sm'
                : "!bg-transparent text-gray-400"
            }`}

        >
            <p className="leading-none">Все ()</p>
        </button>
       <button 
            type="button"
            aria-pressed={value === 'vse'}
            onClick={() => onChange('naRabote')}
            className={`border-0 bg-white w-full h-full rounded-full duration-150 ${
                value === 'naRabote'
                ? '!bg-white text-gray-900 shadow-sm'
                : "!bg-transparent text-gray-400"
            }`}

        >
            <p className="leading-none">На работе ()</p>
        </button>
        <button 
            type="button"
            aria-pressed={value === 'vse'}
            onClick={() => onChange('nePriwel')}
            className={`border-0 bg-white w-full h-full rounded-full duration-150 ${
                value === 'nePriwel'
                ? '!bg-white text-gray-900 shadow-sm'
                : "!bg-transparent text-gray-400"
            }`}

        >
            <p className="leading-none">Не пришли ()</p>
        </button>
    </div>
  );
};

export default  FilterToggle;