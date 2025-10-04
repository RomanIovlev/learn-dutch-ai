import React, { useState, useEffect } from "react";
import type { VocabularyItem } from "../../data-types";
import { X, Plus, Trash2 } from "lucide-react";

interface VocabularyItemCardProps {
  item: VocabularyItem;
  index: number;
  wordsToDelete?: number[];
  onDeleteWord?: (wordId: number) => void;
  wordsToAdd?: number[];
  onAddWord?: (wordId: number) => void;
  selectedCard: number | null;
  setSelectedCard: (index: number | null) => void;
}

const VocabularyItemCard: React.FC<VocabularyItemCardProps> = ({
  item,
  index,
  onDeleteWord,
  wordsToDelete,
  wordsToAdd,
  onAddWord,
  selectedCard,
  setSelectedCard,
}) => {
  const [popupPosition, setPopupPosition] = useState({
    x: 0,
    y: 0,
    direction: "right",
  });
  const switchingRef = React.useRef(false);

  // Determine if popup should appear on left or right side
  const getPopupDirection = (cardElement: HTMLButtonElement) => {
    const rect = cardElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const popupWidth = 448; // max-w-[28rem] = 448px

    // Check if there's enough space to the right
    const spaceRight = viewportWidth - rect.right;
    const spaceLeft = rect.left;

    // Prefer right side, but use left if not enough space on right and more space on left
    if (spaceRight < popupWidth + 32 && spaceLeft > spaceRight) {
      return "left";
    }
    return "right";
  };

  const handleCardClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Always close current popup first
    if (selectedCard === item.id) {
      // Close popup if clicking the same card
      setSelectedCard(null);
    } else {
      // Store the element reference and set switching flag
      const cardElement = event.currentTarget;
      const direction = getPopupDirection(cardElement);
      switchingRef.current = true;

      // Close any open popup and open new one
      setSelectedCard(null);
      // Use setTimeout to ensure the state update completes before opening new popup
      setTimeout(() => {
        setPopupPosition({ x: 0, y: 0, direction });
        setSelectedCard(item.id);
        switchingRef.current = false;
      }, 0);
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Don't close if we're in the middle of switching cards
      if (switchingRef.current) return;

      // Check if click is outside both the card and the popup
      if (
        selectedCard !== null &&
        !target.closest("[data-card-details]") &&
        !target.closest("[data-card-container]")
      ) {
        setSelectedCard(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [selectedCard, setSelectedCard]);

  const getRatingColor = (rating: number = 0) => {
    if (rating === 15) return "bg-success text-white border-success";
    if (rating >= 10)
      return "bg-progress-strong text-white border-progress-strong";
    if (rating >= 5) return "bg-warning text-white border-warning";
    if (rating >= 1) return "bg-progress-weak text-white border-progress-weak";
    return "badge-gray";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fruits":
        return "🍎";
      case "common":
        return "⭐";
      default:
        return "📖";
    }
  };

  // Simplified safety checks
  if (!item?.meanings?.[0]?.meaning) {
    return null;
  }

  const maxRating = Math.max(item.rating, 0);

  return (
    <div
      className={`bg-gradient-to-br from-white to-gray-50 rounded-sm shadow-lg hover:shadow-2xl transition-all duration-300 relative cursor-pointer transform hover:-translate-y-1 border overflow-visible group ${
        wordsToDelete?.includes(item.id)
          ? "border-red-300 bg-red-50/50"
          : wordsToAdd?.includes(item.id)
          ? "border-green-300 bg-green-50/50"
          : "border-gray-100"
      } ${
        selectedCard === item.id ? "z-[9998] ring-indigo-400 shadow-xl" : "z-10"
      }`}
      data-card-details
    >
      <div
        className={`absolute top-0 left-0 w-full h-1 ${
          wordsToDelete?.includes(item.id)
            ? "bg-gradient-to-r from-red-400 via-red-500 to-red-600"
            : wordsToAdd?.includes(item.id)
            ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600"
            : "bg-gradient-to-r from-brand-400 via-brand-500 to-brand-600"
        }`}
      ></div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="font-bold bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent mb-1">
              {item.word}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 ml-2">
            {/* Add/Remove from wordsToAdd - only show if not in wordsToDelete */}
            {wordsToAdd && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddWord?.(item.id);
                }}
                className={`p-2 rounded-full transition-all duration-200 ${
                  wordsToAdd?.includes(item.id)
                    ? "bg-green-500 text-white shadow-lg"
                    : "bg-gray-100 text-secondary hover:bg-green-100 hover:text-green-600"
                }`}
                title={
                  wordsToAdd?.includes(item.id)
                    ? "Remove from add list"
                    : "Add to add list"
                }
              >
                <Plus className="w-4 h-4" />
              </button>
            )}

            {/* Delete button - only show if not in wordsToAdd */}
            {wordsToDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteWord?.(item.id);
                }}
                className={`p-2 rounded-full transition-all duration-200 ${
                  wordsToDelete?.includes(item.id)
                    ? "bg-red-500 text-white shadow-lg"
                    : "bg-gray-100 text-secondary hover:bg-red-100 hover:text-red-600"
                }`}
                title={
                  wordsToDelete?.includes(item.id)
                    ? "Remove from delete list"
                    : "Add to delete list"
                }
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Click hint */}
        <button
          onClick={(event) => {
            event.stopPropagation();
            handleCardClick(event);
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 text-white text-xs px-2 py-1 rounded-full font-medium pointer-events-auto"
        >
          {selectedCard === item.id ? "Click to close" : "Click for details"}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-2">
        <div
          className="h-full bg-gradient-to-r from-indigo-400 to-blue-500 transition-all duration-500"
          style={{ width: `${(maxRating / 15) * 100}%` }}
        ></div>
      </div>

      {/* Enhanced Click Popover */}
      {selectedCard === item.id && (
        <div
          className={`absolute z-[9999] bg-gradient-to-br from-white via-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-2xl shadow-2xl p-6 min-w-96 max-w-[28rem] backdrop-blur-sm animate-in fade-in duration-200 ${
            popupPosition.direction === "left"
              ? "right-full top-0 mr-4"
              : "left-full top-0 ml-4"
          }`}
          style={{
            maxHeight: "calc(100vh - 100px)",
            overflowY: "auto",
          }}
          data-card-container
        >
          {/* Close button */}
          <button
            onClick={(e) => {
              setSelectedCard(null);
            }}
            className="absolute top-2 right-2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors text-secondary hover:text-secondary z-10"
            title="Close"
          >
            <X className="w-3 h-3" />
          </button>

          <div
            className={`absolute top-6 w-4 h-4 bg-gradient-to-br from-white to-blue-50 border-2 border-indigo-200 transform rotate-45 ${
              popupPosition.direction === "left"
                ? "-right-2 border-r-0 border-b-0"
                : "-left-2 border-l-0 border-t-0"
            }`}
          ></div>

          <div className="mb-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{getCategoryIcon(item.category)}</span>
              <h4 className="font-bold text-lg bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent">
                {item.word}
              </h4>
            </div>

            <div className="space-y-4">
              {item.meanings.map((meaning, meaningIndex) => (
                <div
                  key={meaningIndex}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-indigo-100 hover:bg-white/90 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-secondary text-lg">
                      {meaning.meaning}
                    </span>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getRatingColor(
                        item.rating
                      )}`}
                    >
                      {item.rating}/15
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-secondary mb-3">
                    <span className="bg-gray-100 px-2 py-1 rounded-full font-medium">
                      {item.partOfSpeech}
                    </span>
                    {meaning.context && (
                      <span className="italic">{meaning.context}</span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded-lg border border-indigo-100">
                      {meaning.example && (
                        <div className="text-indigo-700 font-semibold mb-1 text-sm">
                          🇳🇱 {meaning.example}
                        </div>
                      )}
                      {meaning.exampleTranslation && (
                        <div className="text-secondary text-sm">
                          🇬🇧 {meaning.exampleTranslation}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Grammatical Forms Section */}
                  {(item.verb ||
                    item.noun ||
                    item.adjective ||
                    item.numeral) && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-brand-50 to-indigo-50 rounded-lg border border-brand-100">
                      <h5 className="font-semibold text-brand-700 mb-2 text-sm flex items-center gap-1">
                        📚 Grammar Forms
                      </h5>

                      {/* Verb Forms */}
                      {item.verb && (
                        <div className="mb-3 last:mb-0">
                          <div className="font-medium text-brand-600 text-xs mb-1">
                            🔄 Verb Conjugation
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="space-y-1">
                              <div>
                                <span className="font-medium">Present:</span>
                              </div>
                              <div className="text-secondary text-xs">
                                ik {item.verb.present.ik}
                                <br />
                                jij {item.verb.present.jij}
                                <br />
                                hij/zij {item.verb.present.hij}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div>
                                <span className="font-medium">Past:</span>
                              </div>
                              <div className="text-secondary text-xs">
                                sg: {item.verb.past.sg}
                                <br />
                                pl: {item.verb.past.pl}
                              </div>
                              <div>
                                <span className="font-medium">Perfect:</span>
                              </div>
                              <div className="text-secondary text-xs">
                                {item.verb.perfect.aux}{" "}
                                {item.verb.perfect.participle}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Noun Forms */}
                      {item.noun && (
                        <div className="mb-3 last:mb-0">
                          <div className="font-medium text-brand-600 text-xs mb-1">
                            🏷️ Noun Forms
                          </div>
                          <div className="text-xs space-y-1">
                            <div>
                              <span className="font-medium">Article:</span>{" "}
                              <span className="text-secondary">
                                {item.noun.indefiniteArticle}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Plural:</span>{" "}
                              <span className="text-secondary">
                                {item.noun.plural}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Diminutive:</span>{" "}
                              <span className="text-secondary">
                                {item.noun.diminutive}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Adjective Forms */}
                      {item.adjective && (
                        <div className="mb-3 last:mb-0">
                          <div className="font-medium text-brand-600 text-xs mb-1">
                            ✨ Adjective Forms
                          </div>
                          <div className="text-xs space-y-1">
                            <div>
                              <span className="font-medium">De-form:</span>{" "}
                              <span className="text-secondary">
                                {item.adjective.deForm}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Comparative:</span>{" "}
                              <span className="text-secondary">
                                {item.adjective.comparison}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Superlative:</span>{" "}
                              <span className="text-secondary">
                                {item.adjective.superlative}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Numeral Forms */}
                      {item.numeral && (
                        <div className="mb-3 last:mb-0">
                          <div className="font-medium text-brand-600 text-xs mb-1">
                            🔢 Numeral Forms
                          </div>
                          <div className="text-xs space-y-1">
                            <div>
                              <span className="font-medium">Value:</span>{" "}
                              <span className="text-secondary">
                                {item.numeral.numericValue}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium">Ordinal:</span>{" "}
                              <span className="text-secondary">
                                {item.numeral.ordinalForm}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-400 to-blue-500 transition-all duration-500"
                      style={{
                        width: `${(item.rating / 15) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyItemCard;
