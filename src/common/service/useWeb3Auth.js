'use client';
import { createContext, FunctionComponent, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter";
import { AuthAdapter } from "@web3auth/auth-adapter";
// import { CHAIN_CONFIG, CHAIN_CONFIG_TYPE } from "../config/chainConfig";
// import { WEB3AUTH_NETWORK_TYPE } from "../config/web3AuthNetwork";
// import { getWalletProvider, IWalletProvider } from "./walletProvider";

import { safeatob } from "@toruslabs/openlogin-utils";
import RPC from "./ethersRPC";
import { ethers } from "ethers";

import { mnemonicToEntropy, entropyToMnemonic, mnemonicToSeedSync } from "bip39";
// import { Bip32PrivateKey, BaseAddress, NetworkInfo, StakeCredential } from "@emurgo/cardano-serialization-lib-browser";

import {
  BlockfrostProvider,
  MeshTxBuilder,
  MeshWallet,
  serializePlutusScript,
  resolvePlutusScriptHash,
  resolvePlutusScriptAddress,
  resolvePaymentKeyHash,
  // toHex,
  UTxO
} from '@meshsdk/core';

// import {
//   // applyDoubleCborEncoding,
//   // applyParamsToScript,
//   // Constr,
//   // fromText,
//   // validatorToAddress,
//   // validatorToScriptHash,
//   // type MintingPolicy,
//   // type OutRef,
//   // type SpendingValidator,
// } from "@lucid-evolution/lucid";

import { applyParamsToScript } from "@meshsdk/core-cst";

import blueprint from '../blueprint/plutus.json';

const BLOCKFROST_PROJECT_ID = process.env.BLOCKFROST_PROJECT_ID;
console.log("BLOCKFROST_PROJECT_ID", BLOCKFROST_PROJECT_ID);

if (!BLOCKFROST_PROJECT_ID)
  throw new Error("Missing BLOCKFROST_PROJECT_ID in .env file")

const blockchainProvider = new BlockfrostProvider(BLOCKFROST_PROJECT_ID);
console.log("blockchainProvider", blockchainProvider);

const clientId = process.env.WEB3AUTH_CLIENT_ID;

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x89",
  // Avoid using public rpcTarget & wsTarget in production.
  // Use services like Infura, Quicknode etc
  rpcTarget: process.env.RPC_URL,
  ticker: "MATIC",
  tickerName: "Polygon MATIC",
  displayName: "Polygon Mainnet",
  blockExplorerUrl: "https://polygonscan.com/",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
}

const web3auth = new Web3Auth(web3AuthOptions);

const adapter = new AuthAdapter({
  privateKeyProvider: privateKeyProvider,
  adapterSettings: {
    network: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,    //web3AuthNetwork,
    clientId,
    loginConfig: {
      mfaLevel: "optional"
      //   facebook: {
      //     name: "Custom Auth Login",
      //     verifier: "facebook", // Please create a verifier on the developer dashboard and pass the name here
      //     typeOfLogin: "facebook", // Pass on the login provider of the verifier you've created
      //     showOnModal: false,
      //   },
    },
  },
});

web3auth.configureAdapter(adapter);


// const privateKeyProvider = new EthereumPrivateKeyProvider({
//   config: { chainConfig },  // This is required, but we will override it for Cardano
// });

// const web3auth = new Web3Auth({
//   clientId: clientId,
//   chainConfig: {
//       chainNamespace: CHAIN_NAMESPACES.OTHER, // Not EVM
//       rpcTarget: "https://cardano-mainnet.blockfrost.io/api/v0", // Example: Blockfrost RPC
//       displayName: "Cardano",
//       ticker: "ADA",
//       tickerName: "Cardano",
//   },
//   privateKeyProvider: privateKeyProvider,
// });

// const openloginAdapter = new OpenloginAdapter();
// web3auth.configureAdapter(openloginAdapter);

export const Web3AuthContext = createContext({
  isLoggedIn: null,
  web3auth: null,
  provider: null,
  isLoading: false,
  user: null,
  chain: "",
  idToken: null,
  appPubKey: null,
  walletAddress: null,
  cardanoPublicKeyHash: null,
  cardanoWalletAddress: null,
  blockchainProvider: null,
  login: async () => { },
  logout: async () => { },
  getUserInfo: async () => { },
  signMessage: async () => { },
  getAccounts: async () => { },
  getBalance: async () => { },
  sendTransaction: async () => { },
  getCardanoBalance: async () => { },
  getGiftCardScript: async () => { },
  getTxBuilder: async () => { },
  getUtxoByTxHash: async () => { },
  applyParams: async () => { },
  readValidators: async () => { },
  waitForTx: async () => { },
  // signAndSendTransaction: async () => {},
});

