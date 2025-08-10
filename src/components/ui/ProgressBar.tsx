interface ProgressBarProps {
  current: number;
  target: number;
  className?: string;
  variant?: "blocks" | "smooth";
  showPercentage?: boolean;
}

export function ProgressBar({ 
  current, 
  target, 
  className = "",
  variant = "blocks",
  showPercentage = false
}: ProgressBarProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  if (variant === "smooth") {
    return (
      <div className={`w-full ${className}`}>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showPercentage && (
          <div className="text-xs text-gray-500 mt-1">
            {Math.round(percentage)}% funded
          </div>
        )}
      </div>
    );
  }
  
  // Blocks variant (default)
  const filledBlocks = Math.floor(percentage / 10);
  
  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-1">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`w-3 h-2 rounded-sm transition-colors duration-200 ${
              i < filledBlocks ? "bg-green-500" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      {showPercentage && (
        <div className="text-xs text-gray-500 mt-1">
          {Math.round(percentage)}% funded
        </div>
      )}
    </div>
  );
}