# 🇳🇱 Dutch Learning App with Cards Quiz

An interactive React-based application for learning Dutch vocabulary through an engaging flashcard quiz system. Master Dutch words with context, examples, and intelligent spaced repetition.

![Dutch Learning App](https://img.shields.io/badge/React-19.1.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-blue)

## ✨ Features

### 🎯 Interactive Quiz Mode

- **Flipping Cards**: Beautiful 3D card animations showing Dutch words and English translations
- **Multiple Choice Questions**: Smart answer generation with context-aware wrong options
- **Context Hints**: Part of speech and usage context for better understanding
- **Real Examples**: Authentic Dutch sentences with English translations

### 📚 Comprehensive Vocabulary System

- **Multiple Meanings**: Words with multiple English translations (e.g., "de bank" = bank/bench)
- **Rich Context**: Each meaning includes context, part of speech, and examples
- **Categorized Content**: Common words, fruits, numbers, and more
- **Progressive Learning**: Intelligent word selection based on your progress

### 🧠 Smart Learning Algorithm

- **Adaptive Rating System**: Words are rated 0-15 based on your performance
- **Spaced Repetition**: Higher-rated words appear less frequently
- **Freeze System**: Recently studied words are temporarily frozen
- **Progress Tracking**: Real-time statistics on correct/incorrect answers

### 💾 Data Management

- **Export/Import**: Backup and restore your learning progress
- **Persistent Storage**: Your progress is saved locally
- **Reset Options**: Start fresh or reset specific progress

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/learn-dutch-ai.git
   cd learn-dutch-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 How to Use

### Quiz Mode

1. **Start Learning**: The app automatically selects a Dutch word for you
2. **Read the Context**: Use the context hint to understand the word's usage
3. **Make Your Choice**: Select the correct English translation from multiple options
4. **See the Result**: The card flips to reveal the answer with examples
5. **Continue Learning**: Click anywhere to proceed to the next word

### Vocabulary Browser

- View all available vocabulary words
- See your progress for each word
- Browse by categories (common, fruits, numbers)

### Data Management

- **Export**: Download your learning progress as a JSON file
- **Import**: Upload a previously exported file to restore progress
- **Reset**: Clear all progress and start fresh

## 🏗️ Project Structure

```
src/
├── components/           # React components
│   ├── VocabularyQuiz.tsx    # Main quiz interface
│   └── VocabularyList.tsx    # Vocabulary browser
├── data/                # Vocabulary data
│   ├── data-common.ts        # Common Dutch words
│   ├── data-fruits.ts        # Fruit vocabulary
│   └── data-numbers.ts       # Number vocabulary
├── data-types/          # TypeScript interfaces
│   ├── VocabularyItem.ts     # Word structure
│   ├── LearningStats.ts      # Progress tracking
│   └── FrozenWord.ts         # Freeze system
├── utils/               # Utility functions
│   └── dataManager.ts        # Data persistence
└── App.tsx              # Main application component
```

## 🎨 Technology Stack

- **Frontend**: React 19.1.0 with TypeScript
- **Styling**: Tailwind CSS for responsive design
- **Routing**: React Router DOM for navigation
- **Icons**: Lucide React for beautiful icons
- **Build Tool**: Create React App with custom configuration

## 📊 Learning Algorithm

The app uses a sophisticated learning algorithm:

1. **Word Selection**:
   - 20% chance for new words (rating = 0)
   - 40% chance for well-known words (rating 10-14)
   - 30% chance for medium words (rating 5-9)
   - 10% chance for difficult words (rating 1-4)

2. **Rating System**:
   - Correct answer: +1 rating
   - Incorrect answer: -3 rating
   - Maximum rating: 15 (fully learned)

3. **Freeze System**:
   - Recently studied words are frozen
   - Frozen words gradually become available again
   - Prevents immediate repetition

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run test suite
- `npm run eject` - Eject from Create React App

## 📱 Features in Detail

### Card Interface

- **3D Flip Animation**: Smooth card transitions
- **Responsive Design**: Works on desktop and mobile
- **Visual Feedback**: Color-coded correct/incorrect answers

### Smart Quiz Generation

- **Context-Aware Options**: Wrong answers are relevant but not confusing
- **Multiple Meanings**: Each word can have several English translations
- **Example Sentences**: Real Dutch examples with English translations

### Progress Tracking

- **Real-time Stats**: Track correct, incorrect, and known words
- **Persistent Learning**: Progress saved between sessions
- **Export/Import**: Backup and restore functionality

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Dutch language data curated for effective learning
- React community for excellent documentation
- Tailwind CSS for beautiful styling utilities

---

**Start your Dutch learning journey today!** 🇳🇱✨
