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
    <div className="px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-lg">🏠</span>
          <span className="font-semibold text-gray-900">Social Tip Jar</span>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-sm">👤</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search tip jars..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Trending Section Title */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🔥</span>
        <span className="font-semibold text-gray-900">Trending Tip Jars</span>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showEmojis={true}
        />
      </div>

      {/* Results Count */}
      {searchQuery && (
        <div className="mb-3 text-sm text-gray-500">
          Found {filteredTipJars.length} tip jars
        </div>
      )}

      {/* Tip Jars Grid */}
      <div className="space-y-3 mb-6">
        {filteredTipJars.length > 0 ? (
          filteredTipJars.map((tipJar) => (
            <TipJarCard
              key={tipJar.id}
              tipJar={tipJar}
              onClick={() => onTipJarClick?.(tipJar.id)}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">🔍</div>
            <div className="text-gray-500 mb-2">No tip jars found</div>
            <div className="text-sm text-gray-400">
              Try adjusting your search or category filter
            </div>
          </div>
        )}
      </div>

      {/* Create Tip Jar Button */}
      <Button
        onClick={onCreateClick}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
      >
        ➕ Create Your Tip Jar
      </Button>

      {/* Categories Footer */}
      <div className="mt-4 text-center">
        <div className="text-sm text-gray-500">
          🎯 Categories: Art • Music • Tech • Food • Travel • Other
        </div>
      </div>
    </div>
  );
}