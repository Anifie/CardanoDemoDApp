"use client";

import React, { useEffect, useState } from "react";
import { useMembership } from "../../common/service/useMembership";
import { useWeb3Auth } from "../../common/service/useWeb3Auth";
import { BackgroundSection } from "../../components/page-components";

const MyNFTPage = () => {
    const { getMyNFT } = useMembership();
    const [nfts, setNfts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { isLoggedIn, login, logout, getUserInfo, getAccounts, idToken, appPubKey, cardanoWalletAddress } = useWeb3Auth();
    // const { isSignedIn, isFirstTimeSignIn, memberProfile, memberSignIn, mintMembershipNFT, nftCheckQueue } = useMembership();
    useEffect(() => {
        if (isLoggedIn) {
            if (!idToken || !appPubKey) {
                getUserInfo()
                getAccounts()
            }

        }
    }, [isLoggedIn])
    useEffect(() => {
        const fetchNFTs = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getMyNFT();
                if (Array.isArray(result)) {
                    setNfts(result);
                } else if (result && result.data) {
                    setNfts(result.data);
                } else {
                    setNfts([]);
                }
            } catch (err: any) {
                setError("Failed to load NFTs");
                setNfts([]);
            } finally {
                setLoading(false);
            }
        };
        if (cardanoWalletAddress) {
            fetchNFTs();
        }
    }, [cardanoWalletAddress]);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-[#0a0f2c] via-[#1e2746] to-[#0a2e3b]">
            <BackgroundSection />
            <div className="relative z-10 max-w-6xl mx-auto py-16 px-4">
                <div className="flex items-center justify-between mb-8">
                    <button
                        onClick={() => window.location.href = "/"}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </button>
                    <h1 className="text-4xl md:text-5xl font-bold text-white text-center flex-1 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        My NFT Collection
                    </h1>
                    <div className="w-32" /> {/* Spacer for alignment */}
                </div>

                <div className="backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl shadow-2xl p-8">
                    {loading && (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full mb-4">
                                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                            <div className="text-xl text-blue-200">Discovering your NFTs...</div>
                            <div className="text-sm text-gray-400 mt-2">Please wait while we fetch your collection</div>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600/20 rounded-full mb-4">
                                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div className="text-xl text-red-300">{error}</div>
                            <div className="text-sm text-gray-400 mt-2">Please try refreshing the page</div>
                        </div>
                    )}

                    {!loading && !error && nfts.length === 0 && (
                        <div className="text-center py-16">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-full mb-6">
                                <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <div className="text-2xl font-semibold text-white mb-2">No NFTs Found</div>
                            <div className="text-gray-300 mb-6">Your collection is empty. Start collecting amazing NFTs!</div>
                        </div>
                    )}

                    {!loading && !error && nfts.length > 0 && (
                        <div>
                            <div className="mb-6 text-center">
                                <div className="text-lg text-gray-300">
                                    Found <span className="text-blue-400 font-semibold">{nfts.length}</span> NFT{nfts.length !== 1 ? 's' : ''} in your collection
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {nfts.map((nft, idx) => (
                                    <div
                                        key={nft.assetId || idx}
                                        className="group backdrop-blur-lg bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-blue-400/30 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-blue-500/10"
                                    >
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                                                {nft.name || nft.assetName || "Unnamed NFT"}
                                            </h3>
                                            <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                                        </div>

                                        {nft.image ? (
                                            <div className="relative mb-4">
                                                <img
                                                    src={nft.image}
                                                    alt={nft.name || "NFT"}
                                                    className="w-full h-64 object-contain rounded-lg bg-black/20 border border-white/10"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-64 flex items-center justify-center bg-black/20 border border-white/10 rounded-lg mb-4">
                                                <div className="text-center">
                                                    <svg className="w-12 h-12 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <div className="text-gray-400 text-sm">No Image Available</div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-3 text-sm">
                                            {nft.description && (
                                                <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                                                    <div className="text-blue-300 font-medium mb-1">Description</div>
                                                    <div className="text-gray-300 leading-relaxed">{nft.description}</div>
                                                </div>
                                            )}

                                            <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                                                <div className="text-blue-300 font-medium mb-1">Asset ID</div>
                                                <div className="text-gray-300 font-mono text-xs break-all">
                                                    {nft.assetId || nft.id || "N/A"}
                                                </div>
                                            </div>

                                            {nft.policyId && (
                                                <div className="p-3 bg-black/20 rounded-lg border border-white/5">
                                                    <div className="text-blue-300 font-medium mb-1">Policy ID</div>
                                                    <div className="text-gray-300 font-mono text-xs break-all">
                                                        {nft.policyId}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyNFTPage;
