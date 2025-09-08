import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import { VocabularyQuiz, VocabularyList } from './components';
import { DataManager } from './utils/dataManager';
import type { VocabularyItem, FrozenWord } from './data-types';

// Top Header Component with Dutch Learning branding and main navigation
const AppHeader = () => {
  return (
    <header className="bg-gradient-to-r from-orange-500 to-blue-600 text-white shadow-xl fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Dutch Learning Branding */}
        <div className="flex items-center space-x-3">
          <div className="text-3xl">🇳🇱</div>
          <div>
            <h1 className="text-xl font-bold">Learning Dutch</h1>
            <p className="text-xs opacity-80">Master Nederlands</p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex space-x-4">
          <NavLink
            to="/quiz"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-white/20 text-white shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="text-lg">📚</span>
            <span className="font-medium">Quiz Mode</span>
          </NavLink>
          
          <NavLink
            to="/vocabulary"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-white/20 text-white shadow-md'
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <span className="text-lg">📝</span>
            <span className="font-medium">Vocabulary</span>
          </NavLink>
        </nav>

        {/* Version Info */}
        <div className="text-xs text-white/60">v1.0.0</div>
      </div>
    </header>
  );
};

// Left Configuration Sidebar Component
const ConfigSidebar = ({ onExportData, onImportData, onResetProgress }: {
  onExportData: () => void;
  onImportData: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onResetProgress: () => void;
}) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/quiz':
        return '🎯 Quiz Configuration';
      case '/vocabulary':
        return '⚙️ Vocabulary Settings';
      default:
        return '⚙️ Settings';
    }
  };

  const getPageDescription = () => {
    switch (location.pathname) {
      case '/quiz':
        return 'Manage your quiz data and progress';
      case '/vocabulary':
        return 'Import/export vocabulary data';
      default:
        return 'App configuration';
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen fixed left-0 top-16 flex flex-col shadow-lg z-30">
      {/* Configuration Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">{getPageTitle()}</h2>
        <p className="text-sm text-gray-600">{getPageDescription()}</p>
      </div>

      {/* Configuration Controls */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Data Management</h3>
            <div className="space-y-2">
              <button
                onClick={onExportData}
                className="w-full flex items-center justify-start space-x-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors border border-green-200"
              >
                <span className="text-lg">💾</span>
                <div className="text-left">
                  <div className="font-medium">Export Data</div>
                  <div className="text-xs text-green-600">Download backup file</div>
                </div>
              </button>
              
              <label className="w-full flex items-center justify-start space-x-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer">
                <span className="text-lg">📁</span>
                <div className="text-left">
                  <div className="font-medium">Import Data</div>
                  <div className="text-xs text-blue-600">Upload backup file</div>
                </div>
                <input
                  type="file"
                  accept=".json"
                  onChange={onImportData}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Reset Options</h3>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all progress? This action cannot be undone.')) {
                  onResetProgress();
                }
              }}
              className="w-full flex items-center justify-start space-x-3 px-4 py-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
            >
              <span className="text-lg">🔄</span>
              <div className="text-left">
                <div className="font-medium">Reset Progress</div>
                <div className="text-xs text-red-600">Clear all learning data</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [frozenWords, setFrozenWords] = useState<FrozenWord[]>([]);
  const [availableWords, setAvailableWords] = useState<VocabularyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataManager] = useState(() => DataManager.getInstance());

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await dataManager.loadData();
      setVocabulary(data.vocabulary);
      setFrozenWords(data.frozenWords);
      updateAvailableWords(data.vocabulary, data.frozenWords);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [dataManager]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const updateAvailableWords = (vocab: VocabularyItem[], frozen: FrozenWord[]) => {
    const frozenDutchWords = frozen.map(fw => fw.dutch);
    const available = vocab.filter(word => !frozenDutchWords.includes(word.dutch));
    setAvailableWords(available);
  };

  const handleUpdateRating = async (dutchWord: string, meaningIndex: number, change: number) => {
    try {
      await dataManager.updateWordRating(dutchWord, meaningIndex, change);
      await dataManager.updateStats(change > 0);
      
      // Refresh data
      const currentData = dataManager.getCurrentData();
      if (currentData) {
        setVocabulary([...currentData.vocabulary]);
      }
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  const handleFreezeWord = async (dutchWord: string) => {
    try {
      await dataManager.freezeWord(dutchWord);
      
      // Refresh data
      const data = await dataManager.loadData();
      setFrozenWords(data.frozenWords);
      updateAvailableWords(vocabulary, data.frozenWords);
    } catch (error) {
      console.error('Error freezing word:', error);
    }
  };

  const handleDecreaseFreezeCounters = async () => {
    try {
      await dataManager.decreaseFreezeCounters();
      
      // Refresh data
      const data = await dataManager.loadData();
      setFrozenWords(data.frozenWords);
      updateAvailableWords(vocabulary, data.frozenWords);
    } catch (error) {
      console.error('Error decreasing freeze counters:', error);
    }
  };

  const handleResetAllProgress = async () => {
    try {
      await dataManager.resetAllProgress();
      await loadData();
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  // Export data functionality
  const handleExportData = async () => {
    try {
      const exportedData = await dataManager.exportData();
      const blob = new Blob([exportedData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dutch-learning-backup.json';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    }
  };

  // Import data functionality
  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          await dataManager.importData(content);
          await loadData();
          alert('Data imported successfully!');
        } catch (error) {
          console.error('Error importing data:', error);
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🇳🇱</div>
          <div className="text-2xl font-semibold text-indigo-900 mb-2">Loading Dutch Learning App...</div>
          <div className="text-sm text-indigo-700">Preparing your vocabulary...</div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Top Header with Dutch Learning branding and main navigation */}
        <AppHeader />
        
        {/* Left Configuration Sidebar */}
        <ConfigSidebar 
          onExportData={handleExportData}
          onImportData={handleImportData}
          onResetProgress={handleResetAllProgress}
        />

        {/* Main Content Area */}
        <main className="ml-80 pt-16 min-h-screen">
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/quiz" replace />} />
              <Route 
                path="/quiz" 
                element={
                  <VocabularyQuiz 
                    vocabulary={vocabulary}
                    availableWords={availableWords}
                    onUpdateRating={handleUpdateRating}
                    onFreezeWord={handleFreezeWord}
                    onDecreaseFreezeCounters={handleDecreaseFreezeCounters}
                    onResetRatings={handleResetAllProgress}
                    frozenWords={frozenWords}
                  />
                } 
              />
              <Route 
                path="/vocabulary" 
                element={
                  <VocabularyList 
                    vocabulary={vocabulary} 
                    frozenWords={frozenWords} 
                  />
                } 
              />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
