"use client";
import React, { useContext, useRef, useState } from "react";
import { errLog } from "@app/helpers/logger";
import { Spinner } from "@app/components/Loading";
import { getQueryParams } from "@app/helpers/route";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useWeb3Auth } from "@app/common/service/useWeb3Auth";
import { useMembership } from "@app/common/service/useMembership";

export default function DiscordGrant() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<
    "auth" | "discord-link" | "" | "error" | "success"
  >("auth");
  const { isLoggedIn, login, logout, getUserInfo, getAccounts, idToken, appPubKey, cardanoWalletAddress } = useWeb3Auth();
  const { isSignedIn, isFirstTimeSignIn, memberProfile, memberSignIn, mintMembershipNFT, nftCheckQueue, discordLinkWallet } = useMembership();
  const [discordId, setDiscordId] = useState("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  React.useEffect(() => {
    const cachedGuid = localStorage.getItem("discord-guid");
    const queryParams = getQueryParams(location.search);
    const guid = queryParams.guid || cachedGuid;
    if (guid && typeof guid == "string") {
      setDiscordId(guid);
      localStorage.setItem("discord-guid", guid);
    } else {
      router.push("/");
    }
  }, []);

  React.useEffect(() => {
    if (!isLoggedIn) {
      timeoutRef.current = setTimeout(() => {
        if (!isLoggedIn) {
          setIsLoading("");
        }
      }, 10000);
    } else {
      getUserInfo()
      getAccounts()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [isLoggedIn]);
  React.useEffect(() => {
    if (!isSignedIn && appPubKey && idToken) {
      memberSignIn(cardanoWalletAddress);
    }
  }, [isSignedIn, appPubKey, idToken, cardanoWalletAddress]);

  React.useEffect(() => {
    if (isSignedIn && discordId) {
      setIsLoading("discord-link");
      discordLinkWallet(discordId).then((result) => {
        if (result.code == 0) {
          setIsLoading("success");
        } else {
          setIsLoading("error");
        }
      });
    }
  }, [isSignedIn, discordId]);

  return (
    <main className="w-screen h-screen bg-[#13042b]">

      {isLoggedIn && discordId ? (
        <div className="w-full h-full relative flex justify-center items-start pt-48">
          <div className="w-full max-w-[800px] px-8 py-8 border border-white rounded bg-[#0a080857]">
            <p className="text-center mb-4 font-bold text-xl text-white">
              {isLoading != "error" && isLoading != "success" && "Please wait a moment..."}
              {isLoading == "error" && "An error occurred. Please try again."}
              {isLoading == "success" && "Successfully linked."}
            </p>

            {isLoading == "discord-link" && (
              (
                <div className="w-full text-center text-white text-lg">
                  <h2 className="mb-2">Linking Discord...</h2>
                  <Spinner size="28" color="#fff" />
                </div>
              )
            )}
            {isLoading == "error" && (
              <div className="w-full text-center text-white text-lg">
                <h2 className="mb-2">
                  An error occurred. Please try again.
                </h2>
              </div>
            )}
            {isLoading == "success" && (
              <div className="w-full text-center text-white text-lg">
                <h2 className="mb-2">
                  Your Discord account has been linked with your wallet. You can now close this page.
                </h2>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-[10px]">
          {isLoading === "auth" ? (
            <div className="w-full text-center">
              <h2 className="mb-2">認証中...</h2>
              <Spinner size="28" color="#fff" />
            </div>
          ) : isLoading !== "error" ? (
            <>
              <p className="text-white my-2 mb-4 text-center max-w-[311px] lg:max-w-[800px]">
                Please sign in to continue.
              </p>
              <div className="mb-4">
                <button
                  className="relative w-full py-4 px-8 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-2xl hover:shadow-purple-500/25 hover:scale-105 transform transition-all duration-300 ease-out border border-purple-400/30 backdrop-blur-sm overflow-hidden group"
                  onClick={() => {
                    login();
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-blue-600/20 to-indigo-600/20 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Sign in
                  </span>
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-white my-2 mb-4 text-center max-w-[311px] lg:max-w-[800px]">
                An error occurred. Please try again.
              </p>
            </>
          )}
        </div>
      )}
    </main>
  );
}
