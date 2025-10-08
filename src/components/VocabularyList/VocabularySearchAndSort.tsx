import React from "react";
import VocabularySearch from "./VocabularySearch";
import VocabularySort from "./VocabularySort";
import { SortOption } from "../../types/vocabulary";

interface VocabularySearchAndSortProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  sortBy: SortOption;
  onSortChange: (sortBy: SortOption) => void;
  searchPlaceholder?: string;
  className?: string;
}

const VocabularySearchAndSort: React.FC<VocabularySearchAndSortProps> = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
  sortBy,
  onSortChange,
  searchPlaceholder,
  className = "",
}) => {
  return (
    <div
      data-testid="vocabulary-search-and-sort"
      className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8 ${className}`}
    >
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <VocabularySearch
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          onClearSearch={onClearSearch}
          placeholder={searchPlaceholder}
        />

        <VocabularySort sortBy={sortBy} onSortChange={onSortChange} />
      </div>
    </div>
  );
};

export default VocabularySearchAndSort;
