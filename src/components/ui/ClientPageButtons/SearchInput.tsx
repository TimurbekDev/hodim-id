import SearchIcon from '@/assets/icons/search_icon.svg';

const SearchInput: React.FC = () => {
  return (
    <div className="relative w-full">
      <img
        src={SearchIcon}
        alt="Search"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-60"
      />
      <input
        type="text"
        placeholder="Найти сотрудника"
        className="w-full border-0 h-9 bg-gray-100 rounded-full pl-10 pr-3 placeholder:!font-normal 
                   placeholder:font-normal text-[17px] focus:outline-none"
      />
    </div>
  );
};

export default SearchInput;
