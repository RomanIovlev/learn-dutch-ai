import React from "react";

interface EmptyStateProps {
  searchTerm?: string;
  onClearSearch?: () => void;
  title?: string;
  description?: string;
  icon?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  searchTerm,
  onClearSearch,
  title = "No words found",
  description,
  icon = "🔍",
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-secondary mb-2">{title}</h3>
      {description && <p className="text-secondary mb-4">{description}</p>}
      {searchTerm && (
        <>
          <p className="text-secondary mb-4">
            No vocabulary words found matching "
            <span className="font-medium text-brand-600">{searchTerm}</span>"
          </p>
          {onClearSearch && (
            <button
              onClick={onClearSearch}
              className="px-6 py-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-xl font-medium hover:from-brand-600 hover:to-brand-700 transition-all duration-300 transform hover:scale-105"
            >
              Clear search
            </button>
          )}
        </>
      )}
      {!description && !searchTerm && (
        <p className="text-secondary mb-4">No vocabulary words available</p>
      )}
    </div>
  );
};

export default EmptyState;
