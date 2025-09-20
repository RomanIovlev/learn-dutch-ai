import { VocabularyItem } from "../types/vocabulary";
import { FrozenWord } from "./FrozenWord";
import { LearningStats } from "./LearningStats";

export interface AppData {
  vocabulary: VocabularyItem[];
  frozenWords: FrozenWord[];
  stats: LearningStats;
  version: string;
}
