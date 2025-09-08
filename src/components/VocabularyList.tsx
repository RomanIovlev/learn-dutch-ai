import React, { useState, useEffect } from 'react';
import type { VocabularyListProps, VocabularyItem } from '../data-types';

const VocabularyList: React.FC<VocabularyListProps> = ({ vocabulary, frozenWords }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'alphabetical' | 'rating'>('alphabetical');
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0, direction: 'right' });

  // Determine if popup should appear on left or right side
  const getPopupDirection = (cardElement: HTMLDivElement) => {
    const rect = cardElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const popupWidth = 448; // max-w-[28rem] = 448px
    
    // Check if there's enough space to the right
    const spaceRight = viewportWidth - rect.right;
    const spaceLeft = rect.left;
    
    // Prefer right side, but use left if not enough space on right and more space on left
    if (spaceRight < popupWidth + 32 && spaceLeft > spaceRight) {
      return 'left';
    }
    return 'right';
  };

  const handleCardClick = (index: number, event: React.MouseEvent<HTMLDivElement>) => {
    if (selectedCard === index) {
      // Close popup if clicking the same card
      setSelectedCard(null);
    } else {
      // Open popup for clicked card
      const cardElement = event.currentTarget;
      const direction = getPopupDirection(cardElement);
      setPopupPosition({ x: 0, y: 0, direction });
      setSelectedCard(index);
    }
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (selectedCard !== null && !target.closest('[data-card-container]')) {
        setSelectedCard(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [selectedCard]);

  // Pre-calculate the vocabularies to use in useEffect
  const filteredVocabulary = vocabulary && Array.isArray(vocabulary) ? vocabulary.filter(
    (item) =>
      item && item.dutch && 
      (item.dutch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.meanings && Array.isArray(item.meanings) && 
        item.meanings.some(meaning => 
          meaning && meaning.english && meaning.english.toLowerCase().includes(searchTerm.toLowerCase())
        )))
  ) : [];

  const sortedVocabulary = [...filteredVocabulary].sort((a, b) => {
    if (sortBy === 'rating') {
      // Sort by highest rating among all meanings
      const aMaxRating = (a.meanings && Array.isArray(a.meanings)) ? Math.max(...a.meanings.map(m => m?.rating || 0)) : 0;
      const bMaxRating = (b.meanings && Array.isArray(b.meanings)) ? Math.max(...b.meanings.map(m => m?.rating || 0)) : 0;
      return bMaxRating - aMaxRating;
    }
    return (a.dutch || '').localeCompare(b.dutch || '');
  });



  // Early return if vocabulary is not available
  if (!vocabulary || !Array.isArray(vocabulary)) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center p-8">
          <div className="text-xl text-gray-600">Loading vocabulary...</div>
        </div>
      </div>
    );
  }

  const getRatingColor = (rating: number = 0) => {
    if (rating === 15) return 'bg-green-100 text-green-800 border-green-200';
    if (rating >= 10) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (rating >= 5) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (rating >= 1) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRatingLabel = (rating: number = 0) => {
    if (rating === 15) return '✨ Known';
    if (rating >= 10) return '🔥 Strong';
    if (rating >= 5) return '📈 Learning';
    if (rating >= 1) return '🌱 Weak';
    return '🆕 New';
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fruits': return '🍎';
      case 'common': return '⭐';
      default: return '📖';
    }
  };

  const getWordCategories = (item: VocabularyItem) => {
    if (!item || !item.meanings || !Array.isArray(item.meanings)) {
      return ['unknown']; // Fallback category
    }
    const categories = Array.from(new Set(item.meanings.map(m => m?.category || 'unknown')));
    return categories;
  };

  // Calculate stats for all meanings
  const calculateStats = () => {
    let knownMeanings = 0;
    let strongMeanings = 0;
    let learningMeanings = 0;
    let weakMeanings = 0;
    let newMeanings = 0;

    // Safety check for vocabulary
    if (vocabulary && Array.isArray(vocabulary)) {
      vocabulary.forEach(word => {
        if (word?.meanings && Array.isArray(word.meanings)) {
          word.meanings.forEach(meaning => {
            if (typeof meaning?.rating === 'number') {
              if (meaning.rating === 15) knownMeanings++;
              else if (meaning.rating >= 10) strongMeanings++;
              else if (meaning.rating >= 5) learningMeanings++;
              else if (meaning.rating >= 1) weakMeanings++;
              else newMeanings++;
            }
          });
        }
      });
    }

    return { knownMeanings, strongMeanings, learningMeanings, weakMeanings, newMeanings };
  };

  const stats = calculateStats();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Stats Dashboard */}
      <div className="bg-gradient-to-br from-white via-indigo-50 to-blue-50 rounded-2xl shadow-2xl border border-indigo-100 p-8 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-2">
            🎯 Learning Progress
          </h2>
          <p className="text-indigo-600/70 text-sm">Track your Dutch vocabulary mastery</p>
        </div>
        <div className="grid grid-cols-5 gap-6 text-center">
          <div className="bg-gradient-to-br from-emerald-400 to-green-500 p-5 rounded-2xl shadow-xl border-0 transform hover:scale-105 transition-all duration-300 group">
            <div className="text-3xl font-bold text-white mb-1">{stats.knownMeanings}</div>
            <div className="text-emerald-100 text-sm font-medium">✨ Mastered</div>
            <div className="w-full h-1 bg-emerald-200 rounded-full mt-3">
              <div className="h-full bg-white rounded-full opacity-60" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-5 rounded-2xl shadow-xl border-0 transform hover:scale-105 transition-all duration-300 group">
            <div className="text-3xl font-bold text-white mb-1">{stats.strongMeanings}</div>
            <div className="text-blue-100 text-sm font-medium">🔥 Strong</div>
            <div className="w-full h-1 bg-blue-200 rounded-full mt-3">
              <div className="h-full bg-white rounded-full opacity-60" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-5 rounded-2xl shadow-xl border-0 transform hover:scale-105 transition-all duration-300 group">
            <div className="text-3xl font-bold text-white mb-1">{stats.learningMeanings}</div>
            <div className="text-yellow-100 text-sm font-medium">📈 Learning</div>
            <div className="w-full h-1 bg-yellow-200 rounded-full mt-3">
              <div className="h-full bg-white rounded-full opacity-60" style={{ width: '60%' }}></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-400 to-red-400 p-5 rounded-2xl shadow-xl border-0 transform hover:scale-105 transition-all duration-300 group">
            <div className="text-3xl font-bold text-white mb-1">{stats.weakMeanings}</div>
            <div className="text-orange-100 text-sm font-medium">🌱 Practicing</div>
            <div className="w-full h-1 bg-orange-200 rounded-full mt-3">
              <div className="h-full bg-white rounded-full opacity-60" style={{ width: '30%' }}></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-400 to-gray-500 p-5 rounded-2xl shadow-xl border-0 transform hover:scale-105 transition-all duration-300 group">
            <div className="text-3xl font-bold text-white mb-1">{stats.newMeanings}</div>
            <div className="text-slate-100 text-sm font-medium">🆕 Fresh</div>
            <div className="w-full h-1 bg-slate-200 rounded-full mt-3">
              <div className="h-full bg-white rounded-full opacity-60" style={{ width: '5%' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Sort Controls */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder="🔍 Search vocabulary... (try 'appel' or 'apple')"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 pl-14 text-lg rounded-2xl border-2 border-gray-200 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all duration-300 bg-gray-50 focus:bg-white placeholder-gray-400"
            />
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                title="Clear search"
                aria-label="Clear search"
              >
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setSortBy('alphabetical')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                sortBy === 'alphabetical'
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">📝</span>
              A-Z
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                sortBy === 'rating'
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="text-lg">⭐</span>
              Rating
            </button>
          </div>
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            📚 Vocabulary Collection
          </h2>
          <p className="text-gray-500 mt-1">{sortedVocabulary.length} words • {filteredVocabulary.length !== vocabulary.length ? `${filteredVocabulary.length} filtered` : 'All words'}</p>
        </div>
        <div className="hidden md:block">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"></span>
            <span>Click cards for details</span>
          </div>
        </div>
      </div>

      {/* Vocabulary Grid with proper containment */}
      <div className="relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedVocabulary.map((item, index) => {
            // Simplified safety checks
            if (!item?.meanings?.[0]?.english) {
              return null;
            }
            
            const primaryMeaning = item.meanings[0];
            const maxRating = Math.max(...item.meanings.map(m => m?.rating || 0));
            const categories = getWordCategories(item);
            
            return (
              <div 
                key={index} 
                className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 relative cursor-pointer transform hover:-translate-y-1 border border-gray-100 overflow-visible group ${
                  selectedCard === index ? 'z-[9998] ring-2 ring-indigo-400 shadow-xl' : 'z-10'
                }`}
                onClick={(event) => handleCardClick(index, event)}
                data-card-container
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-400 via-blue-500 to-purple-500"></div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="text-2xl font-bold bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent mb-1">
                        {item.dutch}
                      </div>
                    </div>
                  </div>
                  
                  {/* Click hint */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-black/80 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {selectedCard === index ? 'Click to close' : 'Click for details'}
                    </div>
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full h-2">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-400 to-blue-500 transition-all duration-500"
                    style={{ width: `${(maxRating / 15) * 100}%` }}
                  ></div>
                </div>

                {/* Enhanced Click Popover */}
                {selectedCard === index && (
                  <div 
                    className={`absolute z-[9999] bg-gradient-to-br from-white via-blue-50 to-indigo-50 border-2 border-indigo-200 rounded-2xl shadow-2xl p-6 min-w-96 max-w-[28rem] backdrop-blur-sm animate-in fade-in duration-200 ${
                      popupPosition.direction === 'left' 
                        ? 'right-full top-0 mr-4' 
                        : 'left-full top-0 ml-4'
                    }`}
                    style={{ 
                      maxHeight: 'calc(100vh - 100px)',
                      overflowY: 'auto'
                    }}
                    data-card-container
                  >
                    {/* Close button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCard(null);
                      }}
                      className="absolute top-2 right-2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors text-gray-600 hover:text-gray-800 z-10"
                      title="Close"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <div className={`absolute top-6 w-4 h-4 bg-gradient-to-br from-white to-blue-50 border-2 border-indigo-200 transform rotate-45 ${
                      popupPosition.direction === 'left' 
                        ? '-right-2 border-r-0 border-b-0' 
                        : '-left-2 border-l-0 border-t-0'
                    }`}></div>
                    
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-2xl">{getCategoryIcon(primaryMeaning.category)}</span>
                        <h4 className="font-bold text-lg bg-gradient-to-r from-indigo-700 to-blue-600 bg-clip-text text-transparent">
                          {item.dutch}
                        </h4>
                      </div>
                      
                      <div className="space-y-4">
                        {item.meanings.map((meaning, meaningIndex) => (
                          <div key={meaningIndex} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-indigo-100 hover:bg-white/90 transition-all duration-200">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-semibold text-gray-800 text-lg">{meaning.english}</span>
                              <div className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${getRatingColor(meaning.rating)}`}>
                                {meaning.rating}/15
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
                              <span className="bg-gray-100 px-2 py-1 rounded-full font-medium">{meaning.partOfSpeech}</span>
                              <span className="italic">{meaning.context}</span>
                            </div>
                            
                            <div className="space-y-2">
                              {meaning.examples.slice(0, 2).map((example, exampleIndex) => (
                                <div key={exampleIndex} className="bg-gradient-to-r from-indigo-50 to-blue-50 p-3 rounded-lg border border-indigo-100">
                                  <div className="text-indigo-700 font-semibold mb-1 text-sm">
                                    🇳🇱 {example.nl}
                                  </div>
                                  <div className="text-gray-700 text-sm">
                                    🇬🇧 {example.en}
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-3 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-400 to-blue-500 transition-all duration-500"
                                style={{ width: `${(meaning.rating / 15) * 100}%` }}
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
          })}
        </div>
      </div>

      {sortedVocabulary.length === 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No words found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? (
              <>No vocabulary words found matching "<span className="font-medium text-indigo-600">{searchTerm}</span>"</>
            ) : (
              'No vocabulary words available'
            )}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              Clear search
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default VocabularyList; 