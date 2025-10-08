import React from "react";
import { Search, X } from "lucide-react";

interface VocabularySearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  placeholder?: string;
  className?: string;
}

const VocabularySearch: React.FC<VocabularySearchProps> = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  placeholder = "🔍 Search vocabulary... (try 'appel' or 'apple')",
  className = "",
}) => {
  return (
    <div className={`relative flex-1 w-full ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-6 py-4 pl-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-brand-400 focus:ring-4 focus:ring-brand-100 outline-none transition-all duration-300 bg-gray-50 focus:bg-white placeholder-secondary"
      />
      <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
        <Search className="h-6 w-6 text-brand-400" />
      </div>
      {searchTerm && (
        <button
          onClick={onClearSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
          title="Clear search"
          aria-label="Clear search"
        >
          <X className="h-5 w-5 text-secondary" />
        </button>
      )}
    </div>
  );
};

export default VocabularySearch;
