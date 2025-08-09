"use client";

import Link from "next/link";

import React, { Component, useEffect } from "react";
import { toast } from "react-toastify";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";

import { getMobileOS } from "../helpers/mobile";
import { Spinner } from "./Loading";
import { useWeb3Auth } from "../common/service/useWeb3Auth";
import { useMembership } from "../common/service/useMembership";

const STEPS = {
  CREATING_WALLET: 2,
  REQUESTING_NFT: 3,
  NFT_REQUESTED: 4,
  NFT_PROCESSING: 5,
  NFT_CLAIMED: 6,
  NFT_NOT_AVAILABLE: 7,
  NONE: -1,
};
const StepShow = ({ step }) => (
  <div className="flex items-center justify-between mb-6 w-full">
    <div
      className={`w-[32%] h-1 ${step >= 1 ? "bg-[#1976D2]" : "bg-[#FBE5E8]"
        } rounded-lg`}
    ></div>
    <div
      className={`w-[32%] h-1 ${step >= 2 ? "bg-[#1976D2]" : "bg-[#FBE5E8]"
        } rounded-lg`}
    ></div>
    <div
      className={`w-[32%] h-1 ${step >= 3 ? "bg-[#1976D2]" : "bg-[#FBE5E8]"
        } rounded-lg`}
    ></div>
  </div>
);

