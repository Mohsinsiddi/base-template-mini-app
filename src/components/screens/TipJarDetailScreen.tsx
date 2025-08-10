"use client";

import { useState, useEffect } from "react";
import { ProgressBar } from "~/components/ui/ProgressBar";
import { QuickTipButtons } from "~/components/ui/QuickTipButtons";
import { Button } from "~/components/ui/Button";
import { tipAPI, type TipRecord } from "~/lib/supabase";
import { type TipJar } from "~/components/ui/TipJarCard";

interface Supporter {
  id: string;
  username: string;
  amount: number;
  message?: string;
  timestamp: string;
}

// Mock base tip jar data (you'd fetch this from your main tips table)
const mockTipJarBase: TipJar = {
  id: "1",
  title: "Coffee for my startup",
  creator: "@alice_builds",
  currentAmount: 0, // This will be calculated from actual tips
  targetAmount: 200,
  supporterCount: 0, // This will be calculated from actual tips
  category: "tech",
  emoji: "☕",
  daysLeft: 3,
  coverImage: undefined,
};

const mockDescription = "I'm building an app that helps people track their daily habits and build positive routines. Your support will help me focus on development and get this to market faster!";

interface TipJarDetailScreenProps {
  tipJarId: string;
  onBack?: () => void;
  onSendTip?: (tipData: {
    tipJarId: string;
    amount: number;
    message?: string;
    showName: boolean;
  }) => void;
  onShare?: (tipJarId: string) => void;
  isConnected?: boolean;
  isProcessing?: boolean;
}

