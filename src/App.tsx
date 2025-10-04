import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  VocabularyList,
  VocabularyQuiz,
  VocabularyExercises,
} from "./components";
import { AppHeader } from "./components/AppHeader";

function App() {
  const [userId] = useState(1);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <AppHeader />

        <main className="pt-16 min-h-screen">
          <div className="p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/quiz" replace />} />
              <Route
                path="/quiz"
                element={<VocabularyQuiz userId={userId} />}
              />
              <Route
                path="/exercises"
                element={<VocabularyExercises userId={userId} />}
              />
              <Route
                path="/vocabulary"
                element={<VocabularyList userId={userId} />}
              />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
