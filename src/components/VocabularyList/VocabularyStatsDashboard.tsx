import React from "react";

export interface VocabularyStats {
  knownMeanings: number;
  strongMeanings: number;
  learningMeanings: number;
  weakMeanings: number;
  newMeanings: number;
}

interface VocabularyStatsDashboardProps {
  stats: VocabularyStats;
  title?: string;
  subtitle?: string;
  className?: string;
}

const VocabularyStatsDashboard: React.FC<VocabularyStatsDashboardProps> = ({
  stats,
  title = "🎯 Learning Progress",
  subtitle = "Track your Dutch vocabulary mastery",
  className = "",
}) => {
  const statCards = [
    {
      value: stats.knownMeanings,
      label: "✨ Mastered",
      bgGradient: "from-emerald-400 to-green-500",
      textColor: "text-emerald-100",
      progressColor: "bg-emerald-200",
      progressWidth: "100%",
    },
    {
      value: stats.strongMeanings,
      label: "🔥 Strong",
      bgGradient: "from-blue-400 to-blue-600",
      textColor: "text-blue-100",
      progressColor: "bg-blue-200",
      progressWidth: "85%",
    },
    {
      value: stats.learningMeanings,
      label: "📈 Learning",
      bgGradient: "from-amber-400 to-yellow-500",
      textColor: "text-yellow-100",
      progressColor: "bg-yellow-200",
      progressWidth: "60%",
    },
    {
      value: stats.weakMeanings,
      label: "🌱 Practicing",
      bgGradient: "from-orange-400 to-red-400",
      textColor: "text-orange-100",
      progressColor: "bg-orange-200",
      progressWidth: "30%",
    },
    {
      value: stats.newMeanings,
      label: "🆕 Fresh",
      bgGradient: "from-slate-400 to-gray-500",
      textColor: "text-slate-100",
      progressColor: "bg-slate-200",
      progressWidth: "5%",
    },
  ];

  return (
    <div
      data-testid="vocabulary-stats-dashboard"
      className={`bg-gradient-to-br from-white via-brand-50 to-brand-100 rounded-2xl shadow-2xl border border-brand-100 p-8 mb-8 ${className}`}
    >
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-600 to-brand-700 bg-clip-text text-transparent mb-2">
          {title}
        </h2>
        <p className="text-brand-600/70 text-sm">{subtitle}</p>
      </div>
      <div className="grid grid-cols-5 gap-6 text-center">
        {statCards.map((card, index) => (
          <div
            key={index}
            className={`bg-gradient-to-br ${card.bgGradient} p-5 rounded-2xl shadow-xl border-0 transform hover:scale-105 transition-all duration-300 group`}
          >
            <div className="text-3xl font-bold text-white mb-1">
              {card.value}
            </div>
            <div className={`${card.textColor} text-sm font-medium`}>
              {card.label}
            </div>
            <div
              className={`w-full h-1 ${card.progressColor} rounded-full mt-3`}
            >
              <div
                className="h-full bg-white rounded-full opacity-60"
                style={{ width: card.progressWidth }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VocabularyStatsDashboard;
