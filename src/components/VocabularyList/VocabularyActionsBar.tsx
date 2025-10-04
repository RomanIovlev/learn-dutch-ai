import React from "react";
import { Plus, Trash2 } from "lucide-react";

interface VocabularyActionsBarProps {
  wordsToAdd?: number[];
  userWordsToDelete?: number[];
  onSubmit: () => void;
  isVisible?: boolean;
}

const VocabularyActionsBar: React.FC<VocabularyActionsBarProps> = ({
  wordsToAdd = [],
  userWordsToDelete = [],
  onSubmit,
  isVisible = true,
}) => {
  const hasActions = wordsToAdd.length > 0 || userWordsToDelete.length > 0;

  if (!isVisible || !hasActions) {
    return null;
  }

  return (
    <div className="fixed py-4 px-6 bottom-0 left-0 right-0 z-[9999] border-t-2 border-brand-200 bg-gradient-to-br from-white via-brand-50 to-brand-100 shadow-2xl backdrop-blur-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-center">
        <button
          onClick={onSubmit}
          className="border-2 border-brand-300 flex items-center gap-3 px-6 py-3 font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-white hover:bg-brand-50"
        >
          {wordsToAdd.length > 0 && (
            <>
              <Plus className="w-5 h-5 text-success" />
              <span className="text-secondary">
                Add {wordsToAdd.length} word
                {wordsToAdd.length === 1 ? "" : "s"} to vocabulary
              </span>
              <div className="bg-success px-2 py-1 rounded-full text-sm font-bold text-white">
                {wordsToAdd.length}
              </div>
            </>
          )}

          {userWordsToDelete.length > 0 && (
            <>
              <Trash2 className="w-5 h-5 text-danger" />
              <span className="text-secondary">
                Remove {userWordsToDelete.length} word
                {userWordsToDelete.length === 1 ? "" : "s"} from vocabulary
              </span>
              <div className="bg-danger px-2 py-1 rounded-full text-sm font-bold text-white">
                {userWordsToDelete.length}
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default VocabularyActionsBar;
