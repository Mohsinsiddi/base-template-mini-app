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
    <div className="px-4 py-6 max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button 
          onClick={onBack}
          className="text-blue-500 hover:text-blue-600 font-medium mr-3"
        >
          ←
        </button>
        <h1 className="font-semibold text-gray-900 truncate">
          Support: {tipJarTitle}
        </h1>
      </div>

      <div className="space-y-6">
        {/* Amount Selection */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            💰 Choose Your Tip Amount
          </h2>
          <QuickTipButtons
            onAmountSelect={setSelectedAmount}
            selectedAmount={selectedAmount}
            variant="default"
            showCustom={true}
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            💬 Leave a message (optional)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Good luck with your app!"
            rows={3}
            maxLength={200}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          <div className="text-xs text-gray-400 mt-1 text-right">
            {message.length}/200
          </div>
        </div>

        {/* Show Name Toggle */}
        <div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span>👤</span>
              <span className="text-sm font-medium text-gray-700">
                Show my name publicly
              </span>
            </div>
            <button
              onClick={() => setShowName(!showName)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showName ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showName ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Transaction Summary */}
        {selectedAmount && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              📊 Transaction Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tip Amount:</span>
                <span className="font-medium">${tipAmount.toFixed(2)} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">App Fee ({APP_FEE_PERCENTAGE}%):</span>
                <span className="font-medium">${appFee.toFixed(2)} USDC</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="font-medium text-gray-900">You Send:</span>
                <span className="font-bold text-gray-900">${totalAmount.toFixed(2)} USDC</span>
              </div>
            </div>
          </div>
        )}

        {/* Send Button */}
        <Button
          onClick={handleSendTip}
          disabled={!selectedAmount || isProcessing}
          isLoading={isProcessing}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium disabled:bg-gray-300"
        >
          {isProcessing ? "Processing..." : "💳 Send Tip via Base Pay"}
        </Button>

        {/* Security Note */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
            <span>🔒</span>
            <span>Secured by Base blockchain</span>
          </div>
        </div>

        {/* Preview */}
        {selectedAmount && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-900 mb-2">Preview:</h4>
            <div className="text-sm text-blue-800">
              <div className="flex items-center gap-1 mb-1">
                <span>{showName ? "You" : "Anonymous"}</span>
                <span>will tip</span>
                <span className="font-medium">${selectedAmount} USDC</span>
              </div>
              {message && (
                <div className="italic">"{message}"</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}