export default function TipJarDetailScreen({ 
  tipJarId, 
  onBack, 
  onSendTip,
  onShare,
  isConnected = false,
  isProcessing = false
}: TipJarDetailScreenProps) {
  const [showAllSupporters, setShowAllSupporters] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | undefined>();
  const [message, setMessage] = useState("");
  const [showName, setShowName] = useState(true);
  
  // Backend state
  const [tipJar, setTipJar] = useState(mockTipJarBase);
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tips data from backend
  useEffect(() => {
    loadTipsData();
  }, [tipJarId]);

  const loadTipsData = async () => {
    try {
      setLoading(true);
      
      // Get tips and stats for this tip jar
      const [tips, stats] = await Promise.all([
        tipAPI.getTipsForJar(tipJarId),
        tipAPI.getTipStats(tipJarId)
      ]);

      // Convert tips to supporters format
      const supportersData = tips.map(tip => ({
        id: tip.id!,
        username: tip.show_name && tip.supporter_username ? tip.supporter_username : "Anonymous",
        amount: Number(tip.amount),
        message: tip.message,
        timestamp: formatTimestamp(tip.created_at!)
      }));

      setSupporters(supportersData);
      
      // Update tip jar with real data
      setTipJar(prev => ({
        ...prev,
        currentAmount: stats.totalAmount,
        supporterCount: stats.supporterCount
      }));

    } catch (err) {
      console.error('Error loading tips data:', err);
      setError('Failed to load tips data');
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const handleSendTip = async () => {
    if (!selectedAmount || !onSendTip) {
      console.log("TipJarDetail: Missing amount or onSendTip handler");
      return;
    }

    try {
      // First record the tip in the database
      const tipRecord = await tipAPI.recordTip({
        tip_jar_id: tipJarId,
        amount: selectedAmount,
        message: message.trim() || undefined,
        supporter_username: showName ? "Current User" : undefined, // Replace with actual username
        show_name: showName,
        status: 'pending'
      });

      console.log("Tip recorded in database:", tipRecord);

      // Then trigger the blockchain transaction
      const tipData = {
        tipJarId,
        amount: selectedAmount,
        message: message.trim() || undefined,
        showName,
        dbTipId: tipRecord.id // Pass the database ID for status updates
      };

      console.log("TipJarDetail: Sending tip data:", tipData);
      onSendTip(tipData);

    } catch (err) {
      console.error("Error recording tip:", err);
      setError("Failed to process tip. Please try again.");
    }
  };

  // Function to update tip status after blockchain confirmation
  const updateTipStatus = async (dbTipId: string, status: 'confirmed' | 'failed', txHash?: string) => {
    try {
      await tipAPI.updateTipStatus(dbTipId, status, txHash);
      
      // Reload data to show updated stats
      await loadTipsData();
      
      // Reset form
      setSelectedAmount(undefined);
      setMessage("");
    } catch (err) {
      console.error("Error updating tip status:", err);
    }
  };

  // Expose this function for parent component to call after blockchain confirmation
  useEffect(() => {
    // You can pass this function up to parent or store it globally
    (window as any).updateTipStatus = updateTipStatus;
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-6 max-w-md mx-auto min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading tip jar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6 max-w-md mx-auto min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={loadTipsData} className="px-4 py-2">
            Retry
          </Button>
        </div>
      </div>
    );
  }
  
  const percentage = Math.round((tipJar.currentAmount / tipJar.targetAmount) * 100);
  const displayedSupporters = showAllSupporters ? supporters : supporters.slice(0, 4);

  const getButtonText = () => {
    if (isProcessing) return "Processing...";
    if (!isConnected) return "Connect Wallet to Tip";
    if (selectedAmount) return `💳 Send $${selectedAmount} USDC`;
    return "💳 Select Amount to Continue";
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
          <button 
            onClick={loadTipsData}
            className="w-10 h-10 bg-accent hover:bg-accent/80 rounded-xl flex items-center justify-center border border-border transition-all duration-200"
          >
            <span className="text-sm">🔄</span>
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
                ${tipJar.currentAmount.toFixed(2)}
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
            {mockDescription}
          </p>
        </div>

        {/* Enhanced Amount Selection */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            💰 <span>Choose Your Tip Amount</span>
          </h2>
          <QuickTipButtons
            onAmountSelect={setSelectedAmount}
            selectedAmount={selectedAmount}
            variant="default"
            showCustom={true}
            disabled={isProcessing}
          />
        </div>

        {/* Enhanced Message Input */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <label className="block text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            💬 <span>Leave a message (optional)</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Good luck with your project!"
            rows={3}
            maxLength={200}
            disabled={isProcessing}
            className="w-full px-4 py-4 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-all duration-200 disabled:opacity-50"
          />
          <div className="text-xs text-muted-foreground mt-2 text-right">
            {message.length}/200
          </div>
        </div>

        {/* Enhanced Show Name Toggle */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <span className="text-lg">👤</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Show my name publicly
                </div>
                <div className="text-xs text-muted-foreground">
                  Let others see who supported this project
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowName(!showName)}
              disabled={isProcessing}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 disabled:opacity-50 ${
                showName ? "bg-primary" : "bg-accent"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-200 ${
                  showName ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Enhanced Send Button */}
        <Button
          onClick={handleSendTip}
          disabled={!selectedAmount || isProcessing || !isConnected}
          isLoading={isProcessing}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg disabled:from-muted disabled:to-muted disabled:text-muted-foreground transition-all duration-200"
        >
          {getButtonText()}
        </Button>

        {/* Enhanced Recent Support */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-foreground flex items-center gap-2">
              💬 <span>Recent Support ({supporters.length})</span>
            </h3>
          </div>
          
          {supporters.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <span className="text-3xl block mb-2">🌟</span>
              <p>Be the first to support this project!</p>
            </div>
          ) : (
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
          )}

          {supporters.length > 4 && (
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
            <div className="text-2xl font-bold text-green-600">${tipJar.currentAmount.toFixed(2)}</div>
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

        {/* Enhanced Security Note */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-accent/30 px-4 py-3 rounded-xl border border-border">
            <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center">
              <span className="text-xs">🔒</span>
            </div>
            <span>Secured by Base blockchain</span>
          </div>
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="mb-20"></div>
    </div>
  );
}