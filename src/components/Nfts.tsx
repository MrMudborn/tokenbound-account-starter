"use client";
import React from "react";
// This script demonstrates access to the NFT API via the Alchemy SDK.
import { Network, Alchemy } from "alchemy-sdk";
import { useAccount, useChainId, useNetwork } from "wagmi";

interface Nft {
  contract: {
    address: string;
  };
  tokenId: string;
  image: {
    cachedUrl: string;
  }
}

export function Nfts() {
  const { address } = useAccount();
  const chainId = useChainId() as any;
  const [nftData, setNftData] = React.useState([]);

  // Optional Config object, but defaults to demo api-key and eth-mainnet.
  const settings = {
    apiKey: "D7HhjoY4azdmlNdRmbYy34xbDnvl_JG6", // Replace with your Alchemy API Key.
    network: chainId === 5 ? Network.ETH_GOERLI : Network.MATIC_MUMBAI, // Replace with the network you're connecting to.
  };

  const alchemy = new Alchemy(settings);

  // Print total NFT count returned in the response:
  const getNft = async () => {
    // Print owner's wallet address:
    console.log("fetching NFTs for address:", address);
    console.log("...");

    const nftsForOwner: any = await alchemy.nft.getNftsForOwner(
      address as string
    );
    console.log(nftsForOwner?.ownedNfts);
    console.log("...");

    // set the nftData state to the array of NFTs returned in the response:
    setNftData(nftsForOwner?.ownedNfts);
  };

  return (
    <>
    <h4>get the wallet NFTs</h4>
      <button onClick={getNft}>Get NFTs</button>      
      <div>
        {nftData.slice(0, 10).map((nft: Nft, index) => (
          <div key={index}>
            <img src={nft?.image?.cachedUrl} alt="" style={{
              height: "50px",
              width: "50px",
            }} />
            <p>
              <b>TokenID:</b> {nft?.tokenId}
            </p>
            <p>
              <b>Contract address:</b> {nft?.contract.address}
            </p>
            <hr />
          </div>
        ))}
      </div>
    </>
  );
}
