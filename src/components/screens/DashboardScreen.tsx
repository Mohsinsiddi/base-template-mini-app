"use client";

import { useState } from "react";
import { TipJarCard, type TipJar } from "~/components/ui/TipJarCard";
import { Button } from "~/components/ui/Button";

interface DashboardStats {
  totalEarnings: number;
  availableToWithdraw: number;
  pendingAmount: number;
  totalSupporters: number;
  activeTipJars: number;
}

// Mock user data
const mockUserData = {
  username: "@alice_builds",
  name: "Alice",
  stats: {
    totalEarnings: 172,
    availableToWithdraw: 65,
    pendingAmount: 107,
    totalSupporters: 20,
    activeTipJars: 2
  } as DashboardStats,
  tipJars: [
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
      title: "Art supplies fund", 
      creator: "@alice_builds",
      currentAmount: 45,
      targetAmount: 150,
      supporterCount: 8,
      category: "art",
      emoji: "🎨"
    }
  ] as TipJar[]
};

interface DashboardScreenProps {
  onTipJarClick?: (tipJarId: string) => void;
  onCreateNew?: () => void;
  onWithdraw?: () => void;
  onViewAnalytics?: () => void;
  onViewMessages?: () => void;
  onEditTipJar?: (tipJarId: string) => void;
  onShareTipJar?: (tipJarId: string) => void;
  walletContent?: React.ReactNode; // Add wallet content prop
}

export default function DashboardScreen({
  onTipJarClick,
  onCreateNew,
  onWithdraw,
  onViewAnalytics,
  onViewMessages,
  onEditTipJar,
  onShareTipJar,
  walletContent // Add wallet content prop
}: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "tipjars">("overview");
  const { name, stats, tipJars } = mockUserData;

  return (
    <div className="px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="text-lg">☰</span>
          <span className="font-semibold text-gray-900">Dashboard</span>
        </div>
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-sm">👤</span>
        </div>
      </div>

      {/* Welcome */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          👋 Hey {name}!
        </h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "overview"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("tipjars")}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === "tipjars"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          My Tip Jars
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">
                ${stats.totalEarnings}
              </div>
              <div className="text-sm text-green-600">Total Earnings</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">
                {stats.totalSupporters}
              </div>
              <div className="text-sm text-blue-600">Total Supporters</div>
            </div>
          </div>

          {/* Available to Withdraw */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">💸 Available to Withdraw</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-3">
              ${stats.availableToWithdraw} USDC
            </div>
            <Button
              onClick={onWithdraw}
              disabled={stats.availableToWithdraw === 0}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg disabled:bg-gray-300"
            >
              Withdraw Funds
            </Button>
          </div>

          {/* Pending Amount */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-yellow-800">⏳ Pending</h3>
                <div className="text-lg font-bold text-yellow-900">
                  ${stats.pendingAmount} USDC
                </div>
                <div className="text-sm text-yellow-700">
                  Processing time: 1-3 days
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={onViewAnalytics}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
            >
              📊 Analytics
            </Button>
            <Button
              onClick={onViewMessages}
              className="bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg"
            >
              💬 Messages
            </Button>
          </div>
        </div>
      )}

      {/* Tip Jars Tab */}
      {activeTab === "tipjars" && (
        <div className="space-y-4">
          {/* Active Tip Jars Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              📈 Your Active Tip Jars ({stats.activeTipJars})
            </h2>
          </div>

          {/* Tip Jars List */}
          <div className="space-y-4">
            {tipJars.map((tipJar) => (
              <div key={tipJar.id} className="relative">
                <TipJarCard
                  tipJar={tipJar}
                  onClick={() => onTipJarClick?.(tipJar.id)}
                  variant="default"
                />
                
                {/* Action Buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => onTipJarClick?.(tipJar.id)}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEditTipJar?.(tipJar.id)}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onShareTipJar?.(tipJar.id)}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                  >
                    Share
                  </button>
                </div>

                {/* Performance Indicators */}
                <div className="mt-2 text-xs text-gray-500">
                  ${tipJar.currentAmount} raised • 
                  ${(tipJar.targetAmount - tipJar.currentAmount)} to go •
                  {tipJar.supporterCount} supporters
                </div>
              </div>
            ))}
          </div>

          {/* Create New Button */}
          <Button
            onClick={onCreateNew}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium"
          >
            ➕ Create New Tip Jar
          </Button>

          {/* Empty State (if no tip jars) */}
          {tipJars.length === 0 && (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📦</div>
              <div className="text-gray-500 mb-2">No tip jars yet</div>
              <div className="text-sm text-gray-400 mb-4">
                Create your first tip jar to start receiving support
              </div>
              <Button
                onClick={onCreateNew}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
              >
                Create Your First Tip Jar
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Render wallet content if provided */}
      {walletContent}
    </div>
  );
}