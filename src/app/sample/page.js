'use client';
import Image from "next/image";
// import ChatWindow from "../modules/chat/components";
import { useWeb3Auth } from "../common/service/useWeb3Auth";
import { useMembership } from "../common/service/useMembership";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Asset, deserializeAddress, mConStr0 } from "@meshsdk/core";
import { faGear, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import {
//   Blockfrost,
//   Constr,
//   Data,
//   fromText,
//   Lucid,
// } from "@lucid-evolution/lucid";

import {
  resolvePlutusScriptAddress,
  resolvePlutusScriptHash,
  resolveNativeScriptAddress,
  resolveNativeScriptHash,
  Transaction,
  Data,
  fromText,
  toHex,
  MeshTxBuilder,
  ForgeScript
} from "@meshsdk/core";

import { NativeScript } from "@meshsdk/common"

import mesh from "@meshsdk/core";

import {ulid} from 'ulid';

import {MeshPlutusNFTContract} from "@meshsdk/contract"

export default function Home() {
  
  const [metadata, setMetadata] = useState()
  const [mintNFTForgeOneSignatureLoading, setMintNFTForgeOneSignatureLoading] = useState(false)
  const [mintNFTForgeOneSignatureTxHash, setMintNFTForgeOneSignatureTxHash] = useState()
  const [burnNFTUnit, setBurnNFTUnit] = useState()
  const [burnNFTLoading, setBurnNFTLoading] = useState(false)
  const [burnNFTTxHash, setBurnNFTTxHash] = useState()
  const [getNFTLoading, setGetNFTLoading] = useState(false)
  const [NFTs, setNFTs] = useState()
  const [transferNFTUnit, setTransferNFTUnit] = useState()
  const [transferNFTLoading, setTransferNFTLoading] = useState(false)
  const [transferNFTTxHash, setTransferNFTTxHash] = useState()
  const [transferDestinationAddress, setTransferDestinationAddress] = useState()
  const [oracleMinting, setOracleMinting] = useState(false)
  const [oracleCollectionName, setOracleCollectionName] = useState()
  const [oracelNFTPrice, setOracleNFTPrice] = useState()
  const [oracleMintTxHash, setOracleMintTxHash] = useState()
  const [oracleMintParamUtxo, setOracleMintParamUtxo] = useState()
  // const [mintNFTHeliosLoading, setMintNFTHeliosLoading] = useState(false)
  // const [mintNFTHeliosTxHash, setMintNFTHeliosTxHash] = useState()
  const [mintNativeLoading, setMintNativeLoading] = useState(false)
  const [mintNativeTxHash, setMintNativeTxHash] = useState()
  const [nativeScriptPolicyId, setNativeScriptPolicyId] = useState()

  const [nftMetadata, setNFTMetadata] = useState()
  const [nftMintingPlutus, setNftMintingPlutus] = useState(false)
  const [mintNFTPlutusTxHash, setMintNFTPlutusTxHash] = useState()


  const { isLoggedIn, provider, login, logout, getUserInfo, getAccounts, getBalance, signMessage, getCardanoBalance, idToken, appPubKey, walletAddress, cardanoWalletAddress, cardanoWalletBalance, cardanoWallet,
    sendTransaction, web3Auth, chain, cardanoPublicKeyHash, getGiftCardScript, getTxBuilder, getUtxoByTxHash, applyParams, readValidators, waitForTx, blockchainProvider } = useWeb3Auth();

  const { isSignedIn, isFirstTimeSignIn, memberProfile, memberSignIn } = useMembership();

  const {register, formState: {errors}, handleSubmit} = useForm()

  useEffect(() => {
    console.log("isLoggedIn", isLoggedIn)
    if(isLoggedIn) {  // logged in to web3auth

      if(!idToken || !appPubKey) {
        getUserInfo() // sometime user refresh, so we need to get idToken and appPubKey again and put into the state
        getAccounts()
      }

    }
  }, [isLoggedIn])

  // useEffect(() => {
  //   if(walletAddress) {
  //     memberSignIn(walletAddress)  // after logged in to web3auth, we sign in to our backend to get member profile
  //   }
  // }, [walletAddress])


  const sampleMetadata = {
    "name": "MeshToken",
    "image": "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
    "mediaType": "image/jpg",
    "description": "This NFT was minted by Mesh (https://meshjs.dev/)."
  };

  const mintNFTWithForgeScriptOneSignature = async () => {
    
    setMintNFTForgeOneSignatureLoading(true)
    setMintNFTForgeOneSignatureTxHash()

    let _metadata = metadata ? JSON.parse(metadata) : sampleMetadata;
    console.log("_metadata", _metadata);
    
    let asset = {
      assetName: _metadata.name,
      assetQuantity: '1',
      metadata: _metadata,
      label: '721',
      recipient: cardanoWalletAddress
    }

    const tx = new Transaction({ initiator: cardanoWallet });

    const forgingScript = ForgeScript.withOneSignature(cardanoWalletAddress);

    tx.mintAsset(
      forgingScript,
      asset,
    );

    const unsignedTx = await tx.build();
    const signedTx = await cardanoWallet.signTx(unsignedTx);
    const txHash = await cardanoWallet.submitTx(signedTx);
    const response = await waitForTx(txHash)
    console.log("response", response);
    
    setMintNFTForgeOneSignatureTxHash(txHash)
    setMintNFTForgeOneSignatureLoading(false)
  }

  const getNFTs = async () => {
    setGetNFTLoading(true)

    let _assets = await cardanoWallet.getAssets();
    setNFTs(_assets);
    console.log("_assets", _assets);
    
    setGetNFTLoading(false)
  }

  const burnNFT = async () => {

    if(!burnNFTUnit)  {
      alert('Missing burn NFT Unit')
      return;
    }

    setBurnNFTLoading(true)
    setBurnNFTTxHash()

    const tx = new Transaction({ initiator: cardanoWallet });

    const forgingScript = ForgeScript.withOneSignature(cardanoWalletAddress);

    let asset = {
      unit: burnNFTUnit,
      quantity: 1
    }

    tx.burnAsset(
      forgingScript,
      asset,
    );

    const unsignedTx = await tx.build();
    const signedTx = await cardanoWallet.signTx(unsignedTx);
    const txHash = await cardanoWallet.submitTx(signedTx);
    const response = await waitForTx(txHash)
    setBurnNFTTxHash(txHash)
    setBurnNFTLoading(false)
    console.log("response", response);

  }

  const transferNFT = async () => {
    if(!transferNFTUnit)  {
      alert('Missing transfer NFT Unit')
      return;
    }
    if(!transferDestinationAddress)  {
      alert('Missing transfer destination address')
      return;
    }

    setTransferNFTLoading(true)
    setTransferNFTTxHash()

    // Create a new transaction
    const tx = new Transaction({ initiator: cardanoWallet })
      .sendAssets(transferDestinationAddress, [
        { unit: transferNFTUnit, quantity: "1" }, // Send NFT
        { unit: "lovelace", quantity: "2000000" } // Include some ADA as gas fee
      ])
      .setChangeAddress(await cardanoWallet.getChangeAddress()); // Set change address
    
    // Complete, sign, and submit the transaction
    const unsignedTx = await tx.build();
    const signedTx = await cardanoWallet.signTx(unsignedTx);
    const txHash = await cardanoWallet.submitTx(signedTx);
    const response = await waitForTx(txHash)
    setTransferNFTTxHash(txHash)
    setTransferNFTLoading(false)
    console.log("response", response);
  }

  const setCollateral = async () => {
    const utxos = await cardanoWallet.getUtxos();
    console.log("utxos", utxos);
    
    const collateralUtxo = utxos.find(utxo => utxo.output.amount.find(x => x.quantity >= 5000000) ); // 5 ADA
    console.log("collateralUtxo", collateralUtxo);
    
    if (!collateralUtxo) {
      console.log("No UTXO with sufficient ADA for collateral.");
      alert("No UTXO with sufficient ADA for collateral. Please top up your wallet with at least 5 ADA, i.e. 5 millions lovelace")
    }

    // i think meshjs will auto set collateral
    // await cardanoWallet.setCollateral([collateralUtxo]);
  };

  const mintOracle = async () => {

    setOracleMinting(true)

    await setCollateral();

    const meshTxBuilder = new MeshTxBuilder({
      fetcher: blockchainProvider,
      submitter: blockchainProvider,
      verbose: true,
    });

    const contract = new MeshPlutusNFTContract({
                                                  mesh: meshTxBuilder,
                                                  fetcher: blockchainProvider,
                                                  wallet: cardanoWallet,
                                                  networkId: 0
                                                }, {
                                                  collectionNme: oracleCollectionName
                                                });

    const {tx, paramUtxo} = await contract.setupOracle(oracelNFTPrice);
    console.log("tx", tx);
    console.log("paramUtxo", paramUtxo);
    
    const signedTx = await cardanoWallet.signTx(tx);
    const txHash = await cardanoWallet.submitTx(signedTx);
    setOracleMintTxHash(txHash)
    setOracleMintParamUtxo(paramUtxo)
    setOracleMinting(false)
  }

  const mintNFTPlutus = async () => {

    if(!oracleCollectionName) {
      alert("collection name is required");
      return
    }
    else {
      console.log(oracleCollectionName);
      
    }

    if(!oracleMintParamUtxo) {
      alert("Param Utxo is required");
      return
    }
    else {
      console.log("oracleMintParamUtxo", JSON.parse(oracleMintParamUtxo));
      
    }


    setNftMintingPlutus(true)

    const meshTxBuilder = new MeshTxBuilder({
      fetcher: blockchainProvider,
      submitter: blockchainProvider,
      verbose: true,
    });
    
    const contract = new MeshPlutusNFTContract(
      {
        mesh: meshTxBuilder,
        fetcher: blockchainProvider,
        wallet: cardanoWallet,
        networkId: 0,
      },
      {
        collectionName: oracleCollectionName,
        paramUtxo: JSON.parse(oracleMintParamUtxo),
      },
    );
    
    // meshjs code is buggy, so manually set the auto-incremental value
    // // Get Oracle Data
    // const oracleData = await contract.getOracleData(); // see getOracleData()
    // console.log("oracleData", oracleData);
    
    
    // define your NFT metadata here
    const assetMetadata = {
      ...sampleMetadata,
      //name: `Mesh Token ${oracleData.nftIndex}`,
      name: `Mesh Token 1`, // meshjs code is buggy, so manually set the auto-incremental value
    };

    setNFTMetadata(assetMetadata)
    
    const tx = await contract.mintPlutusNFT(assetMetadata);
    const signedTx = await cardanoWallet.signTx(tx);
    const txHash = await cardanoWallet.submitTx(signedTx);
    setMintNFTPlutusTxHash(txHash)
    setNftMintingPlutus(false)
  }

  const mintNative = async () => {
    setMintNativeLoading(true)
    setMintNativeTxHash()

    let _metadata = metadata ? JSON.parse(metadata) : sampleMetadata;
    console.log("_metadata", _metadata);
    
    let asset = {
      assetName: _metadata.name,
      assetQuantity: '1',
      metadata: _metadata,
      label: '721',
      recipient: cardanoWalletAddress
    }

    const nativeScript = {
      type: "sig",
      keyHash: cardanoPublicKeyHash
    }
    
    const forgingScript = ForgeScript.fromNativeScript(nativeScript);

    const _hash = resolveNativeScriptHash(nativeScript);
    setNativeScriptPolicyId(_hash);

    const tx = new Transaction({ initiator: cardanoWallet });

    tx.mintAsset(
      forgingScript,
      asset,
    );

    const unsignedTx = await tx.build();
    const signedTx = await cardanoWallet.signTx(unsignedTx);
    const txHash = await cardanoWallet.submitTx(signedTx);
    const response = await waitForTx(txHash)
    console.log("response", response);
    
    setMintNativeTxHash(txHash)
    setMintNativeLoading(false)
  }

  const burnNative = async () => {

  }

  // const mintWithHelios = async () => {
  //   console.log("mintWithHelios");
    
  //   setMintNFTHeliosLoading(true)
  //   setMintNFTHeliosTxHash()

  //   let _metadata = metadata ? JSON.parse(metadata) : sampleMetadata;
  //   console.log("_metadata", _metadata);

  //   // Load the compiled Helios script (CBOR JSON)
  //   // const plutusScript = {
  //   //   type: "PlutusV2",
  //   //   // Replace with actual compiled CBOR from Helios 
  //   //   script: "59037159036e010000323232323232225333573464646464664a666ae68cdc3800a400024a666ae694ccd5cd19191980080099807002801112999aab9f00114a2264a666ae68c8ccd5cd000a504a2664464660020026602600600444a666aae7c0045288992999ab9a3233357340029412899b87330170050013301700400114a02660060066ae88008d5d080099807803800998078020008a50133003003357440046ae84004c94ccd5cd19b874800000452f5bded8c02646466ae80cdd80011ba633574066ec0004dd4001a5eb7bdb1812f5bded8c06ae84d5d11aab9e375400c6ae84d55cf1baa005480084cc034dd61aba135573c6ea80188cdd79aba135573c6ea80053010dd8799fd8799f43abc123ff00ff0014a026601200c9111c4d06e1860e2945c4502875eef31dce24d88c87f75009871976e6770a0014a024a666ae68cdc4191919199800800912999aab9f0011615333573466ebcd55ce9aba10010041375a6aae78d5d08008998010011aba200100622253335573e0022c2a666ae68cdd79aab9d3574200200a2660040046eacd55cf1aba10011333003003002357440026ae84d5d11aab9e375400a6ae84d55cf1baa004480004cc02401922011c4d06e1860e2945c4502875eef31dce24d88c87f75009871976e6770a0014a06aae74dd50030031bab35742600e0066466e9520003357406ea4008cd5d01ba90014bd70244100375c646ae84d55cf1baa001357426ae88d55cf1baa002357426aae78dd50008a4c2c446600c6eb0d5d09aba2357446ae88d5d11801801119baf001375200446ae88d5d11aba2357446aae78dd5000911919800800801912999aab9f00114bd6f7b6300a999ab9a3375e6aae74d5d080080189bab35573c6ae840044cc008008d5d1000911919191998008009998010010018020019112999aab9f001100213357406ae84004ccc00c00c008d5d10009112999aab9f00114bd700992999ab9a3300800523375e00200426660080080066ae880084cd5d00009998020020019aba200235573a6ae84004c8cc00400400c894ccd55cf8008a5eb804cd5d01aab9d35742002660040046ae8800488c8ccc00400400c0088894ccd55cf8010a5015333573460026ae8400852889998018019aba2002001223233300100100300222253335573e004290000a999ab9a3375e6aae74d5d080100089bad35573c6ae840084ccc00c00cd5d10010009" 
  //   // };
  //   const plutusScript = {"type": "PlutusScriptV2", "description": "", "cborHex": "59037159036e010000323232323232225333573464646464664a666ae68cdc3800a400024a666ae694ccd5cd19191980080099807002801112999aab9f00114a2264a666ae68c8ccd5cd000a504a2664464660020026602600600444a666aae7c0045288992999ab9a3233357340029412899b87330170050013301700400114a02660060066ae88008d5d080099807803800998078020008a50133003003357440046ae84004c94ccd5cd19b874800000452f5bded8c02646466ae80cdd80011ba633574066ec0004dd4001a5eb7bdb1812f5bded8c06ae84d5d11aab9e375400c6ae84d55cf1baa005480084cc034dd61aba135573c6ea80188cdd79aba135573c6ea80053010dd8799fd8799f43abc123ff00ff0014a026601200c9111c4d06e1860e2945c4502875eef31dce24d88c87f75009871976e6770a0014a024a666ae68cdc4191919199800800912999aab9f0011615333573466ebcd55ce9aba10010041375a6aae78d5d08008998010011aba200100622253335573e0022c2a666ae68cdd79aab9d3574200200a2660040046eacd55cf1aba10011333003003002357440026ae84d5d11aab9e375400a6ae84d55cf1baa004480004cc02401922011c4d06e1860e2945c4502875eef31dce24d88c87f75009871976e6770a0014a06aae74dd50030031bab35742600e0066466e9520003357406ea4008cd5d01ba90014bd70244100375c646ae84d55cf1baa001357426ae88d55cf1baa002357426aae78dd50008a4c2c446600c6eb0d5d09aba2357446ae88d5d11801801119baf001375200446ae88d5d11aba2357446aae78dd5000911919800800801912999aab9f00114bd6f7b6300a999ab9a3375e6aae74d5d080080189bab35573c6ae840044cc008008d5d1000911919191998008009998010010018020019112999aab9f001100213357406ae84004ccc00c00c008d5d10009112999aab9f00114bd700992999ab9a3300800523375e00200426660080080066ae880084cd5d00009998020020019aba200235573a6ae84004c8cc00400400c894ccd55cf8008a5eb804cd5d01aab9d35742002660040046ae8800488c8ccc00400400c0088894ccd55cf8010a5015333573460026ae8400852889998018019aba2002001223233300100100300222253335573e004290000a999ab9a3375e6aae74d5d080100089bad35573c6ae840084ccc00c00cd5d10010009"}

  //   const tx = new Transaction({ initiator: cardanoWallet });
  //   console.log(11);
    
  //   tx.mintAsset(
  //     plutusScript,
  //     {
  //       // assetName: _metadata.name,  // Match TN = "" in Helios script
  //       // amount: "1",    // Match QTY = 1 in Helios script
  //       // redeemer: mesh.Data.to("Mint"), // Match Redeemer::Mint

  //       assetName: _metadata.name,
  //       assetQuantity: '1',
  //       metadata: _metadata,
  //       label: '721',
  //       recipient: cardanoWalletAddress
        
  //     },
  //     { data: mesh.Data.to("Mint") } // Pass the redeemer as a separate third argument
  //   );
  //   //.sendValue(cardanoWalletAddress, { lovelace: "2000000" })
  //   console.log(22);
  //   const unsignedTx = await tx.build();
  //   const signedTx = await cardanoWallet.signTx(unsignedTx);
  //   const txHash = await cardanoWallet.submitTx(signedTx);
  //   const response = await waitForTx(txHash)
  //   console.log("response", response);
    
  //   setMintNFTHeliosTxHash(txHash)
  //   setMintNFTHeliosLoading(false)
  // }

  // const burnWithHelios = async () => {
    
  // }

  // const transferWithHelios = async () => {
    
  // }
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="text-[40px] underline">Cardano dApp with web3auth and NextJs</div>
        {
          isLoggedIn
          ? <>
              Logged In
              <br/>
              <button onClick={logout} className="btn btn-secondary">
                Logout
              </button>
              <div style={{marginBottom: 2}}>Web3Auth IdToken: {idToken}</div>
              <div style={{marginBottom: 2}}>Web3Auth appPubKey: <br/> {appPubKey}</div>
              {/* <>Polygon wallet address: <br/> {walletAddress}</>
              <br/> */}
              <div style={{marginBottom: 2}}>Cardano wallet address (Testnet): <br/> {cardanoWalletAddress}</div>
              <div style={{marginBottom: 2}}>Cardano public key hash (Testnet): <br/> {cardanoPublicKeyHash}</div>
              <div>
                Wallet Balance: {cardanoWalletBalance} lovelace
                <span style={{marginLeft: 10}}><button className="btn btn-sm btn-primary" onClick={getCardanoBalance}>Refresh</button></span>
                <span style={{marginLeft: 10}} className="text-sm">(Please get free Preview ADA from <a href="https://docs.cardano.org/cardano-testnets/tools/faucet" className="link">Cardano Faucet</a>)</span>
              </div>
              <div style={{marginLeft: 10}} className="flex flex-col">
                <div className="flex flex-col">
                  <label>Asset Metadata</label>
                  <textarea onChange={(e) => setMetadata(e.target.value)} rows={6} className="w-[800px]" value={JSON.stringify(sampleMetadata, null, 2)} />
                </div>
                <div className="flex flex-col ml-2">
                  <label>&nbsp;</label>
                  <button className="btn btn-primary" 
                    disabled={mintNFTForgeOneSignatureLoading}
                    onClick={async () => await mintNFTWithForgeScriptOneSignature()}>
                      {
                       mintNFTForgeOneSignatureLoading
                       ?   <span className="flex justify-center">Loading.. <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin"/></span>
                       :   <span>Mint Asset - with ForgeScript One Signature</span> 
                      }
                  </button>
                </div>
                {
                  mintNFTForgeOneSignatureTxHash && 
                  <div className="flex items-center">
                    Transaction Hash: 
                    <a target="_blank" href={`https://preview.cardanoscan.io/transaction/${mintNFTForgeOneSignatureTxHash}`} className="ml-2 link">{mintNFTForgeOneSignatureTxHash}</a>
                    <span className="ml-2 text-xs">(Please wait 1 or 2 minute(s) before click on this link, cardanoscan will take some time)</span>
                  </div>
                }
              </div>
              <div className="flex flex-col ml-2 mt-10">
                <button className="btn btn-primary" 
                  disabled={getNFTLoading}
                  onClick={async () => await getNFTs()}>
                    {
                    getNFTLoading
                    ?   <span className="flex justify-center">Loading.. <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin"/></span>
                    :   <span>Get My Assets</span> 
                    }
                </button>
                {
                  NFTs && 
                  <textarea rows={6} className="w-[800px]" disabled={true} value={JSON.stringify(NFTs, null, 2)} />
                }
              </div>
              <div className="flex flex-col ml-2 mt-10">
                <input type="text" className="input" name="txtBurnNFTUnit" placeholder="Asset Unit" onChange={(e) => setBurnNFTUnit(e.target.value)}/>
                <button className="btn btn-primary mt-1" 
                  disabled={burnNFTLoading}
                  onClick={async () => await burnNFT()}>
                    {
                    burnNFTLoading
                    ?   <span className="flex justify-center">Loading.. <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin"/></span>
                    :   <span>Burn Asset</span> 
                    }
                </button>
                {
                  burnNFTTxHash &&
                  <div className="flex items-center">
                    Transaction Hash: 
                    <a target="_blank" href={`https://preview.cardanoscan.io/transaction/${burnNFTTxHash}`} className="ml-2 link">{burnNFTTxHash}</a>
                    <span className="ml-2 text-xs">(Please wait 1 or 2 minute(s) before click on this link, cardanoscan will take some time)</span>
                  </div>
                }
              </div>
              <div className="flex flex-col ml-2 mt-10">
                <input type="text" className="input" name="txtTransferNFTUnit" placeholder="Asset Unit" onChange={(e) => setTransferNFTUnit(e.target.value)}/>
                <input type="text" className="input mt-1" name="txtTransferDestinationAddress" placeholder="Receiver Address" onChange={(e) => setTransferDestinationAddress(e.target.value)}/>
                <button className="btn btn-primary mt-1" 
                  disabled={transferNFTLoading}
                  onClick={async () => await transferNFT()}>
                    {
                    transferNFTLoading
                    ?   <span className="flex justify-center">Loading.. <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin"/></span>
                    :   <span>Transfer Asset</span> 
                    }
                </button>
                {
                  transferNFTTxHash &&
                  <div className="flex items-center">
                    Transaction Hash: 
                    <a target="_blank" href={`https://preview.cardanoscan.io/transaction/${transferNFTTxHash}`} className="ml-2 link">{transferNFTTxHash}</a>
                    <span className="ml-2 text-xs">(Please wait 1 or 2 minute(s) before click on this link, cardanoscan will take some time)</span>
                  </div>
                }
              </div>
              {/* <div className="underline mt-10 ">
                Mint NFT with Plutus script using MeshJs NFT Plutus contract (Aiken smart contract). Your wallet must have sufficient ADA as collateral.
              </div>
              <div className="flex flex-col ml-2">
                <h1>Setup Oracle</h1>
                <input type="text" className="input" name="txtOracleCollectionName" placeholder="Collection Name" onChange={(e) => setOracleCollectionName(e.target.value)}/>
                <input type="text" className="input mt-1" name="txtOracleNFTPrice" value={oracelNFTPrice} placeholder="NFT Price in Lovelace" onChange={(e) => setOracleNFTPrice(e.target.value)}/>
                <button className="btn btn-primary mt-1" 
                  disabled={oracleMinting}
                  onClick={async () => await mintOracle()}>
                    {
                    oracleMinting
                    ?   <span className="flex justify-center">Loading.. <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin"/></span>
                    :   <span>Mint Oracle</span> 
                    }
                </button>
                {
                  oracleMintTxHash &&
                  <>
                  <div className="flex items-center">
                    Transaction Hash: 
                    <a target="_blank" href={`https://preview.cardanoscan.io/transaction/${oracleMintTxHash}`} className="ml-2 link">{oracleMintTxHash}</a>

                    <span className="ml-2 text-xs">(Please wait 1 or 2 minute(s) before click on this link, cardanoscan will take some time)</span>
                  </div>
                  {
                    oracleMintParamUtxo && 
                    <textarea rows={6} className="w-[800px]" disabled={true} value={JSON.stringify(oracleMintParamUtxo, null, 2)} />
                  }
                  </>
                }
              </div>
              <div className="flex flex-col ml-2 mt-10">
                <h1>Mint Asset</h1>
                <input type="text" className="input" name="txtNFTCollectionName" placeholder="NFT Collection Name" value={oracleCollectionName} onChange={(e) => setOracleCollectionName(e.target.value)}/>
                <input type="text" className="input mt-1" name="txtNFTParamUtxo" value={oracleMintParamUtxo} placeholder="NFT Param Utxo" onChange={(e) => setOracleMintParamUtxo(e.target.value)}/>
                <button className="btn btn-primary mt-1" 
                  disabled={nftMintingPlutus}
                  onClick={async () => await mintNFTPlutus()}>
                    {
                    nftMintingPlutus
                    ?   <span className="flex justify-center">Loading.. <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin"/></span>
                    :   <span>Mint NFT with Plutus</span> 
                    }
                </button>
                { nftMetadata && <textarea disabled={true} rows={6} className="w-[800px]" value={nftMetadata ? JSON.stringify(nftMetadata, null, 2) : ''} /> }
                {
                  mintNFTPlutusTxHash &&
                  <>
                  <div className="flex items-center">
                    Transaction Hash: 
                    <a target="_blank" href={`https://preview.cardanoscan.io/transaction/${mintNFTPlutusTxHash}`} className="ml-2 link">{mintNFTPlutusTxHash}</a>

                    <span className="ml-2 text-xs">(Please wait 1 or 2 minute(s) before click on this link, cardanoscan will take some time)</span>
                  </div>
                  </>
                }
              </div> */}
              
              <div className="border p-4">
                <span>Mint owneable asset with NativeScript</span>
                <div className="border p-2">
                  <button className="btn btn-primary" onClick={async() => await mintNative()}>
                    {
                      mintNativeLoading
                      ?   <span className="flex justify-center">Loading.. <FontAwesomeIcon icon={faSpinner} className="h-4 w-4 animate-spin"/></span>
                      :   <span>Mint with Native Script</span> 
                    }
                  </button>
                  {
                    nativeScriptPolicyId && 
                    <div>
                      <>Policy Id (this policy belong to your wallet) : </> {nativeScriptPolicyId}
                    </div>
                  }
                  {
                    mintNativeTxHash &&
                    <>
                    <div className="flex items-center">
                      Transaction Hash: 
                      <a target="_blank" href={`https://preview.cardanoscan.io/transaction/${mintNativeTxHash}`} className="ml-2 link">{mintNativeTxHash}</a>

                      <span className="ml-2 text-xs">(Please wait 1 or 2 minute(s) before click on this link, cardanoscan will take some time)</span>
                    </div>
                    </>
                  }
                </div>

              </div>  
            </>
          : <button onClick={login} className="btn btn-primary">
              Login
            </button>
        }
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
      </footer>
    </div>
  );
}
