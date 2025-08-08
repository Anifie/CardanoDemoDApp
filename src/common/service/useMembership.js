'use client';

import { createContext, FunctionComponent, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { memberSignInPost, memberProfilePut, memberMintNFTPost, memberNFTCheckQueue, getMemberNFTListing } from '../api/membership'
import { useWeb3Auth } from "./useWeb3Auth";

export const MembershipContext = createContext({
  isSignedIn: null,
  isFirstTimeSignIn: null,
  memberProfile: null,
  memberSignIn: async (walletAddress) => { },
  updateMemberProfile: async (obj) => { },
  mintMembershipNFT: async () => false,
  nftCheckQueue: async () => { return { code: 1, success: false, msg: "", data: [] } },
  getMyNFT: async () => { return { code: 1, success: false, msg: "", data: [] } },
});

export function useMembership() {
  return useContext(MembershipContext);
}

export const MembershipProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(null);
  const [isFirstTimeSignIn, setIsFirstTimeSignIn] = useState(null);
  const [memberProfile, setMemberProfile] = useState(null);

  const { appPubKey, cardanoWalletAddress } = useWeb3Auth();

  const memberSignIn = async (walletAddress) => {
    console.log("memberSignIn", walletAddress)

    let signInResult = await memberSignInPost({ appPubKey: appPubKey, walletAddress: walletAddress })
    console.log("signInResult", signInResult);
    if (signInResult.Success) {
      setIsSignedIn(true)
      setMemberProfile(signInResult.Data.profile)
      if (signInResult.Data.isFirstTimeSignIn) {
        setIsFirstTimeSignIn(true)
      }
      else {
        setIsFirstTimeSignIn(false)
      }
    }
    else {
      setIsSignedIn(false)
    }
  }

  const updateMemberProfile = async ({ displayName }) => {
    let updateResult = await memberProfilePut({ appPubKey: appPubKey, displayName: displayName })
    console.log("updateResult", updateResult);
    if (updateResult.Success) {

      setMemberProfile(updateResult.Data.profile)
    }
    else {
      throw new Error('Failed to update profile')
    }
  }
  const mintMembershipNFT = async () => {
    let mintResult = await memberMintNFTPost({ appPubKey: appPubKey, nftType: "MEMBER_B", queueType: "MINT_QUEUE" })
    console.log("mintResult", mintResult);
    if (mintResult.Success) {
      return true
    }
    else {
      return false
    }
  }
  const nftCheckQueue = async () => {
    const result = { code: 1, success: false, msg: "", data: [] };
    try {
      const resp = await memberNFTCheckQueue({ appPubKey: appPubKey })
      if (resp.Success) {
        result.success = resp.Success;
        result.msg = resp.Message;
        const queueResult = resp.Data?.queues;
        result.data = queueResult.filter((x) => x.nftType == 'MEMBER_B')
      }
    } catch (err) {
      console.error("Cannot check queue", err);
    }
    return result;
  };
  const getMyNFT = async () => {
    try {
      const result = await getMemberNFTListing({
        pageSize: 100,
        sortBy: "NEWLY_CREATED",
        status: "NOTFORSALE",
        walletAddress: cardanoWalletAddress,
      })
      if (result.success) {
        return result.data;
      }
      else {
        return { code: 1, success: false, msg: result.msg, data: [] };
      }
    } catch (err) {
      console.error("Cannot get my NFT", err);
      return { code: 1, success: false, msg: "Cannot get my NFT", data: [] };
    }
  }
  const contextProvider = {
    isSignedIn,
    isFirstTimeSignIn,
    memberProfile,
    memberSignIn,
    updateMemberProfile,
    mintMembershipNFT,
    nftCheckQueue,
    getMyNFT,
  };

  return <MembershipContext.Provider value={contextProvider}>
    {children}
  </MembershipContext.Provider>;
};