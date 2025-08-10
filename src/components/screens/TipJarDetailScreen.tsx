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
    <div className="px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button 
          onClick={onBack}
          className="text-blue-500 hover:text-blue-600 font-medium"
        >
          ← Back
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onShare?.(tipJarId)}
            className="px-3 py-1 text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
          >
            Share 📤
          </button>
          <button className="text-gray-400 hover:text-gray-600">
            •••
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Cover Image */}
        <div className="w-full h-40 bg-gray-100 rounded-lg flex items-center justify-center">
          {tipJar.coverImage ? (
            <img 
              src={tipJar.coverImage} 
              alt={tipJar.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="text-4xl">{tipJar.emoji}</span>
          )}
        </div>

        {/* Title and Creator */}
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">
            {tipJar.emoji} {tipJar.title}
          </h1>
          <p className="text-gray-600">by {tipJar.creator}</p>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-gray-900">
              ${tipJar.currentAmount} / ${tipJar.targetAmount} USDC ({percentage}%)
            </span>
          </div>
          <ProgressBar 
            current={tipJar.currentAmount}
            target={tipJar.targetAmount}
            variant="smooth"
            className="mb-3"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>🎯 {tipJar.supporterCount} supporters</span>
            {tipJar.daysLeft && (
              <span>{tipJar.daysLeft} days left</span>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            {tipJar.description}
          </p>
        </div>

        {/* Quick Tip Section */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Quick Tip Amounts:</h3>
          <QuickTipButtons
            onAmountSelect={setSelectedAmount}
            selectedAmount={selectedAmount}
          />
        </div>

        {/* Support Button */}
        <Button
          onClick={handleSupport}
          disabled={!selectedAmount}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-300"
        >
          💰 Support This Goal
        </Button>

        {/* Recent Support */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">
              💬 Recent Support ({tipJar.supporters.length})
            </h3>
          </div>
          
          <div className="space-y-3">
            {displayedSupporters.map((supporter) => (
              <div key={supporter.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{supporter.username}</span>
                  <span className="text-sm text-gray-500">{supporter.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600 font-medium">
                    +${supporter.amount} USDC
                  </span>
                </div>
                {supporter.message && (
                  <p className="text-sm text-gray-600 mt-1">"{supporter.message}"</p>
                )}
              </div>
            ))}
          </div>

          {tipJar.supporters.length > 4 && (
            <button
              onClick={() => setShowAllSupporters(!showAllSupporters)}
              className="w-full mt-3 py-2 text-sm text-blue-500 hover:text-blue-600 font-medium"
            >
              {showAllSupporters ? "Show Less" : "View All Messages"}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">${tipJar.currentAmount}</div>
            <div className="text-xs text-gray-500">Raised</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{tipJar.supporterCount}</div>
            <div className="text-xs text-gray-500">Supporters</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{tipJar.daysLeft || "∞"}</div>
            <div className="text-xs text-gray-500">Days Left</div>
          </div>
        </div>
      </div>
    </div>
  );
}