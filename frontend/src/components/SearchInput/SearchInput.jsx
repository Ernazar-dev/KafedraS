import { FiSearch } from "react-icons/fi";
import { FaTimes } from "react-icons/fa";

const SearchInput = ({ value, onChange, placeholder = "Izlew..." }) => {
  return (
    <div className="relative flex items-center w-full md:w-72">
      <FiSearch className="absolute left-3.5 text-slate-400 text-base pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-9 py-2.5 rounded-xl border-2 border-slate-200 bg-[#f8fafc] text-[14px] text-slate-700 outline-none placeholder-slate-400 transition-all duration-200 focus:border-[#02135e] focus:bg-white focus:shadow-[0_0_0_4px_rgba(2,19,94,0.08)]"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 text-slate-400 hover:text-red-500 transition-colors duration-150"
        >
          <FaTimes className="text-xs" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;