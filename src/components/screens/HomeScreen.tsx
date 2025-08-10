"use client";

import { useState, useEffect } from "react";
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

// Platform stats with animation
const platformStats = {
  totalProjects: { value: 2847, display: "2.8k+" },
  totalRaised: { value: 127000, display: "$127k+" },
  activeSupporters: { value: 8429, display: "8.4k+" }
};

// Recent activities for live feed
const recentActivities = [
  { id: "1", user: "@dev_mike", action: "received", amount: 25, project: "AI Tool", time: "2m ago" },
  { id: "2", user: "@artist_jane", action: "created", project: "Digital Art Collection", time: "5m ago" },
  { id: "3", user: "@chef_tom", action: "received", amount: 15, project: "Food Truck", time: "8m ago" },
  { id: "4", user: "@writer_anna", action: "reached goal", project: "Poetry Book", time: "12m ago" }
];

// Tips and insights
const dailyTips = [
  {
    icon: "💡",
    title: "Tip of the Day",
    content: "Projects with personal stories receive 3x more support than those without!"
  },
  {
    icon: "🎯",
    title: "Pro Tip",
    content: "Set realistic goals and update supporters regularly to build trust."
  },
  {
    icon: "🚀",
    title: "Success Hack",
    content: "Share your tip jar on social media for maximum visibility."
  }
];

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

  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({
    projects: 0,
    raised: 0,
    supporters: 0
  });

  // Animate stats on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedStats({
        projects: Math.floor(platformStats.totalProjects.value * easeOut),
        raised: Math.floor(platformStats.totalRaised.value * easeOut),
        supporters: Math.floor(platformStats.activeSupporters.value * easeOut)
      });

      if (step >= steps) {
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  // Rotate tips every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % dailyTips.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const getGreetingEmoji = () => {
    switch (currentTime) {
      case "morning": return "🌅";
      case "afternoon": return "☀️";
      default: return "🌙";
    }
  };

  const formatAnimatedNumber = (value: number, type: string) => {
    if (type === "raised") return `$${(value / 1000).toFixed(0)}k+`;
    if (value > 1000) return `${(value / 1000).toFixed(1)}k+`;
    return value.toString();
  };

  return (
    <div className="px-4 py-2 max-w-md mx-auto min-h-screen bg-background">
      {/* Enhanced Hero Welcome Section */}
      <div className="relative bg-gradient-to-br from-primary/15 via-primary/8 to-background rounded-3xl p-8 mb-8 border border-primary/20 overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 bg-primary/5 rounded-full blur-lg"></div>
        
        <div className="text-center relative z-10">
          <div className="text-5xl mb-4 animate-bounce">{getGreetingEmoji()}</div>
          <h1 className="text-3xl font-black text-foreground mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Good {currentTime}!
          </h1>
          <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
            Turn your creative ideas into reality with <br />
            <span className="font-semibold text-primary">community-powered funding</span>
          </p>
          
          {/* Enhanced Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={onCreateClick}
              className="bg-gradient-to-r from-primary via-primary to-primary/90 text-primary-foreground py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center gap-2">
                ➕ <span>Create</span>
              </span>
            </Button>
            <Button
              onClick={onDiscoverClick}
              className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-accent-foreground py-4 rounded-2xl font-bold text-lg border-2 border-border hover:border-primary/50 hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <span className="flex items-center gap-2">
                🔍 <span>Discover</span>
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Animated Platform Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center bg-gradient-to-b from-card to-card/80 border border-border rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="text-2xl font-black text-primary mb-1">
            {formatAnimatedNumber(animatedStats.projects, "projects")}
          </div>
          <div className="text-xs text-muted-foreground font-medium">Projects</div>
          <div className="w-full bg-primary/10 h-1 rounded-full mt-2">
            <div className="bg-primary h-1 rounded-full w-3/4"></div>
          </div>
        </div>
        <div className="text-center bg-gradient-to-b from-card to-card/80 border border-border rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="text-2xl font-black text-green-600 mb-1">
            {formatAnimatedNumber(animatedStats.raised, "raised")}
          </div>
          <div className="text-xs text-muted-foreground font-medium">Raised</div>
          <div className="w-full bg-green-500/10 h-1 rounded-full mt-2">
            <div className="bg-green-500 h-1 rounded-full w-4/5"></div>
          </div>
        </div>
        <div className="text-center bg-gradient-to-b from-card to-card/80 border border-border rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          <div className="text-2xl font-black text-blue-600 mb-1">
            {formatAnimatedNumber(animatedStats.supporters, "supporters")}
          </div>
          <div className="text-xs text-muted-foreground font-medium">Supporters</div>
          <div className="w-full bg-blue-500/10 h-1 rounded-full mt-2">
            <div className="bg-blue-500 h-1 rounded-full w-2/3"></div>
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="bg-gradient-to-r from-card to-card/80 border border-border rounded-2xl p-6 mb-8 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            <span>Live Activity</span>
          </h2>
          <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-full">Real-time</span>
        </div>
        <div className="space-y-3 max-h-32 overflow-hidden">
          {recentActivities.map((activity, index) => (
            <div 
              key={activity.id} 
              className={`flex items-center gap-3 text-sm transition-all duration-500 ${
                index === 0 ? 'opacity-100' : index === 1 ? 'opacity-70' : 'opacity-40'
              }`}
            >
              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <span className="font-semibold text-foreground">{activity.user}</span>
                {activity.action === "received" && (
                  <span className="text-muted-foreground"> received </span>
                )}
                {activity.action === "created" && (
                  <span className="text-muted-foreground"> created </span>
                )}
                {activity.action === "reached goal" && (
                  <span className="text-green-600"> reached goal for </span>
                )}
                {activity.amount && (
                  <span className="text-green-600 font-semibold">${activity.amount} </span>
                )}
                <span className="text-foreground font-medium">{activity.project}</span>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Rotating Tips & Insights */}
      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-8 shadow-lg">
        <div className="text-center">
          <div className="text-3xl mb-3">{dailyTips[currentTipIndex].icon}</div>
          <h3 className="font-bold text-foreground mb-2">{dailyTips[currentTipIndex].title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{dailyTips[currentTipIndex].content}</p>
          
          {/* Tip indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {dailyTips.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentTipIndex ? 'bg-yellow-500' : 'bg-yellow-500/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Featured Projects */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            ⭐ <span>Featured Projects</span>
          </h2>
          <button
            onClick={onViewAllFeatured}
            className="text-sm text-primary hover:text-primary/80 font-semibold bg-primary/10 hover:bg-primary/20 px-3 py-1 rounded-full transition-all duration-200"
          >
            View All →
          </button>
        </div>
        
        <div className="space-y-4">
          {featuredTipJars.map((tipJar, index) => (
            <div
              key={tipJar.id}
              className="transform hover:scale-[1.02] transition-all duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <TipJarCard
                tipJar={tipJar}
                onClick={() => onTipJarClick?.(tipJar.id)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Categories Grid */}
      <div className="bg-gradient-to-br from-accent/20 via-accent/10 to-background rounded-2xl p-6 mb-8 border border-border shadow-lg">
        <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
          🎯 <span>Explore Categories</span>
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { name: "Tech", emoji: "💻", count: "847", color: "from-blue-500/10 to-blue-600/10 border-blue-500/20" },
            { name: "Art", emoji: "🎨", count: "632", color: "from-purple-500/10 to-purple-600/10 border-purple-500/20" },
            { name: "Music", emoji: "🎵", count: "521", color: "from-pink-500/10 to-pink-600/10 border-pink-500/20" },
            { name: "Food", emoji: "🍕", count: "298", color: "from-orange-500/10 to-orange-600/10 border-orange-500/20" },
            { name: "Travel", emoji: "✈️", count: "187", color: "from-cyan-500/10 to-cyan-600/10 border-cyan-500/20" },
            { name: "Other", emoji: "📦", count: "362", color: "from-gray-500/10 to-gray-600/10 border-gray-500/20" }
          ].map((category, index) => (
            <button
              key={category.name}
              onClick={onDiscoverClick}
              className={`bg-gradient-to-br ${category.color} hover:scale-110 border rounded-2xl p-4 text-center transition-all duration-300 hover:shadow-lg group`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="text-3xl mb-2 group-hover:animate-bounce">{category.emoji}</div>
              <div className="text-xs font-bold text-foreground">{category.name}</div>
              <div className="text-xs text-muted-foreground">{category.count}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Success Story */}
      <div className="bg-gradient-to-r from-green-500/15 to-emerald-500/10 rounded-2xl p-6 mb-8 border border-green-500/20 shadow-lg">
        <h2 className="text-xl font-bold text-green-700 mb-4 flex items-center gap-2">
          🏆 <span>Success Spotlight</span>
        </h2>
        <div className="bg-card/90 backdrop-blur-sm rounded-2xl p-5 border border-green-500/20 shadow-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white text-xl">🚀</span>
            </div>
            <div>
              <h3 className="font-bold text-foreground">@dev_sarah</h3>
              <p className="text-xs text-muted-foreground">Full-stack Developer</p>
            </div>
            <div className="ml-auto text-right">
              <div className="text-xs text-green-600 font-medium">142% funded</div>
              <div className="text-xs text-muted-foreground">3 days ago</div>
            </div>
          </div>
          <p className="text-sm text-foreground italic leading-relaxed mb-4">
            "Social Tip Jar changed my life! I raised $2,847 for my fitness app and it's now featured on the App Store with 10k+ downloads!"
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span className="bg-green-500/10 text-green-600 px-3 py-1 rounded-full font-medium">
              ✅ $2,500 → $2,847
            </span>
            <span className="bg-blue-500/10 text-blue-600 px-3 py-1 rounded-full font-medium">
              📱 App Store Featured
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Call to Action */}
      <div className="text-center bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 rounded-3xl p-8 border border-primary/20 shadow-xl mb-8">
        <div className="text-4xl mb-4 animate-pulse">🎉</div>
        <h2 className="text-2xl font-black text-foreground mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Your Ideas Deserve Support
        </h2>
        <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
          Join <span className="font-semibold text-primary">8,400+ creators</span> who've turned their dreams into reality
        </p>
        
        <div className="space-y-4">
          <Button
            onClick={onCreateClick}
            className="w-full bg-gradient-to-r from-primary via-primary to-primary/90 hover:from-primary/95 hover:to-primary/85 text-primary-foreground py-5 rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300"
          >
            🚀 Start Your Journey Today
          </Button>
          
          <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              ⚡ <span>2-min setup</span>
            </span>
            <span className="flex items-center gap-1">
              🔒 <span>Secure payments</span>
            </span>
            <span className="flex items-center gap-1">
              💎 <span>Only 2% fee</span>
            </span>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="mb-20"></div>
    </div>
  );
}