import React from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ExerciseBannerProps {
  isVisible: boolean;
  onDismiss: () => void;
  title?: string;
  message?: string;
  words?: string[];
  bannerType: "error" | "success";
}

export const ExerciseBanner: React.FC<ExerciseBannerProps> = ({
  isVisible,
  onDismiss,
  title,
  message,
  bannerType,
  words = [],
}) => {
  if (!isVisible) return null;

  const color = bannerType === "error" ? "destructive" : "success";
  const bannerTitle =
    title ??
    (bannerType === "success"
      ? "Excellent work! All answers are correct! 🎉"
      : "Errors found in your answers");
  const bannerMessage =
    message ??
    (bannerType === "success"
      ? "You've mastered these Dutch vocabulary forms. Keep up the great work!"
      : "Please review the following words:");

  return (
    <div
      data-testid="exercise-banner"
      className={`mb-6 bg-${color}/10 border border-${color}/20 rounded-lg p-4`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {bannerType === "success" && (
            <CheckCircle className={`h-5 w-5 text-${color}`} />
          )}
          {bannerType === "error" && (
            <XCircle className={`h-5 w-5 text-${color}`} />
          )}
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium text-${color}`}>{bannerTitle}</h3>
          <div className={`mt-2 text-sm text-${color}/80`}>
            <p>{bannerMessage}</p>
            <ul className="list-disc list-inside mt-1">
              {words.map((word, index) => (
                <li key={index} className="font-medium">
                  {word}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onDismiss}
              className={`inline-flex bg-${color}/10 rounded-md p-1.5 text-${color} hover:bg-${color}/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${color}/10 focus:ring-${color}`}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