export const BackgroundSection = () => {
  return (
    <div className="absolute inset-0 opacity-60 pointer-events-none">
      <div className="w-full h-full">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1440 800"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Cardano blue gradients */}
            <radialGradient id="adaRadial1" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#0EA5E9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.1" />
            </radialGradient>
            <radialGradient id="adaRadial2" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#1E40AF" stopOpacity="0.1" />
            </radialGradient>
            <linearGradient id="cryptoWave" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.3" />
            </linearGradient>
            <filter id="glow2" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Animated Cardano token (ADA) logo at center */}
          <g filter="url(#glow2)" opacity="0.7">
            <g transform="translate(720,320)">
              <circle r="70" fill="url(#adaRadial1)" />
              {/* Cardano logo dots */}
              {[...Array(6)].map((_, i) => (
                <circle
                  key={i}
                  r="8"
                  cx={Math.cos((i * Math.PI * 2) / 6) * 40}
                  cy={Math.sin((i * Math.PI * 2) / 6) * 40}
                  fill="#fff"
                  fillOpacity="0.8"
                >
                  <animate
                    attributeName="r"
                    values="8;12;8"
                    dur="3s"
                    begin={`${i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
              {[...Array(6)].map((_, i) => (
                <circle
                  key={i + 6}
                  r="4"
                  cx={Math.cos((i * Math.PI * 2) / 6) * 55}
                  cy={Math.sin((i * Math.PI * 2) / 6) * 55}
                  fill="#3B82F6"
                  fillOpacity="0.7"
                >
                  <animate
                    attributeName="r"
                    values="4;7;4"
                    dur="2.5s"
                    begin={`${i * 0.2 + 0.5}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
              <circle r="3" fill="#fff" />
            </g>
          </g>

          {/* Crypto circuit lines */}
          <g stroke="#06B6D4" strokeWidth="2" strokeOpacity="0.3" filter="url(#glow2)">
            <polyline
              points="720,320 900,100 1200,200"
              fill="none"
              strokeDasharray="10,8"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;36"
                dur="3s"
                repeatCount="indefinite"
              />
            </polyline>
            <polyline
              points="720,320 540,120 200,200"
              fill="none"
              strokeDasharray="12,10"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;44"
                dur="4s"
                repeatCount="indefinite"
              />
            </polyline>
            <polyline
              points="720,320 900,600 1300,700"
              fill="none"
              strokeDasharray="8,6"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;28"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </polyline>
            <polyline
              points="720,320 540,600 200,700"
              fill="none"
              strokeDasharray="8,6"
            >
              <animate
                attributeName="stroke-dashoffset"
                values="0;28"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </polyline>
          </g>

          {/* Animated crypto coins */}
          <g>
            {/* Cardano coin */}
            <g>
              <circle
                cx="200"
                cy="200"
                r="38"
                fill="url(#adaRadial2)"
                filter="url(#glow2)"
                opacity="0.7"
              >
                <animate
                  attributeName="cy"
                  values="200;180;200"
                  dur="5s"
                  repeatCount="indefinite"
                />
              </circle>
              <text
                x="200"
                y="205"
                textAnchor="middle"
                fontSize="22"
                fontWeight="bold"
                fill="#fff"
                opacity="0.8"
                style={{ fontFamily: 'monospace' }}
              >
                ₳
              </text>
            </g>
            {/* Bitcoin coin */}
            <g>
              <circle
                cx="1240"
                cy="180"
                r="28"
                fill="url(#cryptoWave)"
                filter="url(#glow2)"
                opacity="0.5"
              >
                <animate
                  attributeName="cy"
                  values="180;210;180"
                  dur="6s"
                  repeatCount="indefinite"
                />
              </circle>
              <text
                x="1240"
                y="188"
                textAnchor="middle"
                fontSize="18"
                fontWeight="bold"
                fill="#fbbf24"
                opacity="0.8"
                style={{ fontFamily: 'monospace' }}
              >
                ₿
              </text>
            </g>
            {/* Ethereum coin */}
            <g>
              <circle
                cx="300"
                cy="650"
                r="24"
                fill="url(#cryptoWave)"
                filter="url(#glow2)"
                opacity="0.5"
              >
                <animate
                  attributeName="cy"
                  values="650;630;650"
                  dur="4.5s"
                  repeatCount="indefinite"
                />
              </circle>
              <text
                x="300"
                y="657"
                textAnchor="middle"
                fontSize="16"
                fontWeight="bold"
                fill="#a3e635"
                opacity="0.8"
                style={{ fontFamily: 'monospace' }}
              >
                Ξ
              </text>
            </g>
          </g>

          {/* Blockchain wave layers */}
          <g>
            <path
              d="M0,600 Q360,500 720,600 T1440,600 L1440,800 L0,800 Z"
              fill="url(#cryptoWave)"
              opacity="0.18"
            >
              <animate
                attributeName="d"
                values="
                      M0,600 Q360,500 720,600 T1440,600 L1440,800 L0,800 Z;
                      M0,620 Q360,540 720,620 T1440,620 L1440,800 L0,800 Z;
                      M0,600 Q360,500 720,600 T1440,600 L1440,800 L0,800 Z"
                dur="10s"
                repeatCount="indefinite"
              />
            </path>
            <path
              d="M0,700 Q480,650 960,700 T1440,700 L1440,800 L0,800 Z"
              fill="url(#adaRadial2)"
              opacity="0.12"
            >
              <animate
                attributeName="d"
                values="
                      M0,700 Q480,650 960,700 T1440,700 L1440,800 L0,800 Z;
                      M0,720 Q480,670 960,720 T1440,720 L1440,800 L0,800 Z;
                      M0,700 Q480,650 960,700 T1440,700 L1440,800 L0,800 Z"
                dur="12s"
                repeatCount="indefinite"
              />
            </path>
          </g>

          {/* Floating Cardano hexagons */}
          <g>
            <g opacity="0.5" filter="url(#glow2)">
              <polygon
                points="25,0 50,14.4 50,43.3 25,57.7 0,43.3 0,14.4"
                fill="#06B6D4"
                fillOpacity="0.7"
                transform="translate(400,120)"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="400,120;400,100;400,120"
                  dur="8s"
                  repeatCount="indefinite"
                />
              </polygon>
              <polygon
                points="30,0 60,17.3 60,51.9 30,69.3 0,51.9 0,17.3"
                fill="#3B82F6"
                fillOpacity="0.8"
                transform="translate(1100,200)"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="1100,200;1100,220;1100,200"
                  dur="10s"
                  repeatCount="indefinite"
                />
              </polygon>
              <polygon
                points="20,0 40,11.5 40,34.6 20,46.2 0,34.6 0,11.5"
                fill="#0EA5E9"
                fillOpacity="0.6"
                transform="translate(200,500)"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="200,500;200,520;200,500"
                  dur="12s"
                  repeatCount="indefinite"
                />
              </polygon>
              <polygon
                points="35,0 70,20.2 70,60.6 35,80.8 0,60.6 0,20.2"
                fill="#1E40AF"
                fillOpacity="0.7"
                transform="translate(1300,600)"
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values="1300,600;1300,580;1300,600"
                  dur="9s"
                  repeatCount="indefinite"
                />
              </polygon>
            </g>
          </g>
        </svg>
      </div>
    </div>
  )
}
const DISCORD_URL = "https://discord.gg/5H48ECt6DG";
export const OnboardingSection = () => {

  const [isAuthLoading, setIsAuthLoading] = React.useState(true);
  const [isConfigLoading, setIsConfigLoading] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isEditLoading, setIsEditLoading] = React.useState("");
  const [isAdmin, setIsAdmin] = React.useState(false);

  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isEditBenefitDialogOpen, setIsEditBenefitDialogOpen] = React.useState(false);
  const [isAcceptTOS, setIsAcceptTOS] = React.useState(false);
  const [mintReady, setMintReady] = React.useState(false);
  const [mintStatus, setMintStatus] = React.useState("");
  const [step, setStep] = React.useState(STEPS.NONE);
  const [qrId, setQrId] = React.useState("");
  const [os, setOS] = React.useState("");
  const { isLoggedIn, login, logout, getUserInfo, getAccounts, idToken, appPubKey, cardanoWalletAddress } = useWeb3Auth();
  const { isSignedIn, isFirstTimeSignIn, memberProfile, memberSignIn, mintMembershipNFT, nftCheckQueue } = useMembership();
  useEffect(() => {
    if (isLoggedIn) {
      if (!idToken || !appPubKey) {
        getUserInfo()
        getAccounts()
      }

    }
  }, [isLoggedIn])

  const startMinting = async () => {
    let mintResult = await mintMembershipNFT()
    if (mintResult) {
      setStep(STEPS.NFT_PROCESSING);
      // const checkQueue = async () => {
      //   while (true) {
      //     try {
      //       const queueResult = await nftCheckQueue();
      //       if (queueResult.success && queueResult.data && queueResult.data.length > 0) {
      //         const memberQueue = queueResult.data;
      //         if (memberQueue && memberQueue.status === 'SUCCESS') {
      //           setStep(STEPS.NFT_CLAIMED);
      //           break;
      //         }
      //       }
      //       // Wait 2 seconds before checking again
      //       await new Promise(resolve => setTimeout(resolve, 2000));
      //     } catch (error) {
      //       console.error('Error checking queue:', error);
      //       // Wait 2 seconds before retrying
      //       await new Promise(resolve => setTimeout(resolve, 2000));
      //     }
      //   }
      // };
      // checkQueue();

    } else {
      setStep(STEPS.NFT_NOT_AVAILABLE);
    }
  };
  const onClick = async () => {
    if (!isLoggedIn) {
      login()
    } else {
      setStep(STEPS.CREATING_WALLET);
      if (!isSignedIn) {
        memberSignIn(cardanoWalletAddress)
      } else {
        setStep(STEPS.REQUESTING_NFT);
        startMinting();
      }
    }
  };

  React.useEffect(() => {
    setOS(getMobileOS());
  }, []);
  React.useEffect(() => {
    if (isSignedIn) {
      setStep(STEPS.REQUESTING_NFT);
      startMinting();
    }
  }, [isSignedIn])

  return (
    <>
      {/* Hero Section */}
      <div className="relative min-h-[700px] pb-4 bg-gradient-to-br from-[#0a0f2c] via-[#1e2746] to-[#0a2e3b]">
        <BackgroundSection />

        <div className="relative flex flex-col items-center px-4 pt-16">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6 text-center">
            Cardano NFT Special Offer
          </h1>
          <p className="text-lg md:text-xl font-bold text-center text-white max-w-2xl px-4 mb-4">
            Join Our Community now to get exclusive and unique NFTs on Cardano Blockchain!
          </p>



          <div className="flex flex-row items-start md:items-center gap-2 mb-4 text-white px-4 max-w-lg">
            <input
              type="checkbox"
              id="terms"
              className="w-5 h-5 md:w-6 md:h-6 rounded border-gray-300 shrink-0 mt-0.5 md:mt-0"
              checked={isAcceptTOS}
              onChange={(e) => setIsAcceptTOS(e.target.checked)}
            />

            <label htmlFor="terms" className="text-xs md:text-sm leading-relaxed">
              By clicking the button below, you agree to our <Link href="/terms" target="_blank" className="text-blue-500">Terms of Service</Link> and <Link href="/privacy" target="_blank" className="text-blue-500">Privacy Policy</Link>

            </label>

          </div>
          <button
            onClick={onClick}
            disabled={!isAcceptTOS}
            className={`text-white text-lg md:text-xl font-bold px-8 md:px-12 py-3 md:py-4 rounded-lg transition-colors w-full max-w-xs ${isAcceptTOS
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-blue-300 cursor-not-allowed"
              }`}
          >
            {isLoading ? (
              <Spinner size="16" color="#fff" />
            ) : (
              "Join now"
            )}
          </button>

        </div>
      </div >
      <AlertDialog open={step == STEPS.CREATING_WALLET}>
        <AlertDialogContent
          className={`p-4 md:p-6 max-w-[90vw] md:max-w-[350px] lg:max-w-[800px] rounded mx-2`}
        >
          <AlertDialogHeader>
            <StepShow step={1} />

            <AlertDialogTitle className="text-center mb-4 md:mb-6">
              <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#E3F2FD] rounded-full flex items-center justify-center mx-auto">
                  <svg
                    width="33"
                    height="32"
                    viewBox="0 0 41 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="md:w-[41px] md:h-[40px]"
                  >
                    <g clipPath="url(#clip0_2737_8464)">
                      <path
                        d="M16.8282 6.07383C16.8282 3.91992 18.5805 2.16758 20.7344 2.16758H22.0863L21.6785 1.03398C21.4492 0.396484 20.8484 0 20.2081 0C20.0307 0 19.8502 0.0304687 19.6738 0.0946875L6.0134 5.06664C5.2013 5.36227 4.78333 6.26094 5.08067 7.07242L5.80247 9.04258H16.8282V6.07383Z"
                        fill="#1976D2"
                      />
                      <path
                        d="M20.7344 4.51135C19.8714 4.51135 19.1719 5.21088 19.1719 6.07385V9.0426H32.8438V6.07385C32.8438 5.21088 32.1442 4.51135 31.2812 4.51135H20.7344Z"
                        fill="#1976D2"
                      />
                      <path
                        d="M36.9844 31.5817H31.5156C28.2848 31.5817 25.6562 28.9531 25.6562 25.7223C25.6562 22.4914 28.2848 19.8629 31.5156 19.8629H36.9844V14.5114C36.9844 12.7855 35.5852 11.3864 33.8594 11.3864H3.625C1.89914 11.3864 0.5 12.7855 0.5 14.5114V36.875C0.5 38.6009 1.89914 40 3.625 40H33.8594C35.5852 40 36.9844 38.6009 36.9844 36.875V31.5817Z"
                        fill="#1976D2"
                      />
                      <path
                        d="M39.3281 22.2067H31.5156C29.5771 22.2067 28 23.7838 28 25.7223C28 27.6608 29.5771 29.2379 31.5156 29.2379H39.3281C39.9743 29.2379 40.5 28.7122 40.5 28.066V23.3785C40.5 22.7324 39.9743 22.2067 39.3281 22.2067ZM31.5156 26.8942C30.8684 26.8942 30.3438 26.3695 30.3438 25.7223C30.3438 25.0751 30.8684 24.5504 31.5156 24.5504C32.1628 24.5504 32.6875 25.0751 32.6875 25.7223C32.6875 26.3695 32.1628 26.8942 31.5156 26.8942Z"
                        fill="#1976D2"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_2737_8464">
                        <rect
                          width="40"
                          height="40"
                          fill="white"
                          transform="translate(0.5)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                {/* Animated loading circle */}
                <div className="absolute top-0 left-[8px] md:left-[10px] w-full h-full">
                  <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-[#1976D2] rounded-full border-t-transparent animate-spin"></div>
                </div>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-black">
                Creating wallet
                <br />
              </h2>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600 pb-6 md:pb-8 text-xs md:text-[13px]">
              Creating Digital Wallet for you...

            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={step == STEPS.REQUESTING_NFT}>
        <AlertDialogContent className={`p-4 md:p-6 max-w-[90vw] md:max-w-[350px] lg:max-w-[800px] mx-2`}>
          <AlertDialogHeader>
            <StepShow step={2} />

            <AlertDialogTitle className="text-center mb-4 md:mb-6">
              <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#E3F2FD] rounded-full flex items-center justify-center mx-auto">
                  <svg
                    width="33"
                    height="33"
                    viewBox="0 0 41 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="md:w-[41px] md:h-[41px]"
                  >
                    <path
                      d="M26.3335 15.5C23.3418 15.5 21.8751 14.0333 21.0918 13.2417C20.7668 12.9167 20.2418 12.9167 19.9168 13.2417C19.1251 14.0333 17.6585 15.5 14.6751 15.5C14.2168 15.5 13.8418 15.875 13.8418 16.3333C13.8418 23.175 14.7918 26.075 20.1335 28.7417C20.2501 28.8 20.3751 28.8333 20.5085 28.8333C20.6418 28.8333 20.7668 28.8 20.8835 28.7417C26.2251 26.0667 27.1751 23.1667 27.1751 16.3333C27.1751 15.875 26.8001 15.5 26.3418 15.5H26.3335ZM22.9085 19.2083L21.2418 22.5417C21.1251 22.7833 20.8918 22.95 20.6335 22.9917C20.5918 22.9917 20.5418 23 20.5001 23C20.2835 23 20.0668 22.9167 19.9085 22.7583L18.2418 21.0917C17.9168 20.7667 17.9168 20.2417 18.2418 19.9167C18.5668 19.5917 19.0918 19.5917 19.4168 19.9167L20.2668 20.7667L21.4168 18.4667C21.6251 18.0583 22.1251 17.8917 22.5335 18.0917C22.9418 18.3 23.1085 18.8 22.9085 19.2083Z"
                      fill="#1976D2"
                    />
                    <path
                      d="M24.2085 32.2583L20.8751 30.5917C20.6418 30.475 20.3668 30.475 20.1335 30.5917L16.8001 32.2583C16.5168 32.4 16.3418 32.6916 16.3418 33V35.8167C16.3418 36.45 16.6918 37.025 17.2668 37.3083L20.1418 38.7416C20.2585 38.8 20.3835 38.8333 20.5168 38.8333C20.6501 38.8333 20.7751 38.8 20.8918 38.7416L23.7668 37.3083C24.3335 37.025 24.6918 36.45 24.6918 35.8167V33C24.6918 32.6833 24.5168 32.3917 24.2335 32.2583H24.2085Z"
                      fill="#1976D2"
                    />
                    <path
                      d="M38.375 18.0917L35.0416 16.425C34.8083 16.3084 34.5333 16.3084 34.3 16.425L30.9666 18.0917C30.6833 18.2334 30.5083 18.525 30.5083 18.8334V21.65C30.5083 22.2834 30.8583 22.8584 31.4333 23.1417L34.3083 24.575C34.425 24.6334 34.55 24.6667 34.6833 24.6667C34.8166 24.6667 34.9416 24.6334 35.0583 24.575L37.9333 23.1417C38.5 22.8584 38.8583 22.2834 38.8583 21.65V18.8334C38.8583 18.5167 38.6833 18.225 38.4 18.0917H38.375Z"
                      fill="#1976D2"
                    />
                    <path
                      d="M9.5748 23.1417C10.1415 22.8584 10.4998 22.2834 10.4998 21.65V18.8334C10.4998 18.5167 10.3248 18.225 10.0415 18.0917L6.70814 16.425C6.4748 16.3084 6.1998 16.3084 5.96647 16.425L2.63314 18.0917C2.3498 18.2334 2.1748 18.525 2.1748 18.8334V21.65C2.1748 22.2834 2.5248 22.8584 3.0998 23.1417L5.9748 24.575C6.09147 24.6334 6.21647 24.6667 6.3498 24.6667C6.48314 24.6667 6.60814 24.6334 6.7248 24.575L9.5998 23.1417H9.5748Z"
                      fill="#1976D2"
                    />
                    <path
                      d="M32.7831 15.3167L33.5498 14.9333C33.7914 14.8083 34.0664 14.7417 34.3331 14.7083C32.8164 11.1 29.9331 8.20835 26.3331 6.68335V7.48335C26.3331 7.81668 26.2831 8.15002 26.1831 8.45835C29.1331 9.85835 31.4998 12.3 32.7831 15.3167Z"
                      fill="#1976D2"
                    />
                    <path
                      d="M8.2165 15.3167C9.4915 12.3 11.8582 9.85835 14.8165 8.45835C14.7248 8.15002 14.6665 7.82502 14.6665 7.48335V6.68335C11.0665 8.20835 8.18317 11.1 6.6665 14.7083C6.9415 14.7417 7.20817 14.8083 7.44984 14.9333L8.2165 15.3167Z"
                      fill="#1976D2"
                    />
                    <path
                      d="M8.2165 25.6833L7.44984 26.0667C7.20817 26.1917 6.93317 26.2584 6.6665 26.2917C8.18317 29.9 11.0665 32.7917 14.6665 34.3167V33C14.6665 32.825 14.6915 32.6584 14.7248 32.5C11.8165 31.0917 9.48317 28.675 8.2165 25.6917V25.6833Z"
                      fill="#1976D2"
                    />
                    <path
                      d="M32.7832 25.6833C31.5166 28.6667 29.1832 31.0917 26.2749 32.4917C26.3082 32.6583 26.3332 32.825 26.3332 32.9917V34.3083C29.9332 32.7833 32.8166 29.8917 34.3332 26.2833C34.0582 26.25 33.7916 26.1833 33.5499 26.0583L32.7832 25.675V25.6833Z"
                      fill="#1976D2"
                    />
                  </svg>
                </div>
                <div className="absolute top-0 left-[8px] md:left-[10px] w-full h-full">
                  <div className="w-16 h-16 md:w-20 md:h-20 border-2 border-[#1976D2] rounded-full border-t-transparent animate-spin"></div>
                </div>
              </div>
              <h2 className="text-lg md:text-xl font-bold text-black">
                Requesting NFT
              </h2>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600 pb-6 md:pb-8 text-sm md:text-base">
              Requesting server to start minting NFT...
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={step == STEPS.NFT_REQUESTED}>
        <AlertDialogContent className={`p-4 md:p-6 max-w-[90vw] md:max-w-[350px] lg:max-w-[800px] mx-2`}>
          <AlertDialogHeader>
            <StepShow step={3} />

            <AlertDialogTitle className="text-center mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-black">
                NFT requested
              </h2>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600 pb-6 md:pb-8 text-sm md:text-base">
              NFT minting has been requested.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={step == STEPS.NFT_NOT_AVAILABLE}>
        <AlertDialogContent className={`p-4 md:p-6 max-w-[90vw] md:max-w-[350px] lg:max-w-[800px] mx-2`}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-black">
                NFT not available
              </h2>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="text-center text-gray-600 pb-6 md:pb-8 text-sm md:text-base">
            NFT not available or error occurred. Please try again later.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button
              onClick={() => {
                setStep(STEPS.NONE);
                setMintStatus("");
              }}
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Close
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={step == STEPS.NFT_CLAIMED}>
        <AlertDialogContent className={`p-4 md:p-6 max-w-[90vw] md:max-w-[350px] lg:max-w-[800px] mx-2`}>
          <AlertDialogHeader>
            <StepShow step={3} />
            <AlertDialogTitle className="text-center mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-black">
                NFT claimed
              </h2>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-gray-600 pb-6 md:pb-8">
              <Link
                href={
                  "https://discord.gg/5H48ECt6DG"
                }
                className="inline-block bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md mb-4 text-sm md:text-base"
              >
                Community
              </Link>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={step == STEPS.NFT_PROCESSING}>
        <AlertDialogContent
          className={`p-4 md:p-6 max-w-[90vw] md:max-w-[350px] rounded-lg lg:max-w-[800px] mx-2`}
        >
          <AlertDialogHeader>
            <StepShow step={3} />
            <AlertDialogTitle className="text-center mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-bold text-black">
                Congratulations! Your NFT is on the way!
              </h2>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              <div className="relative pl-3 mb-4">
                <div className="relative">
                  <div className="relative">
                    <p className="text-center mb-4 text-sm md:text-lg">
                      Membership NFT will take some time to be minted. Meanwhile, you can join our community to get more information about the project and receive exclusive offers.
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <img src="/discord-logo.png" className="max-w-[150px] md:max-w-none"></img>
                </div>
              </div>
              <div className="flex flex-col gap-4 text-lg md:text-xl">
                <Link
                  href={DISCORD_URL}
                  target="_blank"
                  className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-center"
                >
                  Join Community
                </Link>


                <Link
                  href="/my-nft"
                  target="_blank"
                  className="w-full py-3 px-6 text-[#1a1a1a] font-medium hover:text-blue-600 transition-colors text-center"
                >
                  Check My NFT
                </Link>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
};

