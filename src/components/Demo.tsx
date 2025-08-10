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
import { Header } from "~/components/ui/Header";

// Import all screens
import DiscoverScreen from "~/components/screens/DiscoverScreen";
import CreateTipJarScreen from "~/components/screens/CreateTipJarScreen";
import TipJarDetailScreen from "~/components/screens/TipJarDetailScreen";
import SupportScreen from "~/components/screens/SupportScreen";
import DashboardScreen from "~/components/screens/DashboardScreen";

export type Tab = "home" | "create" | "profile" | "wallet";

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
          <Header neynarUser={neynarUser} />

          {/* Tab Content */}
          {activeTab === "home" && (
            <DiscoverScreen
              onTipJarClick={openTipJarDetail}
              onCreateClick={handleCreateTipJar}
            />
          )}

          {activeTab === "create" && (
            <CreateTipJarScreen
              onBack={() => setActiveTab("home")}
              onSave={handleSaveTipJar}
              onCancel={() => setActiveTab("home")}
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
            />
          )}

          {activeTab === "wallet" && (
            <div className="px-4 py-6 max-w-md mx-auto">
              {/* Wallet Header */}
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-gray-900">💰 Wallet</h1>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm">👤</span>
                </div>
              </div>

              {/* Connection Status */}
              <div className="space-y-4">
                {!isConnected ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔗</div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                      Connect Your Wallet
                    </h2>
                    <p className="text-gray-600 mb-6">
                      Connect your wallet to start sending and receiving tips
                    </p>
                    
                    <div className="space-y-3">
                      {connectors.map((connector) => (
                        <Button
                          key={connector.id}
                          onClick={() => connect({ connector })}
                          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg"
                        >
                          Connect {connector.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Wallet Address */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Wallet Address</div>
                      <div className="font-mono text-sm text-gray-900">
                        {truncateAddress(address!)}
                      </div>
                    </div>

                    {/* Balances */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900">Token Balances</h3>
                      
                      {/* ETH Balance */}
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">ETH</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">Ethereum</div>
                              <div className="text-sm text-gray-600">ETH</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              {ethBalance ? parseFloat(ethBalance.formatted).toFixed(4) : "0.0000"}
                            </div>
                            <div className="text-sm text-gray-600">ETH</div>
                          </div>
                        </div>
                      </div>

                      {/* USDC Balance */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">$</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">USD Coin</div>
                              <div className="text-sm text-gray-600">USDC</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">
                              {usdcBalance ? parseFloat(usdcBalance.formatted).toFixed(2) : "0.00"}
                            </div>
                            <div className="text-sm text-gray-600">USDC</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Network Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Network</div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">Base Network</span>
                      </div>
                    </div>

                    {/* Disconnect Button */}
                    <Button
                      onClick={() => disconnect()}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg"
                    >
                      Disconnect Wallet
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Custom Footer for Social Tip Jar */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2">
            <div className="flex justify-around max-w-md mx-auto">
              <button
                onClick={() => setActiveTab("home")}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  activeTab === "home"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <span className="text-lg mb-1">🏠</span>
                <span className="text-xs font-medium">Home</span>
              </button>
              
              <button
                onClick={() => setActiveTab("create")}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  activeTab === "create"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <span className="text-lg mb-1">➕</span>
                <span className="text-xs font-medium">Create</span>
              </button>
              
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  activeTab === "profile"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <span className="text-lg mb-1">👤</span>
                <span className="text-xs font-medium">Profile</span>
              </button>
              
              <button
                onClick={() => setActiveTab("wallet")}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                  activeTab === "wallet"
                    ? "bg-blue-100 text-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <span className="text-lg mb-1">💰</span>
                <span className="text-xs font-medium">Wallet</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}