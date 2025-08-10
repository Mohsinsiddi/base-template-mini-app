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
      className={`border border-border rounded-xl p-5 cursor-pointer hover:shadow-lg transition-all duration-300 bg-card hover:bg-accent/50 ${className}`}
      onClick={onClick}
    >
      {/* Cover Image Placeholder */}
      {variant === "default" && (
        <div className="w-full h-28 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg mb-4 flex items-center justify-center border border-primary/20">
          {tipJar.coverImage ? (
            <img 
              src={tipJar.coverImage} 
              alt={tipJar.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-3xl">{tipJar.emoji}</span>
          )}
        </div>
      )}
      
      {/* Header with emoji and title */}
      <div className="flex items-center gap-3 mb-3">
        {variant === "compact" && (
          <span className="text-xl">{tipJar.emoji}</span>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-card-foreground truncate text-lg">
            {tipJar.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            by {tipJar.creator}
          </p>
        </div>
      </div>
      
      {/* Amount and percentage */}
      <div className="text-sm text-muted-foreground mb-3 font-medium">
        <span className="text-primary font-bold">${tipJar.currentAmount}</span> / ${tipJar.targetAmount} USDC 
        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
          {percentage}%
        </span>
      </div>
      
      {/* Progress bar */}
      <ProgressBar 
        current={tipJar.currentAmount} 
        target={tipJar.targetAmount}
        className="mb-4"
      />
      
      {/* Supporters and days left */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          🎯 <span className="font-medium">{tipJar.supporterCount} supporters</span>
        </span>
        {tipJar.daysLeft && (
          <span className="bg-secondary px-2 py-1 rounded-full font-medium">
            {tipJar.daysLeft} days left
          </span>
        )}
      </div>
    </div>
  );
}