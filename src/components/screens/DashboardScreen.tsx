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
  walletContent?: React.ReactNode;
}

export default function DashboardScreen({
  onTipJarClick,
  onCreateNew,
  onWithdraw,
  onViewAnalytics,
  onViewMessages,
  onEditTipJar,
  onShareTipJar,
  walletContent
}: DashboardScreenProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "tipjars">("overview");
  const { name, stats, tipJars } = mockUserData;

  return (
    <div className="px-4 py-2 max-w-md mx-auto min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-lg">☰</span>
          </div>
          <div>
            <h1 className="font-bold text-foreground text-lg">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Manage your tip jars</p>
          </div>
        </div>
        <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center border border-border">
          <span className="text-sm font-medium text-accent-foreground">👤</span>
        </div>
      </div>

      {/* Welcome */}
      <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
        <h2 className="text-xl font-bold text-foreground">
          👋 Hey {name}!
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back to your creator dashboard
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex bg-accent/50 rounded-xl p-1 mb-6 border border-border">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === "overview"
              ? "bg-card text-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("tipjars")}
          className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
            activeTab === "tipjars"
              ? "bg-card text-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
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
            <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 p-5 rounded-xl border border-green-500/20">
              <div className="text-2xl font-bold text-green-600">
                ${stats.totalEarnings}
              </div>
              <div className="text-sm text-green-600/80 font-medium">Total Earnings</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-5 rounded-xl border border-blue-500/20">
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalSupporters}
              </div>
              <div className="text-sm text-blue-600/80 font-medium">Total Supporters</div>
            </div>
          </div>

          {/* Available to Withdraw */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                💸 <span>Available to Withdraw</span>
              </h3>
            </div>
            <div className="text-3xl font-bold text-foreground mb-4">
              ${stats.availableToWithdraw} <span className="text-lg text-muted-foreground">USDC</span>
            </div>
            <Button
              onClick={onWithdraw}
              disabled={stats.availableToWithdraw === 0}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold disabled:from-muted disabled:to-muted disabled:text-muted-foreground"
            >
              Withdraw Funds
            </Button>
          </div>

          {/* Pending Amount */}
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-yellow-700 flex items-center gap-2">
                  ⏳ <span>Pending</span>
                </h3>
                <div className="text-2xl font-bold text-yellow-800 mt-2">
                  ${stats.pendingAmount} <span className="text-lg">USDC</span>
                </div>
                <div className="text-sm text-yellow-700/80 mt-1">
                  Processing time: 1-3 days
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={onViewAnalytics}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-semibold"
            >
              📊 Analytics
            </Button>
            <Button
              onClick={onViewMessages}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-4 rounded-xl font-semibold"
            >
              💬 Messages
            </Button>
          </div>
        </div>
      )}

      {/* Tip Jars Tab */}
      {activeTab === "tipjars" && (
        <div className="space-y-6">
          {/* Active Tip Jars Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              📈 <span>Your Active Tip Jars ({stats.activeTipJars})</span>
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
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => onTipJarClick?.(tipJar.id)}
                    className="px-4 py-2 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-all duration-200 font-medium"
                  >
                    View
                  </button>
                  <button
                    onClick={() => onEditTipJar?.(tipJar.id)}
                    className="px-4 py-2 text-xs bg-accent text-accent-foreground rounded-full hover:bg-accent/80 transition-all duration-200 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onShareTipJar?.(tipJar.id)}
                    className="px-4 py-2 text-xs bg-green-500/10 text-green-600 rounded-full hover:bg-green-500/20 transition-all duration-200 font-medium"
                  >
                    Share
                  </button>
                </div>

                {/* Performance Indicators */}
                <div className="mt-3 text-xs text-muted-foreground bg-accent/30 p-3 rounded-lg">
                  <span className="font-medium text-foreground">${tipJar.currentAmount}</span> raised • 
                  <span className="font-medium text-foreground"> ${(tipJar.targetAmount - tipJar.currentAmount)}</span> to go •
                  <span className="font-medium text-foreground"> {tipJar.supporterCount}</span> supporters
                </div>
              </div>
            ))}
          </div>

          {/* Create New Button */}
          <Button
            onClick={onCreateNew}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground py-4 rounded-xl font-semibold shadow-lg"
          >
            ➕ Create New Tip Jar
          </Button>

          {/* Empty State (if no tip jars) */}
          {tipJars.length === 0 && (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <div className="text-5xl mb-4">📦</div>
              <div className="text-foreground font-semibold mb-2">No tip jars yet</div>
              <div className="text-sm text-muted-foreground mb-6">
                Create your first tip jar to start receiving support
              </div>
              <Button
                onClick={onCreateNew}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-xl font-semibold"
              >
                Create Your First Tip Jar
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Render wallet content if provided */}
      {walletContent}
      
      {/* Bottom spacing for tab navigation */}
      <div className="mb-20"></div>
    </div>
  );
}