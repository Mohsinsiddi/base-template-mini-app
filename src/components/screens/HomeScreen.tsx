"use client";

import { useState } from "react";
import { TipJarCard, type TipJar } from "~/components/ui/TipJarCard";
import { Button } from "~/components/ui/Button";

// Featured/trending tip jars for home
const featuredTipJars: TipJar[] = [
  {
    id: "1",
    title: "Coffee for my startup",
    creator: "@alice_builds",
    currentAmount: 127,
    targetAmount: 200,
    supporterCount: 12,
    category: "tech",
    emoji: "☕",
    daysLeft: 3
  },
  {
    id: "2",
    title: "New music video",
    creator: "@charlie_music",
    currentAmount: 89,
    targetAmount: 100,
    supporterCount: 23,
    category: "music",
    emoji: "🎵"
  }
];

// Quick stats for the platform
const platformStats = {
  totalProjects: "2,847",
  totalRaised: "$127k",
  activeSupporters: "8,429"
};

interface HomeScreenProps {
  onTipJarClick?: (tipJarId: string) => void;
  onCreateClick?: () => void;
  onDiscoverClick?: () => void;
  onViewAllFeatured?: () => void;
}

export default function HomeScreen({ 
  onTipJarClick, 
  onCreateClick, 
  onDiscoverClick,
  onViewAllFeatured 
}: HomeScreenProps) {
  const [currentTime] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 17) return "afternoon";
    return "evening";
  });

  const getGreetingEmoji = () => {
    switch (currentTime) {
      case "morning": return "🌅";
      case "afternoon": return "☀️";
      default: return "🌙";
    }
  };

  return (
    <div className="px-4 py-2 max-w-md mx-auto min-h-screen bg-background">
      {/* Hero Welcome Section */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-2xl p-6 mb-8 border border-primary/20">
        <div className="text-center">
          <div className="text-4xl mb-3">{getGreetingEmoji()}</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Good {currentTime}!
          </h1>
          <p className="text-muted-foreground mb-6">
            Welcome to Social Tip Jar - where creators get the support they deserve
          </p>
          
          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onCreateClick}
              className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-3 rounded-xl font-semibold"
            >
              ➕ Create
            </Button>
            <Button
              onClick={onDiscoverClick}
              className="bg-accent hover:bg-accent/80 text-accent-foreground py-3 rounded-xl font-semibold border border-border"
            >
              🔍 Discover
            </Button>
          </div>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        <div className="text-center bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="text-xl font-bold text-primary">{platformStats.totalProjects}</div>
          <div className="text-xs text-muted-foreground">Projects</div>
        </div>
        <div className="text-center bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="text-xl font-bold text-green-600">{platformStats.totalRaised}</div>
          <div className="text-xs text-muted-foreground">Raised</div>
        </div>
        <div className="text-center bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="text-xl font-bold text-blue-600">{platformStats.activeSupporters}</div>
          <div className="text-xs text-muted-foreground">Supporters</div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          🚀 <span>How It Works</span>
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-sm">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Create Your Tip Jar</h3>
              <p className="text-muted-foreground text-xs">Set up your project with a goal and story</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-sm">2</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Share & Get Support</h3>
              <p className="text-muted-foreground text-xs">People send USDC tips to support your work</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-primary font-bold text-sm">3</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">Withdraw & Build</h3>
              <p className="text-muted-foreground text-xs">Access your funds and bring your ideas to life</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            ⭐ <span>Featured Projects</span>
          </h2>
          <button
            onClick={onViewAllFeatured}
            className="text-sm text-primary hover:text-primary/80 font-medium"
          >
            View All
          </button>
        </div>
        
        <div className="space-y-4">
          {featuredTipJars.map((tipJar) => (
            <TipJarCard
              key={tipJar.id}
              tipJar={tipJar}
              onClick={() => onTipJarClick?.(tipJar.id)}
            />
          ))}
        </div>
      </div>

      {/* Categories Quick Access */}
      <div className="bg-gradient-to-r from-accent/30 to-accent/10 rounded-2xl p-6 mb-8 border border-border">
        <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          🎯 <span>Popular Categories</span>
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "Tech", emoji: "💻", count: "847" },
            { name: "Art", emoji: "🎨", count: "632" },
            { name: "Music", emoji: "🎵", count: "521" },
            { name: "Food", emoji: "🍕", count: "298" },
            { name: "Travel", emoji: "✈️", count: "187" },
            { name: "Other", emoji: "📦", count: "362" }
          ].map((category) => (
            <button
              key={category.name}
              onClick={onDiscoverClick}
              className="bg-card hover:bg-accent/50 border border-border rounded-xl p-3 text-center transition-all duration-200 hover:scale-105"
            >
              <div className="text-2xl mb-1">{category.emoji}</div>
              <div className="text-xs font-medium text-foreground">{category.name}</div>
              <div className="text-xs text-muted-foreground">{category.count}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-2xl p-6 mb-8 border border-green-500/20">
        <h2 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
          🏆 <span>Success Story</span>
        </h2>
        <div className="bg-card/80 rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🚀</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">@dev_sarah</h3>
              <p className="text-xs text-muted-foreground">Funded her mobile app</p>
            </div>
          </div>
          <p className="text-sm text-foreground italic">
            "Thanks to Social Tip Jar, I raised $2,847 for my fitness app and it's now live on the App Store!"
          </p>
          <div className="mt-3 text-xs text-green-600 font-medium">
            ✅ Goal reached: $2,500 → $2,847
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-6 border border-primary/20">
        <div className="text-3xl mb-3">🎉</div>
        <h2 className="text-lg font-bold text-foreground mb-2">
          Ready to Get Started?
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Join thousands of creators who are turning their ideas into reality
        </p>
        <Button
          onClick={onCreateClick}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground py-4 rounded-xl font-bold text-lg shadow-lg"
        >
          🚀 Create Your First Tip Jar
        </Button>
      </div>

      {/* Bottom spacing */}
      <div className="mb-20"></div>
    </div>
  );
}