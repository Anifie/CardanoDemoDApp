'use client';

import { createContext, FunctionComponent, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { memberSignInPost, memberProfilePut } from '../api/membership'
import { useWeb3Auth } from "./useWeb3Auth";

export const MembershipContext = createContext({
  isSignedIn: null,
  isFirstTimeSignIn: null,
  memberProfile: null,
  memberSignIn: async () => {},
  updateMemberProfile: async (obj) => {}
});

export function useMembership() {
  return useContext(MembershipContext);
}

export const MembershipProvider = ({ children }) => {
  const [isSignedIn, setIsSignedIn] = useState(null);
  const [isFirstTimeSignIn, setIsFirstTimeSignIn] = useState(null);
  const [memberProfile, setMemberProfile] = useState(null);

  const { appPubKey, walletAddress } = useWeb3Auth();

  const memberSignIn = async (walletAddress) => {
    console.log("memberSignIn", walletAddress)

    let signInResult = await memberSignInPost({appPubKey: appPubKey, walletAddress: walletAddress, stickerId: "4AC30E"})
    console.log("signInResult", signInResult);
    if(signInResult.Success) {
      setIsSignedIn(true)
      setMemberProfile(signInResult.Data.profile)
      if(signInResult.Data.isFirstTimeSignIn) {
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

  const updateMemberProfile = async({displayName}) => {
    let updateResult = await memberProfilePut({appPubKey: appPubKey, displayName: displayName})
    console.log("updateResult", updateResult);
    if(updateResult.Success) {
      
      setMemberProfile(updateResult.Data.profile)
    }
    else {
      throw new Error('Failed to update profile')
    }
  }

  const contextProvider = {
    isSignedIn,
    isFirstTimeSignIn,
    memberProfile,
    memberSignIn,
    updateMemberProfile,
  };

  return <MembershipContext.Provider value={contextProvider}>
            {children}
        </MembershipContext.Provider>;
};