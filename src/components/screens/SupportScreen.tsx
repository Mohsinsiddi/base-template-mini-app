"use client";

import { useState, useEffect } from "react";
import { QuickTipButtons } from "~/components/ui/QuickTipButtons";
import { Button } from "~/components/ui/Button";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits } from "viem";

interface SupportScreenProps {
  tipJarId: string;
  tipJarTitle: string;
  onBack?: () => void;
  onTipSuccess?: (data: {
    tipJarId: string;
    amount: number;
    message?: string;
    showName: boolean;
    txHash: string;
  }) => void;
}

// USDC Contract on Base Mainnet
const USDC_CONTRACT_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
// Demo recipient address (your address for safe demo)
const DEMO_RECIPIENT_ADDRESS = "0x802D8097eC1D49808F3c2c866020442891adde57";

// USDC ABI (minimal - just transfer function)
const USDC_ABI = [
  {
    name: "transfer", 
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }]
  }
] as const;

export default function SupportScreen({
  tipJarId,
  tipJarTitle,
  onBack,
  onTipSuccess
}: SupportScreenProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | undefined>();
  const [message, setMessage] = useState("");
  const [showName, setShowName] = useState(true);
  const [hasNotifiedSuccess, setHasNotifiedSuccess] = useState(false);

  const { writeContract, data: txHash, error, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const isProcessing = isPending || isConfirming;

  // Handle successful transaction - notify parent when confirmed
  useEffect(() => {
    if (isConfirmed && txHash && selectedAmount && !hasNotifiedSuccess) {
      console.log("✅ Transaction confirmed, notifying parent");
      setHasNotifiedSuccess(true);
      
      // Notify parent component with transaction details
      onTipSuccess?.({
        tipJarId,
        amount: selectedAmount,
        message: message.trim() || undefined,
        showName,
        txHash
      });
    }
  }, [isConfirmed, txHash, selectedAmount, hasNotifiedSuccess, onTipSuccess, tipJarId, message, showName]);

  const handleSendTip = async () => {
    if (!selectedAmount) return;

    try {
      // Convert amount to USDC units (6 decimals)
      const amountInUnits = parseUnits(selectedAmount.toString(), 6);
      
      // Execute USDC transfer to demo address
      writeContract({
        address: USDC_CONTRACT_ADDRESS,
        abi: USDC_ABI,
        functionName: "transfer",
        args: [DEMO_RECIPIENT_ADDRESS as `0x${string}`, amountInUnits],
      });
      
    } catch (error) {
      console.error("Error sending USDC:", error);
    }
  };

  const getButtonText = () => {
    if (isPending) return "Confirming Transaction...";
    if (isConfirming) return "Processing on Base...";
    if (isConfirmed) return "✅ Tip Sent Successfully!";
    if (selectedAmount) return `💳 Send $${selectedAmount} USDC`;
    return "💳 Select Amount to Continue";
  };

  return (
    <div className="px-4 py-6 max-w-md mx-auto min-h-screen bg-background">
      {/* Enhanced Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          disabled={isProcessing}
          className="w-10 h-10 bg-accent hover:bg-accent/80 rounded-xl flex items-center justify-center border border-border transition-all duration-200 mr-4 disabled:opacity-50"
        >
          <span className="text-lg">←</span>
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-foreground text-lg leading-tight">
            Support: {tipJarTitle}
          </h1>
          <p className="text-xs text-muted-foreground">Send USDC tip via Base Pay</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Transaction Progress (show when processing) */}
        {isProcessing && (
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <div>
                <h3 className="font-bold text-foreground">{getButtonText()}</h3>
                <p className="text-xs text-muted-foreground">Please wait while we process your tip</p>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className={`flex items-center gap-2 text-sm ${isPending ? 'text-primary' : isConfirmed ? 'text-green-600' : 'text-muted-foreground'}`}>
                <span className="w-2 h-2 rounded-full bg-current"></span>
                Sending ${selectedAmount} USDC
                {isConfirmed && <span className="text-xs opacity-60">✓</span>}
              </div>
              <div className={`flex items-center gap-2 text-sm ${isConfirming ? 'text-primary' : !isConfirmed ? 'text-muted-foreground' : 'text-green-600'}`}>
                <span className="w-2 h-2 rounded-full bg-current"></span>
                Confirming on Base blockchain
                {isConfirmed && <span className="text-xs opacity-60">✓</span>}
              </div>
            </div>

            {/* Transaction hash (once available) */}
            {txHash && (
              <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">Transaction Hash:</p>
                <p className="text-xs font-mono text-primary break-all">{txHash}</p>
                <a 
                  href={`https://basescan.org/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  View on BaseScan →
                </a>
              </div>
            )}
          </div>
        )}

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

        {/* Transaction Summary */}
        {selectedAmount && (
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
              📊 <span>Transaction Summary</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tip Amount:</span>
                <span className="font-semibold text-foreground">${selectedAmount.toFixed(2)} USDC</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Recipient:</span>
                <span className="font-mono text-xs text-foreground">
                  {DEMO_RECIPIENT_ADDRESS.slice(0, 6)}...{DEMO_RECIPIENT_ADDRESS.slice(-4)}
                </span>
              </div>
              <div className="border-t border-primary/20 pt-3 flex justify-between items-center">
                <span className="font-bold text-foreground">You Send:</span>
                <span className="font-bold text-foreground text-lg">${selectedAmount.toFixed(2)} USDC</span>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Send Button */}
        <Button
          onClick={handleSendTip}
          disabled={!selectedAmount || isProcessing || isConfirmed}
          isLoading={isProcessing}
          className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground py-4 rounded-2xl font-bold text-lg shadow-lg disabled:from-muted disabled:to-muted disabled:text-muted-foreground transition-all duration-200"
        >
          {getButtonText()}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <span className="text-lg">⚠️</span>
              <span className="font-semibold">Transaction Failed</span>
            </div>
            <p className="text-sm text-red-700">
              {error.message || "Something went wrong. Please try again."}
            </p>
          </div>
        )}

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
        {selectedAmount && !isProcessing && (
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

        {/* Success State */}
        {isConfirmed && (
          <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="font-bold text-green-800 mb-2">Tip Sent Successfully!</h3>
            <p className="text-sm text-green-700">
              Your ${selectedAmount} USDC tip has been sent via Base Pay
            </p>
          </div>
        )}
      </div>

      {/* Bottom spacing */}
      <div className="mb-20"></div>
    </div>
  );
}