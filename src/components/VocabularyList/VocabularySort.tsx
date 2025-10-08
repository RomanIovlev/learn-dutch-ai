import React from "react";
import { SortOption } from "../../types/vocabulary";

interface SortOptionConfig {
  value: SortOption;
  label: string;
  icon: string;
}

interface VocabularySortProps {
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  options?: SortOptionConfig[];
  className?: string;
}

const VocabularySort: React.FC<VocabularySortProps> = ({
  sortBy,
  onSortChange,
  options = [
    { value: "alphabetical", label: "A-Z", icon: "📝" },
    { value: "rating", label: "Rating", icon: "⭐" },
  ],
  className = "",
}) => {
  return (
    <div className={`flex gap-3 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSortChange(option.value)}
          className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
            sortBy === option.value
              ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg"
              : "bg-gray-100 text-secondary hover:bg-gray-200"
          }`}
        >
          <span className="text-lg">{option.icon}</span>
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default VocabularySort;
