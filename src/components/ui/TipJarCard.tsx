import { ProgressBar } from "./ProgressBar";

export interface TipJar {
  id: string;
  title: string;
  creator: string;
  currentAmount: number;
  targetAmount: number;
  supporterCount: number;
  category: string;
  emoji: string;
  daysLeft?: number;
  coverImage?: string;
}

interface TipJarCardProps {
  tipJar: TipJar;
  onClick?: () => void;
  variant?: "default" | "compact";
  className?: string;
}

export function TipJarCard({ 
  tipJar, 
  onClick, 
  variant = "default",
  className = "" 
}: TipJarCardProps) {
  const percentage = Math.round((tipJar.currentAmount / tipJar.targetAmount) * 100);
  
  return (
    <div 
      className={`border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow bg-white ${className}`}
      onClick={onClick}
    >
      {/* Cover Image Placeholder */}
      {variant === "default" && (
        <div className="w-full h-24 bg-gray-100 rounded-md mb-3 flex items-center justify-center">
          {tipJar.coverImage ? (
            <img 
              src={tipJar.coverImage} 
              alt={tipJar.title}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <span className="text-2xl">{tipJar.emoji}</span>
          )}
        </div>
      )}
      
      {/* Header with emoji and title */}
      <div className="flex items-center gap-2 mb-2">
        {variant === "compact" && (
          <span className="text-lg">{tipJar.emoji}</span>
        )}
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 truncate">
            {tipJar.title}
          </h3>
          <p className="text-sm text-gray-500">
            by {tipJar.creator}
          </p>
        </div>
      </div>
      
      {/* Amount and percentage */}
      <div className="text-sm text-gray-600 mb-2">
        ${tipJar.currentAmount} / ${tipJar.targetAmount} USDC ({percentage}%)
      </div>
      
      {/* Progress bar */}
      <ProgressBar 
        current={tipJar.currentAmount} 
        target={tipJar.targetAmount}
        className="mb-3"
      />
      
      {/* Supporters and days left */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>🎯 {tipJar.supporterCount} supporters</span>
        {tipJar.daysLeft && (
          <span>{tipJar.daysLeft} days left</span>
        )}
      </div>
    </div>
  );
}