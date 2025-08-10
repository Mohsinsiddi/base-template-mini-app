"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useAccount,
  useDisconnect,
  useConnect,
  useBalance
} from "wagmi";

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
  screen: "tipjar-detail" | "support" | null;
  data?: any;
}

// USDC contract address on Base
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

export default function Demo(
  { title }: { title?: string } = { title: "Social Tip Jar" }
) {
  const { isSDKLoaded, context } = useMiniApp();
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [neynarUser, setNeynarUser] = useState<NeynarUser | null>(null);
  
  // Modal state for overlay screens
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    screen: null,
    data: null
  });

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
    chainId: base.id,
  });

  // Get USDC balance
  const { data: usdcBalance } = useBalance({
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

  // Navigation Handlers
  const openTipJarDetail = useCallback((tipJarId: string) => {
    setModal({
      isOpen: true,
      screen: "tipjar-detail",
      data: { tipJarId }
    });
  }, []);

  const openSupportScreen = useCallback((tipJarId: string, tipJarTitle: string) => {
    setModal({
      isOpen: true,
      screen: "support", 
      data: { tipJarId, tipJarTitle }
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ isOpen: false, screen: null, data: null });
  }, []);

  // Action Handlers
  const handleCreateTipJar = useCallback(() => {
    setActiveTab("create");
  }, []);

  const handleSaveTipJar = useCallback((formData: any) => {
    console.log("Creating tip jar:", formData);
    // TODO: Implement actual tip jar creation
    alert("Tip jar created successfully!");
    setActiveTab("home");
  }, []);

  const handleSendTip = useCallback((tipData: any) => {
    console.log("Sending tip:", tipData);
    // TODO: Implement actual tip sending
    alert(`Tip of $${tipData.amount} sent successfully!`);
    closeModal();
  }, [closeModal]);

  const handleWithdraw = useCallback(() => {
    console.log("Withdrawing funds...");
    // TODO: Implement withdrawal
    alert("Withdrawal initiated!");
  }, []);

  const handleShare = useCallback((tipJarId: string) => {
    console.log("Sharing tip jar:", tipJarId);
    // TODO: Implement sharing
    const shareUrl = `${process.env.NEXT_PUBLIC_URL}/tipjar/${tipJarId}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Share link copied!");
  }, []);

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
                onSupport={(tipJarId) => {
                  // Get tip jar title for support screen
                  const tipJarTitle = "Sample Tip Jar"; // TODO: Get actual title
                  openSupportScreen(tipJarId, tipJarTitle);
                }}
                onShare={handleShare}
              />
            )}
            {modal.screen === "support" && (
              <SupportScreen
                tipJarId={modal.data?.tipJarId}
                tipJarTitle={modal.data?.tipJarTitle}
                onBack={() => {
                  // Go back to tip jar detail
                  setModal({
                    isOpen: true,
                    screen: "tipjar-detail",
                    data: { tipJarId: modal.data?.tipJarId }
                  });
                }}
                onSendTip={handleSendTip}
              />
            )}
          </div>
        )}

        {/* Main App Content */}
        <div className={modal.isOpen ? "hidden" : ""}>
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-border px-4 py-4 mb-4">
            <div className="flex items-center justify-between max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-xl">🏠</span>
                </div>
                <div>
                  <h1 className="font-bold text-foreground text-lg">Social Tip Jar</h1>
                  <p className="text-xs text-muted-foreground">Support creators with USDC</p>
                </div>
              </div>
              {neynarUser && (
                <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center border border-border">
                  <span className="text-sm font-medium text-accent-foreground">👤</span>
                </div>
              )}
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
                          {connectors.slice(0, 2).map((connector) => (
                            <Button
                              key={connector.id}
                              onClick={() => connect({ connector })}
                              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg text-sm"
                            >
                              Connect {connector.name}
                            </Button>
                          ))}
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