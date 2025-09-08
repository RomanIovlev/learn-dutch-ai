import type { VocabularyItem, AppData, LearningStats } from '../data-types';

// Type declaration for webpack's require.context
declare function require(id: string): any;
declare namespace require {
  interface Context {
    keys(): string[];
    (id: string): any;
  }
  function context(directory: string, useSubdirectories: boolean, regExp: RegExp): Context;
}

const DATA_FILE_NAME = 'dutch-learning-data.json';

export class DataManager {
  private static instance: DataManager;
  private data: AppData | null = null;
  private dynamicVocabulary: VocabularyItem[] | null = null;

  private constructor() {}

  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // Dynamically load all vocabulary data from data folder
  private async loadAllVocabularyData(): Promise<VocabularyItem[]> {
    if (this.dynamicVocabulary !== null) {
      return this.dynamicVocabulary;
    }

    const vocabularyData: VocabularyItem[] = [];

    try {
      // Use webpack's require.context to dynamically import all .ts files from data folder
      const dataContext = require.context('../data', false, /\.ts$/);
      
      // Get all file names
      const dataFiles = dataContext.keys();
      
      for (const filePath of dataFiles) {
        try {
          const module = dataContext(filePath);
          
          // Extract all exported arrays of VocabularyItem from each module
          Object.keys(module).forEach(exportKey => {
            const exportedData = module[exportKey];
            
            // Check if it's an array of VocabularyItem objects
            if (Array.isArray(exportedData) && 
                exportedData.length > 0 && 
                exportedData[0]?.dutch && 
                exportedData[0]?.meanings) {
              vocabularyData.push(...exportedData);
            }
          });
          
        } catch (fileError) {
          console.warn(`Failed to load data file ${filePath}:`, fileError);
        }
      }
      
    } catch (error) {
      console.error('Error loading vocabulary data:', error);
      // Fallback to empty array if dynamic loading fails
    }

    this.dynamicVocabulary = vocabularyData;
    console.log(`Loaded ${vocabularyData.length} vocabulary items from ${this.dynamicVocabulary.length > 0 ? 'dynamic' : 'fallback'} sources`);
    
    return vocabularyData;
  }

  // Get default stats
  private getDefaultStats(): LearningStats {
    return {
      totalCorrect: 0,
      totalIncorrect: 0,
      sessionCorrect: 0,
      sessionIncorrect: 0,
      lastSessionDate: new Date().toISOString().split('T')[0]
    };
  }

  // Load data from localStorage (simulating file-based storage in browser)
  async loadData(): Promise<AppData> {
    try {
      const savedData = localStorage.getItem(DATA_FILE_NAME);
      if (savedData) {
        const parsedData: AppData = JSON.parse(savedData);
        this.data = parsedData;
        return parsedData;
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }

    // Return default data if no saved data found
    return this.getDefaultData();
  }

  // Save data to localStorage
  async saveData(data: AppData): Promise<void> {
    try {
      this.data = data;
      localStorage.setItem(DATA_FILE_NAME, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }

  // Get default data structure
  private async getDefaultData(): Promise<AppData> {
    const vocabulary = await this.loadAllVocabularyData();
    
    return {
      vocabulary,
      frozenWords: [],
      stats: this.getDefaultStats(),
      version: '1.0.0'
    };
  }

  // Update vocabulary item rating for specific meaning
  async updateWordRating(dutchWord: string, meaningIndex: number, change: number): Promise<void> {
    if (!this.data) {
      this.data = await this.loadData();
    }

    const wordIndex = this.data.vocabulary.findIndex(word => word.dutch === dutchWord);
    if (wordIndex !== -1 && this.data.vocabulary[wordIndex].meanings[meaningIndex]) {
      const currentRating = this.data.vocabulary[wordIndex].meanings[meaningIndex].rating;
      this.data.vocabulary[wordIndex].meanings[meaningIndex].rating = Math.max(0, Math.min(15, currentRating + change));
      await this.saveData(this.data);
    }
  }

  // Freeze a word
  async freezeWord(dutchWord: string): Promise<void> {
    if (!this.data) {
      this.data = await this.loadData();
    }

    const existingIndex = this.data.frozenWords.findIndex(fw => fw.dutch === dutchWord);
    if (existingIndex !== -1) {
      this.data.frozenWords[existingIndex].remainingTurns = 4;
    } else {
      this.data.frozenWords.push({ dutch: dutchWord, remainingTurns: 4 });
    }
    await this.saveData(this.data);
  }

  // Decrease freeze counters
  async decreaseFreezeCounters(): Promise<void> {
    if (!this.data) {
      this.data = await this.loadData();
    }

    this.data.frozenWords = this.data.frozenWords
      .map(fw => ({ ...fw, remainingTurns: fw.remainingTurns - 1 }))
      .filter(fw => fw.remainingTurns > 0);

    await this.saveData(this.data);
  }

  // Update learning stats
  async updateStats(correct: boolean): Promise<void> {
    if (!this.data) {
      this.data = await this.loadData();
    }

    const today = new Date().toISOString().split('T')[0];
    
    // Reset session stats if it's a new day
    if (this.data.stats.lastSessionDate !== today) {
      this.data.stats.sessionCorrect = 0;
      this.data.stats.sessionIncorrect = 0;
      this.data.stats.lastSessionDate = today;
    }

    if (correct) {
      this.data.stats.totalCorrect++;
      this.data.stats.sessionCorrect++;
    } else {
      this.data.stats.totalIncorrect++;
      this.data.stats.sessionIncorrect++;
    }

    await this.saveData(this.data);
  }

  // Reset all progress
  async resetAllProgress(): Promise<void> {
    const defaultData = await this.getDefaultData();
    this.data = defaultData;
    await this.saveData(defaultData);
  }

  // Get current data
  getCurrentData(): AppData | null {
    return this.data;
  }

  // Get available words (not frozen)
  async getAvailableWords(): Promise<VocabularyItem[]> {
    if (!this.data) {
      this.data = await this.loadData();
    }

    const frozenDutchWords = this.data.frozenWords.map(fw => fw.dutch);
    const allVocabulary = await this.loadAllVocabularyData();
    return allVocabulary.filter(word => !frozenDutchWords.includes(word.dutch));
  }

  // Export data for backup
  async exportData(): Promise<string> {
    if (!this.data) {
      const defaultData = await this.getDefaultData();
      return JSON.stringify(defaultData, null, 2);
    }
    return JSON.stringify(this.data, null, 2);
  }

  // Import data from backup
  async importData(jsonData: string): Promise<void> {
    try {
      const importedData: AppData = JSON.parse(jsonData);
      // Validate the data structure
      if (importedData.vocabulary && Array.isArray(importedData.vocabulary)) {
        this.data = importedData;
        await this.saveData(importedData);
      } else {
        throw new Error('Invalid data format');
      }
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
} 