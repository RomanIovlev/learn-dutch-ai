interface ExerciseInputProps {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  type?: "text" | "number";
  size?: "sm" | "md" | "lg";
  className?: string;
  dataTestId: string;
}

export const ExerciseInput: React.FC<ExerciseInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  size = "md",
  className = "",
  dataTestId,
}) => {
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-2",
    lg: "px-4 py-3 text-lg",
  };

  const labelSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div className={className} data-testid={dataTestId}>
      <label
        htmlFor={dataTestId}
        className={`block font-medium text-gray-600 mb-1 ${labelSizeClasses[size]}`}
      >
        {label}
      </label>
      <input
        id={dataTestId}
        type={type}
        value={value}
        onChange={(e) => {
          const newValue =
            type === "number" ? parseInt(e.target.value) || 0 : e.target.value;
          onChange(newValue);
        }}
        className={`w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${sizeClasses[size]}`}
        placeholder={placeholder}
      />
    </div>
  );
};
