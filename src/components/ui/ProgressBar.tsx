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
        <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-primary to-primary/80 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showPercentage && (
          <div className="text-xs text-muted-foreground mt-2 font-medium">
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
      <div className="flex items-center gap-1.5">
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className={`w-4 h-2.5 rounded-sm transition-all duration-300 ${
              i < filledBlocks 
                ? "bg-gradient-to-r from-primary to-primary/80 shadow-sm" 
                : "bg-secondary"
            }`}
          />
        ))}
      </div>
      {showPercentage && (
        <div className="text-xs text-muted-foreground mt-2 font-medium">
          {Math.round(percentage)}% funded
        </div>
      )}
    </div>
  );
}