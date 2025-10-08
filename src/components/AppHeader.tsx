import { NavLink } from "react-router-dom";

export const AppHeader = () => {
  return (
    <header className="bg-gradient-to-r from-orange-500 to-blue-600 text-white shadow-xl fixed top-0 left-0 right-0  z-[9999]">
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
                  ? "bg-white/20 text-white shadow-md"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span className="text-lg">📚</span>
            <span className="font-medium">Quiz Mode</span>
          </NavLink>

          <NavLink
            to="/exercises"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-white/20 text-white shadow-md"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <span className="font-medium">More Exercises</span>
          </NavLink>

          <NavLink
            to="/vocabulary"
            className={({ isActive }) =>
              `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-white/20 text-white shadow-md"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
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
