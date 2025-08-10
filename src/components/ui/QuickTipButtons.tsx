import { useState } from "react";

const QUICK_AMOUNTS = [1, 5, 10, 25];

interface QuickTipButtonsProps {
  onAmountSelect: (amount: number) => void;
  selectedAmount?: number;
  currency?: string;
  variant?: "default" | "compact";
  showCustom?: boolean;
  className?: string;
}

export function QuickTipButtons({
  onAmountSelect,
  selectedAmount,
  currency = "USDC",
  variant = "default",
  showCustom = true,
  className = ""
}: QuickTipButtonsProps) {
  const [customAmount, setCustomAmount] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleCustomSubmit = () => {
    const amount = parseFloat(customAmount);
    if (amount > 0) {
      onAmountSelect(amount);
      setCustomAmount("");
      setShowCustomInput(false);
    }
  };

  const buttonSize = variant === "compact" ? "px-3 py-2 text-sm" : "px-4 py-3 text-base";
  
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="grid grid-cols-4 gap-2">
        {QUICK_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => onAmountSelect(amount)}
            className={`${buttonSize} border-2 rounded-lg font-medium transition-all ${
              selectedAmount === amount
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            ${amount}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="space-y-2">
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className={`w-full ${buttonSize} border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all`}
            >
              Custom Amount
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-16 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    {currency}
                  </span>
                </div>
                <button
                  onClick={handleCustomSubmit}
                  disabled={!customAmount || parseFloat(customAmount) <= 0}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Set
                </button>
              </div>
              <button
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomAmount("");
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {selectedAmount && (
        <div className="text-center text-sm text-gray-600 bg-gray-50 py-2 rounded-lg">
          Selected: <span className="font-medium">${selectedAmount} {currency}</span>
        </div>
      )}
    </div>
  );
}

// Utility function for tip amount validation
export function validateTipAmount(amount: number): { isValid: boolean; error?: string } {
  if (amount <= 0) {
    return { isValid: false, error: "Amount must be greater than 0" };
  }
  if (amount > 10000) {
    return { isValid: false, error: "Amount cannot exceed $10,000" };
  }
  if (amount < 0.01) {
    return { isValid: false, error: "Minimum amount is $0.01" };
  }
  return { isValid: true };
}