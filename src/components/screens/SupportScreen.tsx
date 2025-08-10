"use client";

import { useState } from "react";
import { QuickTipButtons } from "~/components/ui/QuickTipButtons";
import { Button } from "~/components/ui/Button";

interface SupportScreenProps {
  tipJarId: string;
  tipJarTitle: string;
  onBack?: () => void;
  onSendTip?: (data: {
    tipJarId: string;
    amount: number;
    message?: string;
    showName: boolean;
  }) => void;
}

const APP_FEE_PERCENTAGE = 2; // 2% app fee

export default function SupportScreen({
  tipJarId,
  tipJarTitle,
  onBack,
  onSendTip
}: SupportScreenProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | undefined>();
  const [message, setMessage] = useState("");
  const [showName, setShowName] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate fees
  const tipAmount = selectedAmount || 0;
  const appFee = (tipAmount * APP_FEE_PERCENTAGE) / 100;
  const totalAmount = tipAmount + appFee;

  const handleSendTip = async () => {
    if (!selectedAmount) return;

    setIsProcessing(true);
    try {
      // Simulate transaction processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onSendTip?.({
        tipJarId,
        amount: selectedAmount,
        message: message.trim() || undefined,
        showName
      });
    } catch (error) {
      console.error("Error sending tip:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="px-4 py-6 max-w-md mx-auto min-h-screen bg-background">
      {/* Enhanced Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 bg-accent hover:bg-accent/80 rounded-xl flex items-center justify-center border border-border transition-all duration-200 mr-4"
        >
          <span className="text-lg">←</span>
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-foreground text-lg leading-tight">
            Support: {tipJarTitle}
          </h1>
          <p className="text-xs text-muted-foreground">Send USDC tip to creator</p>
        </div>
      </div>

      <div className="space-y-8">
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
            placeholder="Good luck with your app!"
            rows={3}
            maxLength={200}
            className="w-full px-4 py-4 border border-border rounded-xl bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary resize-none transition-all duration-200"
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
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
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

        {/* Enhanced Transaction Summary */}
        {selectedAmount && (
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              📊 <span>Transaction Summary</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tip Amount:</span>
                <span className="font-semibold text-foreground">${tipAmount.toFixed(2)} USDC</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">App Fee ({APP_FEE_PERCENTAGE}%):</span>
                <span className="font-semibold text-foreground">${appFee.toFixed(2)} USDC</span>
              </div>
              <div className="border-t border-primary/20 pt-3 flex justify-between items-center">
                <span className="font-bold text-foreground">You Send:</span>
                <span className="font-bold text-foreground text-lg">${totalAmount.toFixed(2)} USDC</span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Send Button */}
        <Button
          onClick={handleSendTip}
          disabled={!selectedAmount || isProcessing}
          isLoading={isProcessing}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground py-4 rounded-2xl font-bold text-lg shadow-lg disabled:from-muted disabled:to-muted disabled:text-muted-foreground transition-all duration-200"
        >
          {isProcessing ? "Processing..." : selectedAmount ? `💳 Send ${selectedAmount} via Base Pay` : "💳 Select Amount to Continue"}
        </Button>

        {/* Enhanced Security Note */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-accent/30 px-4 py-3 rounded-xl border border-border">
            <div className="w-6 h-6 bg-green-500/10 rounded-full flex items-center justify-center">
              <span className="text-xs">🔒</span>
            </div>
            <span>Secured by Base blockchain</span>
          </div>
        </div>

        {/* Enhanced Preview */}
        {selectedAmount && (
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-2xl p-6">
            <h4 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
              👁️ <span>Preview</span>
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <span className="text-xs">{showName ? "👤" : "🔒"}</span>
                </div>
                <span className="font-medium">
                  {showName ? "You" : "Anonymous"}
                </span>
                <span>will tip</span>
                <span className="font-bold text-blue-900">${selectedAmount} USDC</span>
              </div>
              {message && (
                <div className="mt-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <div className="text-sm text-blue-800 italic">"{message}"</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="mb-20"></div>
    </div>
  );
}