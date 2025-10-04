import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  message = "Loading...",
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const containerClasses = {
    sm: "py-6",
    md: "py-12",
    lg: "py-16",
  };

  return (
    <div
      className={`flex items-center justify-center ${containerClasses[size]} ${className}`}
      data-testid="loading-container"
      data-size={size}
    >
      <div className="flex flex-col items-center gap-3 animate-fade-in">
        <Loader2
          className={`${sizeClasses[size]} text-blue-600 animate-spin`}
          data-testid="loading-spinner"
        />
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loading;
