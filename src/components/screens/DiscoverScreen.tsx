"use client";

import { useState } from "react";
import { TipJarCard, type TipJar } from "~/components/ui/TipJarCard";
import { CategoryFilter } from "~/components/ui/CategoryFilter";
import { Button } from "~/components/ui/Button";

// Mock data
const mockTipJars: TipJar[] = [
  {
    id: "1",
    title: "Coffee for my startup",
    creator: "@alice_builds",
    currentAmount: 127,
    targetAmount: 200,
    supporterCount: 12,
    category: "tech",
    emoji: "📸",
    daysLeft: 3
  },
  {
    id: "2", 
    title: "Art supplies fund",
    creator: "@bob_artist",
    currentAmount: 45,
    targetAmount: 150,
    supporterCount: 8,
    category: "art",
    emoji: "🎨"
  },
  {
    id: "3",
    title: "New music video",
    creator: "@charlie_music",
    currentAmount: 89,
    targetAmount: 100,
    supporterCount: 23,
    category: "music",
    emoji: "🎵"
  },
  {
    id: "4",
    title: "Food truck launch",
    creator: "@food_lover",
    currentAmount: 230,
    targetAmount: 500,
    supporterCount: 45,
    category: "food",
    emoji: "🚚"
  },
  {
    id: "5",
    title: "Travel documentary",
    creator: "@wanderer",
    currentAmount: 78,
    targetAmount: 300,
    supporterCount: 15,
    category: "travel",
    emoji: "✈️"
  }
];

interface DiscoverScreenProps {
  onTipJarClick?: (tipJarId: string) => void;
  onCreateClick?: () => void;
}

export default function DiscoverScreen({ onTipJarClick, onCreateClick }: DiscoverScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter tip jars based on selected category and search
  const filteredTipJars = mockTipJars.filter(jar => {
    const matchesCategory = selectedCategory === "all" || jar.category === selectedCategory;
    const matchesSearch = jar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         jar.creator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="px-4 py-2 max-w-md mx-auto min-h-screen bg-background">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search tip jars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-border rounded-xl bg-card text-card-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
          />
        </div>
      </div>

      {/* Trending Section Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
          <span className="text-lg">🔥</span>
        </div>
        <div>
          <h2 className="font-bold text-foreground text-lg">Trending Tip Jars</h2>
          <p className="text-xs text-muted-foreground">Popular projects getting support</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showEmojis={true}
          variant="pills"
        />
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="mb-4 px-2">
          <span className="text-sm text-muted-foreground bg-accent/50 px-3 py-1 rounded-full">
            Found {filteredTipJars.length} tip jars
          </span>
        </div>
      )}

      {/* Tip Jars Grid */}
      <div className="space-y-4 mb-8">
        {filteredTipJars.length > 0 ? (
          filteredTipJars.map((tipJar) => (
            <TipJarCard
              key={tipJar.id}
              tipJar={tipJar}
              onClick={() => onTipJarClick?.(tipJar.id)}
            />
          ))
        ) : (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <div className="text-5xl mb-4">🔍</div>
            <div className="text-foreground font-semibold mb-2">No tip jars found</div>
            <div className="text-sm text-muted-foreground mb-6">
              Try adjusting your search or category filter
            </div>
            <Button
              onClick={onCreateClick}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-xl"
            >
              Create First Tip Jar
            </Button>
          </div>
        )}
      </div>

      {/* Create Tip Jar Button */}
      <div className="mb-6">
        <Button
          onClick={onCreateClick}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground py-4 rounded-xl font-semibold shadow-lg transition-all duration-200"
        >
          ➕ Create Your Tip Jar
        </Button>
      </div>

      {/* Categories Footer Info */}
      <div className="text-center mb-20 p-4 bg-accent/30 rounded-xl border border-border">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">🎯 Categories:</span> Art • Music • Tech • Food • Travel • Other
        </div>
      </div>
    </div>
  );
}