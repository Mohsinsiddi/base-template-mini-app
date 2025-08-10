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

  const buttonSize = variant === "compact" ? "px-4 py-3 text-sm" : "px-5 py-4 text-base";
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-4 gap-3">
        {QUICK_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => onAmountSelect(amount)}
            className={`${buttonSize} border-2 rounded-xl font-semibold transition-all duration-200 ${
              selectedAmount === amount
                ? "border-primary bg-primary text-primary-foreground shadow-lg scale-105"
                : "border-border bg-card text-card-foreground hover:border-primary/50 hover:bg-accent active:scale-95"
            }`}
          >
            ${amount}
          </button>
        ))}
      </div>

      {showCustom && (
        <div className="space-y-3">
          {!showCustomInput ? (
            <button
              onClick={() => setShowCustomInput(true)}
              className={`w-full ${buttonSize} border-2 border-dashed border-border rounded-xl text-muted-foreground hover:border-primary/50 hover:bg-accent transition-all duration-200`}
            >
              Custom Amount
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-20 py-3 border border-border rounded-xl bg-card text-card-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-medium">
                    {currency}
                  </span>
                </div>
                <button
                  onClick={handleCustomSubmit}
                  disabled={!customAmount || parseFloat(customAmount) <= 0}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  Set
                </button>
              </div>
              <button
                onClick={() => {
                  setShowCustomInput(false);
                  setCustomAmount("");
                }}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {selectedAmount && (
        <div className="text-center text-sm text-muted-foreground bg-accent/50 py-3 rounded-xl border border-border">
          Selected: <span className="font-semibold text-foreground">${selectedAmount} {currency}</span>
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