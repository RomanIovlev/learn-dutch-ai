import { VocabularyItem } from './VocabularyItem';
import { FrozenWord } from './FrozenWord';

export interface VocabularyQuizProps {
  vocabulary: VocabularyItem[];
  availableWords: VocabularyItem[];
  onUpdateRating: (dutchWord: string, meaningIndex: number, change: number) => Promise<void>;
  onFreezeWord: (dutchWord: string) => Promise<void>;
  onDecreaseFreezeCounters: () => Promise<void>;
  onResetRatings: () => Promise<void>;
  frozenWords: FrozenWord[];
} 