export function useWeb3Auth() {
  return useContext(Web3AuthContext);
}

// interface IWeb3AuthState {
//   web3AuthNetwork: WEB3AUTH_NETWORK_TYPE;
//   chain: CHAIN_CONFIG_TYPE;
//   children?: React.ReactNode;
// }
// interface IWeb3AuthProps {
//   children?: ReactNode;
//   web3AuthNetwork: WEB3AUTH_NETWORK_TYPE;
//   chain: CHAIN_CONFIG_TYPE;
// }

export const Web3AuthProvider = ({ children, web3AuthNetwork, chain }) => {
  //const [web3Auth, setWeb3Auth] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [idToken, setIdToken] = useState(null);
  const [appPubKey, setAppPubKey] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);
  const [cardanoWallet, setCardanoWallet] = useState(null);
  const [cardanoWalletAddress, setCardanoWalletAddress] = useState(null);
  const [cardanoWalletBalance, setCardanoWalletBalance] = useState(0);
  const [cardanoPublicKeyHash, setCardanoPublicKeyHash] = useState()

  useEffect(() => {
    const init = async () => {
      try {
        await web3auth.initModal();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (appPubKey) {
      getAccounts();
    }
  }, [appPubKey])

  const login = async () => {
    console.log("login")
    const web3authProvider = await web3auth.connect();
    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);
    }

    await getUserInfo();
    //await getAccounts();  // call in useEffect for provider above
  };

  const logout = async () => {
    console.log("logout")
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      uiConsole("web3auth not initialized yet");
      return;
    }
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
    setIdToken(null);
    setAppPubKey(null);
    setWalletAddress(null);
    localStorage.removeItem("backend_access_token")
    localStorage.removeItem("backend_app_pub_key")
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      uiConsole("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    console.log("getUserInfo", user);
    // parse the idToken from the user object
    let token = user?.idToken.split(".")[1];
    console.log("JSON.parse(safeatob(token)).wallets[0]", JSON.parse(safeatob(token)).wallets[0])
    let _appPubKey = JSON.parse(safeatob(token)).wallets[0].public_key;
    console.log("idToken", user?.idToken);
    console.log("appPubKey", _appPubKey);
    setIdToken(user?.idToken)
    setAppPubKey(_appPubKey)
    localStorage.setItem("backend_access_token", user?.idToken)
    localStorage.setItem("backend_app_pub_key", _appPubKey)
    uiConsole(user);
  };

  const getAccounts = async () => {
    console.log("getAccounts")
    if (!provider) {
      console.log("provider not initialized yet");
      uiConsole("provider not initialized yet");
      return;
    }
    console.log("provider", provider)
    const _walletAddress = await RPC.getAccounts(provider);
    console.log("_walletAddress", _walletAddress);
    setWalletAddress(_walletAddress)




    const ethPrivateKey = await web3auth?.provider.request({
      method: "eth_private_key",
    });
    console.log("ethPrivateKey", ethPrivateKey);

    const entropy = Buffer.from(ethPrivateKey, "hex").slice(0, 32);
    // console.log("entropy", entropy);    
    const mnemonic = entropyToMnemonic(entropy);
    console.log("mnemonic", mnemonic);

    // // Convert ETH private key to Cardano seed
    // // const seed = mnemonicToEntropy(ethPrivateKey);
    // const seed = mnemonicToSeedSync(mnemonic);
    // // console.log("seed", seed);
    // const rootKey = Bip32PrivateKey.from_bip39_entropy(seed, Buffer.from(""));

    // // Derive Cardano Account Key
    // const accountKey = rootKey
    //                     .derive(1852 | 0x80000000) // Purpose
    //                     .derive(1815 | 0x80000000) // Coin Type (Cardano)
    //                     .derive(0 | 0x80000000); // Account #0

    // const cardanoPrivateKey = accountKey.to_raw_key().to_bech32();
    // const cardanoPublicKey = accountKey.to_raw_key().to_public().to_bech32();

    // console.log("Cardano Private Key (NEVER SEND TO BACKEND):", cardanoPrivateKey);
    // console.log("Cardano Public Key (SAFE TO SEND):", cardanoPublicKey);

    // // Derive the first payment key
    // const paymentKey = accountKey.derive(0).derive(0).to_raw_key();
    // console.log("paymentKey", paymentKey);
    // const stakeKey = accountKey.derive(2).derive(0).to_raw_key();
    // console.log("stakeKey", stakeKey);

    // // Convert key hashes into StakeCredential instances
    // const paymentCredential = StakeCredential.from_keyhash(paymentKey.to_public().hash());
    // const stakeCredential = StakeCredential.from_keyhash(stakeKey.to_public().hash());

    // // Generate an address (defaulting to mainnet)
    // const mainnetAddress = BaseAddress.new(
    //   NetworkInfo.mainnet().network_id(),
    //   paymentCredential,
    //   stakeCredential
    // ).to_address().to_bech32();

    // console.log("Cardano Address (Mainnet):", mainnetAddress);

    // // For testnet, use:
    // const testnetAddress = BaseAddress.new(
    //   NetworkInfo.testnet().network_id(),
    //   paymentCredential,
    //   stakeCredential
    // ).to_address().to_bech32();

    // console.log("Cardano Address (Testnet):", testnetAddress);

    // const wallet = new MeshWallet({
    //   networkId: NetworkInfo.testnet().network_id(),
    //   fetcher: blockchainProvider,
    //   submitter: blockchainProvider,
    //   key: {
    //     type: 'root',
    //     bech32: cardanoPrivateKey,
    //   },
    // });

    const mnemonicArray = mnemonic.split(" ");

    console.log("mnemonicArray", mnemonicArray);


    const wallet = new MeshWallet({
      networkId: 0, //NetworkInfo.testnet().network_id(),
      fetcher: blockchainProvider,
      submitter: blockchainProvider,
      key: {
        type: 'mnemonic',
        words: mnemonicArray,
      },
    });

    console.log("wallet", wallet);

    // const wallet = new MeshWallet({
    //   networkId: 0, //NetworkInfo.testnet().network_id(),
    //   // fetcher: blockchainProvider,
    //   // submitter: blockchainProvider,
    //   key: {
    //     type: 'root',
    //     bech32: "<private key>",
    //   },
    // });

    setCardanoWallet(wallet);

    let addr = await wallet.getUnusedAddresses();
    console.log("addr", addr);
    addr = await wallet.getAddresses();
    console.log("addr", addr);
    addr = await wallet.getUsedAddresses();
    console.log("addr", addr);
    addr = await wallet.getUsedAddress();
    console.log("addr", addr);

    console.log("wallet.getUnusedAddresses", await wallet.getUnusedAddresses());
    console.log("wallet.getBalance", await wallet.getBalance());

    let _balance;
    try {
      _balance = await wallet.getBalance();
      if (_balance && _balance.length > 0) {
        setCardanoWalletBalance(_balance[0].quantity);
      }
    } catch (_err) {

    }

    setCardanoWalletAddress(wallet.addresses.baseAddressBech32);

    const pkh = resolvePaymentKeyHash(wallet.addresses.baseAddressBech32);
    console.log("pkh", pkh);
    setCardanoPublicKeyHash(pkh);

    return _walletAddress;
  };

  const getCardanoBalance = async () => {
    console.log("getCardanoBalance");

    if (!cardanoWallet) {
      uiConsole("cardanoWallet not initialized yet");
      return;
    }

    let _balance;
    try {
      _balance = await cardanoWallet.getBalance();
      if (_balance && _balance.length > 0) {
        setCardanoWalletBalance(_balance[0].quantity);
        console.log("Cardano Balance", _balance[0].quantity);

        return _balance[0].quantity;
      }
    } catch (_err) {

    }
  };


  const getGiftCardScript = async (tokenName, utxoRef) => {
    const scriptCbor = applyParamsToScript(blueprint.validators[0].compiledCode, [
      tokenName, // Should be a ByteArray
      utxoRef,   // Should be a transaction output reference
    ]);

    const scriptAddr = serializePlutusScript({
      code: scriptCbor, version: "V3"
    }).address;

    return { scriptCbor, scriptAddr };
  }

  const applyParams = (tokenName, outputReference, validator) => {
    console.log("applyParams", tokenName, outputReference, validator);

    // const outRef = {
    //   constructor: 0,
    //   fields: [
    //     {
    //       constructor: 0,
    //       fields: [outputReference.txHash],
    //     },
    //     BigInt(outputReference.outputIndex),
    //   ],
    // };

    // const giftCard = applyParamsToScript(validator, [
    //   new TextEncoder().encode(tokenName),
    //   outRef,
    // ]);

    // const policyId = resolvePlutusScriptHash(giftCard);
    // const lockAddress = resolvePlutusScriptAddress(giftCard);

    // return {
    //   redeem: { type: "PlutusV2", script: toHex(giftCard) },
    //   giftCard: { type: "PlutusV2", script: toHex(giftCard) },
    //   policyId,
    //   lockAddress,
    // };

  }

  // const applyParams = (tokenName, outputReference, validator) => {
  //   const outRef = new Constr(0, [
  //     new Constr(0, [outputReference.txHash]),
  //     BigInt(outputReference.outputIndex),
  //   ]);

  //   const giftCard = applyParamsToScript(validator, [
  //     fromText(tokenName),
  //     outRef,
  //   ]);

  //   const policyId = validatorToScriptHash({
  //     type: "PlutusV2",
  //     script: giftCard,
  //   });

  //   const lockAddress = validatorToAddress("Preprod", {
  //     type: "PlutusV2",
  //     script: giftCard,
  //   });

  //   return {
  //     redeem: { type: "PlutusV2", script: applyDoubleCborEncoding(giftCard) },
  //     giftCard: { type: "PlutusV2", script: applyDoubleCborEncoding(giftCard) },
  //     policyId,
  //     lockAddress,
  //   };
  // }

  // reusable function to get a transaction builder
  const getTxBuilder = async () => {
    return new MeshTxBuilder({
      fetcher: blockchainProvider,
      submitter: blockchainProvider,
      verbose: true
    });
  }

  // reusable function to get a UTxO by transaction hash
  const getUtxoByTxHash = async (txHash) => {
    const utxos = await blockchainProvider.fetchUTxOs(txHash);
    if (utxos.length === 0) {
      throw new Error("UTxO not found");
    }
    return utxos[0];
  }

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const balance = await RPC.getBalance(provider);
    uiConsole(balance);
  };

  const readValidators = () => {
    const giftCard = blueprint.validators.find(
      (v) => v.title === "oneshot.gift_card.spend"
    );

    if (!giftCard) {
      throw new Error("Gift Card validator not found");
    }

    return {
      giftCard: giftCard.compiledCode,
    };
  }

  async function fetchTxStatus(txHash) {

    const response = await fetch(`https://cardano-preview.blockfrost.io/api/v0/txs/${txHash}`, {
      headers: { project_id: BLOCKFROST_PROJECT_ID },
    });

    console.log("response", response);

    return response;
  }

  async function waitForTx(txHash, maxRetries = 30, delay = 5000) {
    for (let i = 0; i < maxRetries; i++) {
      const response = await fetchTxStatus(txHash);

      let status;

      if (response.status === 200) {
        status = "confirmed"; // Transaction found = confirmed
      } else if (response.status === 404) {
        status = "pending"; // Not found yet, still pending
      } else {
        status = "failed"; // Handle other errors
      }
      console.log(`Transaction Status: ${status}`);

      if (status === "confirmed") {
        console.log("Transaction confirmed!");
        return response;
      }

      await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
    }

    throw new Error("Transaction confirmation timeout exceeded.");
  }

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    const signedMessage = await RPC.signMessage(provider);
    uiConsole(signedMessage);
  };

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet");
      return;
    }
    uiConsole("Sending Transaction...");
    const transactionReceipt = await RPC.sendTransaction(provider);
    uiConsole(transactionReceipt);
  };


  // const signAndSendTransaction = async () => {
  //   if (!provider) {
  //     console.log("provider not initialized yet");
  //     uiConsole("provider not initialized yet");
  //     return;
  //   }
  //   await provider.signAndSendTransaction();
  // };

  const uiConsole = (...args) => {
    const el = document.querySelector("#console>p");
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2);
    }
  };

  const contextProvider = {
    isLoggedIn,
    web3auth,
    chain,
    provider,
    user,
    isLoading,
    idToken,
    appPubKey,
    walletAddress,
    cardanoWallet,
    cardanoWalletAddress,
    cardanoWalletBalance,
    cardanoPublicKeyHash,
    blockchainProvider,
    login,
    logout,
    getUserInfo,
    getAccounts,
    getBalance,
    signMessage,
    sendTransaction,
    getCardanoBalance,
    getGiftCardScript,
    getTxBuilder,
    getUtxoByTxHash,
    applyParams,
    readValidators,
    waitForTx
    //signAndSendTransaction,
  };

  return <Web3AuthContext.Provider value={contextProvider}>
    {children}
  </Web3AuthContext.Provider>;
};