"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useDisconnect,
  useConnect,
  useBalance,
  useWriteContract,
  useWaitForTransactionReceipt
} from "wagmi";
import { parseUnits } from "viem";

import { Button } from "~/components/ui/Button";
import { truncateAddress } from "~/lib/truncateAddress";
import { base } from "wagmi/chains";
import { useMiniApp } from "@neynar/react";

// Import all screens
import DiscoverScreen from "~/components/screens/DiscoverScreen";
import CreateTipJarScreen from "~/components/screens/CreateTipJarScreen";
import TipJarDetailScreen from "~/components/screens/TipJarDetailScreen";
import SupportScreen from "~/components/screens/SupportScreen";
import DashboardScreen from "~/components/screens/DashboardScreen";
import HomeScreen from "~/components/screens/HomeScreen";

export type Tab = "home" | "create" | "discover" | "profile";

interface NeynarUser {
  fid: number;
  score: number;
}

interface ModalState {
  isOpen: boolean;
  screen: "tipjar-detail" | "support" | "success" | null;
  data?: any;
}

// USDC contract address on Base
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";
const DEMO_RECIPIENT_ADDRESS = "0x848D8fb144c88a02EA74AcE06D25dC320a853315";

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

export default function Demo(
  { title }: { title?: string } = { title: "Social Tip Jar" }
) {
  const { isSDKLoaded, context } = useMiniApp();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [neynarUser, setNeynarUser] = useState<NeynarUser | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentTipData, setCurrentTipData] = useState<any>(null);
  
  // Modal state for overlay screens
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    screen: null,
    data: null
  });

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();

  // USDC contract interaction
  const { writeContract, data: txHash, error: txError, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
    chainId: base.id,
  });

  // Get USDC balance
  const { data: usdcBalance, refetch: refetchUsdcBalance } = useBalance({
    address: address,
    token: USDC_ADDRESS,
    chainId: base.id,
  });

  useEffect(() => {
    console.log("isSDKLoaded", isSDKLoaded);
    console.log("context", context);
    console.log("address", address);
    console.log("isConnected", isConnected);
  }, [context, address, isConnected, isSDKLoaded]);

  // Handle successful transaction confirmation
  useEffect(() => {
    if (isConfirmed && txHash && currentTipData) {
      console.log("✅ Transaction confirmed:", txHash);
      
      // Refresh USDC balance
      refetchUsdcBalance();
      
      // Show success modal with details
      setModal({
        isOpen: true,
        screen: "success",
        data: {
          ...currentTipData,
          txHash,
          timestamp: new Date().toISOString()
        }
      });
      
      // Clear current tip data
      setCurrentTipData(null);
    }
  }, [isConfirmed, txHash, currentTipData, refetchUsdcBalance]);

  // Handle transaction errors
  useEffect(() => {
    if (txError) {
      console.error("❌ Transaction failed:", txError);
      setSuccessMessage("❌ Transaction failed. Please try again.");
      setCurrentTipData(null);
    }
  }, [txError]);

  // Fetch Neynar user object when context is available
  useEffect(() => {
    const fetchNeynarUserObject = async () => {
      if (context?.user?.fid) {
        try {
          const response = await fetch(`/api/users?fids=${context.user.fid}`);
          const data = await response.json();
          if (data.users?.[0]) {
            setNeynarUser(data.users[0]);
          }
        } catch (error) {
          console.error("Failed to fetch Neynar user object:", error);
        }
      }
    };

    fetchNeynarUserObject();
  }, [context?.user?.fid]);

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Navigation Handlers
  const openTipJarDetail = useCallback((tipJarId: string) => {
    console.log("Demo: Opening tip jar detail for", tipJarId);
    setModal({
      isOpen: true,
      screen: "tipjar-detail",
      data: { tipJarId }
    });
  }, []);

  const openSupportScreen = useCallback((tipJarId: string) => {
    console.log("Demo: Opening support screen for", tipJarId);
    // Check wallet connection first
    if (!isConnected) {
      setSuccessMessage("⚠️ Please connect your wallet first to send tips");
      setActiveTab("profile");
      return;
    }
    
    setModal({
      isOpen: true,
      screen: "support", 
      data: { tipJarId, tipJarTitle: "Coffee for my startup" } // TODO: Get actual title
    });
  }, [isConnected]);

  const closeModal = useCallback(() => {
    console.log("Demo: Closing modal");
    setModal({ isOpen: false, screen: null, data: null });
  }, []);

  // Action Handlers
  const handleCreateTipJar = useCallback(() => {
    setActiveTab("create");
  }, []);

  const handleSaveTipJar = useCallback((formData: any) => {
    console.log("📝 Creating tip jar:", formData);
    console.log("👤 Creator address:", address);
    
    // For demo - just show success, no API calls needed
    setSuccessMessage("🎉 Tip jar created successfully!");
    setActiveTab("home");
  }, [address]);

  // Updated handleSendTip with actual USDC contract call
  const handleSendTip = useCallback(async (tipData: {
    tipJarId: string;
    amount: number;
    message?: string;
    showName: boolean;
  }) => {
    console.log("Demo: Received tip data from SupportScreen:", tipData);
    
    if (!isConnected || !address) {
      setSuccessMessage("⚠️ Please connect your wallet first!");
      return;
    }

    try {
      // Store tip data for success modal
      setCurrentTipData(tipData);
      
      // Convert amount to USDC units (6 decimals)
      const amountInUnits = parseUnits(tipData.amount.toString(), 6);
      
      console.log("Demo: Initiating USDC transfer...", {
        amount: tipData.amount,
        amountInUnits: amountInUnits.toString(),
        to: DEMO_RECIPIENT_ADDRESS
      });
      
      // Execute USDC transfer
      writeContract({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: "transfer",
        args: [DEMO_RECIPIENT_ADDRESS as `0x${string}`, amountInUnits],
      });
      
      console.log("🔄 Transaction initiated for", tipData.amount, "USDC");
      
    } catch (error) {
      console.error("❌ Error initiating transaction:", error);
      setSuccessMessage("❌ Failed to send tip. Please try again.");
      setCurrentTipData(null);
    }
  }, [isConnected, address, writeContract]);

  const handleWithdraw = useCallback(() => {
    console.log("💰 Withdrawing funds...");
    setSuccessMessage("💰 Withdrawal initiated!");
  }, []);

  const handleShare = useCallback((tipJarId: string) => {
    console.log("Sharing tip jar:", tipJarId);
    
    try {
      const shareUrl = `${window.location.origin}/tipjar/${tipJarId}`;
      navigator.clipboard.writeText(shareUrl);
      setSuccessMessage("📋 Share link copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setSuccessMessage("📱 Share feature coming soon!");
    }
  }, []);

  // Success Modal Component
  const SuccessModal = ({ data }: { data: any }) => (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="px-4 py-6 max-w-md mx-auto min-h-screen bg-background">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🎉</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Tip Sent Successfully!
          </h1>
          <p className="text-muted-foreground">
            Your USDC tip has been sent via Base Pay
          </p>
        </div>

        {/* Transaction Details */}
        <div className="space-y-6">
          {/* Amount Card */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-2xl p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-800 mb-1">
                ${data.amount} USDC
              </div>
              <div className="text-sm text-green-600">
                Tip Amount
              </div>
            </div>
          </div>

          {/* Tip Jar Details */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              🏺 <span>Tip Jar Details</span>
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Tip Jar ID:</span>
                <span className="font-mono text-sm text-foreground">{data.tipJarId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Visibility:</span>
                <span className="text-foreground">{data.showName ? "Public" : "Anonymous"}</span>
              </div>
              {data.message && (
                <div>
                  <div className="text-muted-foreground mb-2">Message:</div>
                  <div className="bg-accent/50 rounded-lg p-3 text-sm text-foreground italic">
                    "{data.message}"
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transaction Info */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              🔗 <span>Transaction Details</span>
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-muted-foreground text-sm mb-1">Transaction Hash:</div>
                <div className="font-mono text-xs text-foreground break-all bg-accent/50 p-3 rounded-lg">
                  {data.txHash}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Network:</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-foreground">Base</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-green-600 font-medium">Confirmed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <a
              href={`https://basescan.org/tx/${data.txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium text-center transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <span>View on BaseScan</span>
              <span className="text-lg">↗</span>
            </a>
            
            <Button
              onClick={() => {
                closeModal();
                setActiveTab("home");
              }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl font-medium"
            >
              🏠 Back to Home
            </Button>
          </div>

          {/* Share Success */}
          <div className="text-center">
            <button
              onClick={() => {
                const successText = `🎉 Just sent $${data.amount} USDC tip via Social Tip Jar on Base! Tx: ${data.txHash}`;
                navigator.clipboard.writeText(successText);
                setSuccessMessage("📋 Success message copied!");
              }}
              className="text-primary hover:text-primary/80 text-sm font-medium transition-colors duration-200"
            >
              📤 Share this success
            </button>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="mb-20"></div>
      </div>
    </div>
  );

  if (!isSDKLoaded) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-2xl mb-2">🏠</div>
          <div>Loading Social Tip Jar...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        paddingTop: context?.client.safeAreaInsets?.top ?? 0,
        paddingBottom: context?.client.safeAreaInsets?.bottom ?? 0,
        paddingLeft: context?.client.safeAreaInsets?.left ?? 0,
        paddingRight: context?.client.safeAreaInsets?.right ?? 0,
      }}
    >
      <div className="mx-auto py-2 px-0 pb-20 relative">
        
                  {/* Modal Overlay */}
        {modal.isOpen && (
          <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
            {modal.screen === "tipjar-detail" && (
              <TipJarDetailScreen
                tipJarId={modal.data?.tipJarId}
                onBack={closeModal}
                onSendTip={handleSendTip}
                onShare={handleShare}
                isConnected={isConnected}
                isProcessing={isPending || isConfirming}
              />
            )}
            {modal.screen === "success" && modal.data && (
              <SuccessModal data={modal.data} />
            )}
          </div>
        )}

        {/* Transaction Processing Overlay */}
        {(isPending || isConfirming) && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 text-center shadow-2xl">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-lg font-bold text-foreground mb-2">
                {isPending ? "Confirming Transaction..." : "Processing on Base..."}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isPending ? "Please confirm in your wallet" : "Your tip is being processed on the blockchain"}
              </p>
              {currentTipData && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                  <div className="text-sm text-primary font-medium">
                    Sending ${currentTipData.amount} USDC
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main App Content */}
        <div className={modal.isOpen ? "hidden" : ""}>
          {/* Success Message Toast */}
          {successMessage && (
            <div className="fixed top-4 left-4 right-4 z-40 max-w-md mx-auto">
              <div className="bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg border border-green-600 animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{successMessage}</span>
                  <button 
                    onClick={() => setSuccessMessage(null)}
                    className="ml-auto text-white/80 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Clean Enhanced Header */}
          <div className="bg-gradient-to-r from-primary/8 via-primary/5 to-primary/8 border-b border-border px-4 py-4 mb-4 shadow-sm">
            <div className="flex items-center justify-center max-w-md mx-auto">
              <div className="flex items-center gap-4">
                {/* Enhanced App Logo */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg border border-primary/20">
                    <div className="relative">
                      {/* Logo icon with layered design */}
                      <span className="text-2xl">🏺</span>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
                    </div>
                  </div>
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl -z-10"></div>
                </div>
                
                {/* Clean App Name and Tagline */}
                <div className="flex-1">
                  <h1 className="font-black text-xl text-foreground bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Social Tip Jar
                  </h1>
                  <p className="text-xs text-muted-foreground font-medium">
                    Fund creators with USDC • Built on Base
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "home" && (
            <HomeScreen
              onTipJarClick={openTipJarDetail}
              onCreateClick={handleCreateTipJar}
              onDiscoverClick={() => setActiveTab("discover")}
              onViewAllFeatured={() => setActiveTab("discover")}
            />
          )}

          {activeTab === "create" && (
            <CreateTipJarScreen
              onBack={() => setActiveTab("home")}
              onSave={handleSaveTipJar}
              onCancel={() => setActiveTab("home")}
            />
          )}

          {activeTab === "discover" && (
            <DiscoverScreen
              onTipJarClick={openTipJarDetail}
              onCreateClick={handleCreateTipJar}
            />
          )}

          {activeTab === "profile" && (
            <DashboardScreen
              onTipJarClick={openTipJarDetail}
              onCreateNew={handleCreateTipJar}
              onWithdraw={handleWithdraw}
              onViewAnalytics={() => alert("Analytics coming soon!")}
              onViewMessages={() => alert("Messages coming soon!")}
              onEditTipJar={(id) => alert(`Edit tip jar ${id}`)}
              onShareTipJar={handleShare}
              walletContent={
                <div className="space-y-4 mt-6">
                  {/* Wallet Section in Profile */}
                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">💰 Wallet</h3>
                    
                    {!isConnected ? (
                      <div className="text-center py-6">
                        <div className="text-3xl mb-3">🔗</div>
                        <h4 className="text-md font-semibold text-gray-900 mb-2">
                          Connect Your Wallet
                        </h4>
                        <p className="text-gray-600 mb-4 text-sm">
                          Connect to start sending and receiving tips
                        </p>
                        
                        <div className="space-y-2">
                          {/* Smart Wallet for Frame context */}
                          {context ? (
                            <Button
                              onClick={() => connect({ connector: connectors[0] })}
                              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm"
                            >
                              Connect Smart Wallet
                            </Button>
                          ) : (
                            <>
                              {/* Coinbase Wallet */}
                              <Button
                                onClick={() => connect({ connector: connectors[1] })}
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm"
                              >
                                Connect Coinbase Wallet
                              </Button>
                              {/* MetaMask */}
                              <Button
                                onClick={() => connect({ connector: connectors[2] })}
                                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg text-sm"
                              >
                                Connect MetaMask
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Wallet Address */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-600 mb-1">Wallet Address</div>
                          <div className="font-mono text-sm text-gray-900">
                            {truncateAddress(address!)}
                          </div>
                        </div>

                        {/* Balances */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 text-sm">Token Balances</h4>
                          
                          {/* USDC Balance */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">$</span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 text-sm">USDC</div>
                                  <div className="text-xs text-gray-600">USD Coin</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-gray-900 text-sm">
                                  {usdcBalance ? parseFloat(usdcBalance.formatted).toFixed(2) : "0.00"}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ETH Balance */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">E</span>
                                </div>
                                <div>
                                  <div className="font-medium text-gray-900 text-sm">ETH</div>
                                  <div className="text-xs text-gray-600">Ethereum</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-gray-900 text-sm">
                                  {ethBalance ? parseFloat(ethBalance.formatted).toFixed(4) : "0.0000"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Network Info */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="font-medium text-gray-900 text-sm">Base Network</span>
                          </div>
                        </div>

                        {/* Disconnect Button */}
                        <Button
                          onClick={() => disconnect()}
                          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm"
                        >
                          Disconnect Wallet
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              }
            />
          )}

          {/* Enhanced Custom Footer for Social Tip Jar */}
          <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border px-4 py-3 shadow-lg">
            <div className="flex justify-around max-w-md mx-auto">
              <button
                onClick={() => setActiveTab("home")}
                className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 ${
                  activeTab === "home"
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent active:scale-95"
                }`}
              >
                <span className="text-lg mb-1">🏠</span>
                <span className="text-xs font-medium">Home</span>
              </button>
              
              <button
                onClick={() => setActiveTab("create")}
                className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 ${
                  activeTab === "create"
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent active:scale-95"
                }`}
              >
                <span className="text-lg mb-1">➕</span>
                <span className="text-xs font-medium">Create</span>
              </button>
              
              <button
                onClick={() => setActiveTab("discover")}
                className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 ${
                  activeTab === "discover"
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent active:scale-95"
                }`}
              >
                <span className="text-lg mb-1">🔍</span>
                <span className="text-xs font-medium">Discover</span>
              </button>
              
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex flex-col items-center py-3 px-4 rounded-xl transition-all duration-200 ${
                  activeTab === "profile"
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent active:scale-95"
                }`}
              >
                <span className="text-lg mb-1">👤</span>
                <span className="text-xs font-medium">Profile</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}