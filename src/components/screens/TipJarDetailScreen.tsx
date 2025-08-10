"use client";

import { useState } from "react";
import { ProgressBar } from "~/components/ui/ProgressBar";
import { QuickTipButtons } from "~/components/ui/QuickTipButtons";
import { Button } from "~/components/ui/Button";
import { type TipJar } from "~/components/ui/TipJarCard";

interface Supporter {
  id: string;
  username: string;
  amount: number;
  message?: string;
  timestamp: string;
}

// Mock data for a specific tip jar
const mockTipJarDetail: TipJar & { 
  description: string;
  supporters: Supporter[];
} = {
  id: "1",
  title: "Coffee for my startup",
  creator: "@alice_builds",
  currentAmount: 127,
  targetAmount: 200,
  supporterCount: 12,
  category: "tech",
  emoji: "☕",
  daysLeft: 3,
  coverImage: undefined,
  description: "I'm building an app that helps people track their daily habits and build positive routines. Your support will help me focus on development and get this to market faster!",
  supporters: [
    {
      id: "1",
      username: "@bob",
      amount: 5,
      message: "Love this idea!",
      timestamp: "2 hours ago"
    },
    {
      id: "2", 
      username: "@charlie",
      amount: 10,
      message: "Good luck with your app!",
      timestamp: "5 hours ago"
    },
    {
      id: "3",
      username: "@diana",
      amount: 25,
      message: "Can't wait to try it out! 🚀",
      timestamp: "1 day ago"
    },
    {
      id: "4",
      username: "@eve",
      amount: 15,
      message: "",
      timestamp: "2 days ago"
    }
  ]
};

interface TipJarDetailScreenProps {
  tipJarId: string;
  onBack?: () => void;
  onSupport?: (tipJarId: string, amount: number) => void;
  onShare?: (tipJarId: string) => void;
}

export default function TipJarDetailScreen({ 
  tipJarId, 
  onBack, 
  onSupport,
  onShare 
}: TipJarDetailScreenProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | undefined>();
  const [showAllSupporters, setShowAllSupporters] = useState(false);
  
  // In real app, fetch tip jar details by tipJarId
  const tipJar = mockTipJarDetail;
  
  const percentage = Math.round((tipJar.currentAmount / tipJar.targetAmount) * 100);
  const displayedSupporters = showAllSupporters ? tipJar.supporters : tipJar.supporters.slice(0, 4);

  const handleSupport = () => {
    if (selectedAmount) {
      onSupport?.(tipJarId, selectedAmount);
    }
  };

  return (
    <div className="px-4 py-6 max-w-md mx-auto min-h-screen bg-background">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 rounded-xl border border-border transition-all duration-200"
        >
          <span className="text-lg">←</span>
          <span className="font-medium text-foreground">Back</span>
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onShare?.(tipJarId)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 rounded-xl transition-all duration-200"
          >
            <span>📤</span>
            <span className="font-medium">Share</span>
          </button>
          <button className="w-10 h-10 bg-accent hover:bg-accent/80 rounded-xl flex items-center justify-center border border-border transition-all duration-200">
            <span className="text-sm">•••</span>
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Enhanced Cover Image */}
        <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center border border-primary/20 shadow-sm">
          {tipJar.coverImage ? (
            <img 
              src={tipJar.coverImage} 
              alt={tipJar.title}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <span className="text-5xl">{tipJar.emoji}</span>
          )}
        </div>

        {/* Enhanced Title and Creator */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {tipJar.emoji} {tipJar.title}
          </h1>
          <p className="text-muted-foreground bg-accent/30 px-4 py-2 rounded-full inline-block">
            by {tipJar.creator}
          </p>
        </div>

        {/* Enhanced Progress Section */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <span className="text-2xl font-bold text-foreground">
                ${tipJar.currentAmount}
              </span>
              <span className="text-lg text-muted-foreground"> / ${tipJar.targetAmount} USDC</span>
            </div>
            <div className="bg-primary/10 px-3 py-1 rounded-full">
              <span className="text-primary font-semibold text-sm">{percentage}%</span>
            </div>
          </div>
          <ProgressBar 
            current={tipJar.currentAmount}
            target={tipJar.targetAmount}
            variant="smooth"
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              🎯 <span className="font-medium text-foreground">{tipJar.supporterCount} supporters</span>
            </span>
            {tipJar.daysLeft && (
              <span className="bg-accent px-3 py-1 rounded-full text-muted-foreground font-medium">
                {tipJar.daysLeft} days left
              </span>
            )}
          </div>
        </div>

        {/* Enhanced Description */}
        <div className="bg-gradient-to-r from-accent/30 to-accent/10 rounded-2xl p-6 border border-border">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            📖 <span>About this project</span>
          </h3>
          <p className="text-foreground leading-relaxed">
            {tipJar.description}
          </p>
        </div>

        {/* Enhanced Quick Tip Section */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
            💰 <span>Quick Tip Amounts</span>
          </h3>
          <QuickTipButtons
            onAmountSelect={setSelectedAmount}
            selectedAmount={selectedAmount}
          />
        </div>

        {/* Enhanced Support Button */}
        <Button
          onClick={handleSupport}
          disabled={!selectedAmount}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg disabled:from-muted disabled:to-muted disabled:text-muted-foreground transition-all duration-200"
        >
          {selectedAmount ? `💰 Support with ${selectedAmount}` : "💰 Select Amount to Support"}
        </Button>

        {/* Enhanced Recent Support */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              💬 <span>Recent Support ({tipJar.supporters.length})</span>
            </h3>
          </div>
          
          <div className="space-y-4">
            {displayedSupporters.map((supporter) => (
              <div key={supporter.id} className="bg-accent/30 rounded-xl p-4 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">{supporter.username}</span>
                  <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-full">
                    {supporter.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-green-600 bg-green-500/10 px-3 py-1 rounded-full">
                    +${supporter.amount} USDC
                  </span>
                </div>
                {supporter.message && (
                  <p className="text-sm text-muted-foreground mt-3 italic bg-card p-3 rounded-lg border border-border">
                    "{supporter.message}"
                  </p>
                )}
              </div>
            ))}
          </div>

          {tipJar.supporters.length > 4 && (
            <button
              onClick={() => setShowAllSupporters(!showAllSupporters)}
              className="w-full mt-4 py-3 text-sm text-primary hover:text-primary/80 bg-primary/10 hover:bg-primary/20 font-semibold rounded-xl transition-all duration-200"
            >
              {showAllSupporters ? "Show Less" : "View All Messages"}
            </button>
          )}
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center bg-gradient-to-r from-green-500/10 to-green-600/10 p-4 rounded-xl border border-green-500/20">
            <div className="text-2xl font-bold text-green-600">${tipJar.currentAmount}</div>
            <div className="text-xs text-green-600/80 font-medium">Raised</div>
          </div>
          <div className="text-center bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-4 rounded-xl border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-600">{tipJar.supporterCount}</div>
            <div className="text-xs text-blue-600/80 font-medium">Supporters</div>
          </div>
          <div className="text-center bg-gradient-to-r from-orange-500/10 to-orange-600/10 p-4 rounded-xl border border-orange-500/20">
            <div className="text-2xl font-bold text-orange-600">{tipJar.daysLeft || "∞"}</div>
            <div className="text-xs text-orange-600/80 font-medium">Days Left</div>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="mb-20"></div>
    </div>
  );
}