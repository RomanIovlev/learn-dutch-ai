import React from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

// Success Banner Component
interface SuccessBannerProps {
  isVisible: boolean;
  onDismiss: () => void;
  title?: string;
  message?: string;
}

export const SuccessBanner: React.FC<SuccessBannerProps> = ({
  isVisible,
  onDismiss,
  title = "Excellent work! All answers are correct! 🎉",
  message = "You've mastered these Dutch vocabulary forms. Keep up the great work!",
}) => {
  if (!isVisible) return null;

  return (
    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <CheckCircle className="h-5 w-5 text-green-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">{title}</h3>
          <div className="mt-2 text-sm text-green-700">
            <p>{message}</p>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onDismiss}
              className="inline-flex bg-green-50 rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
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

// Error Banner Component
interface ErrorBannerProps {
  isVisible: boolean;
  onDismiss: () => void;
  errorWords: string[];
  title?: string;
  message?: string;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  isVisible,
  onDismiss,
  errorWords,
  title = "Errors found in your answers",
  message = "Please review the following words:",
}) => {
  if (!isVisible) return null;

  return (
    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <XCircle className="h-5 w-5 text-red-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">{title}</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
            <ul className="list-disc list-inside mt-1">
              {errorWords.map((word, index) => (
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
              className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
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
