import { useMoralisDapp } from "../providers/MoralisDappProvider/MoralisDappProvider";
import { useEffect, useState } from "react";
import {
  useMoralisWeb3Api,
  useMoralisWeb3ApiCall,
  useMoralis,
} from "react-moralis";
import { useIPFS } from "./useIPFS";
// import { Moralis } from "moralis/types";

export const useNFTBalance = (props) => {
  const { account } = useMoralisWeb3Api();
  const { chainId, walletAddress } = useMoralisDapp();
  const { isInitialized } = useMoralis();
  const { resolveLink } = useIPFS();
  const [NFTBalance, setNFTBalance] = useState([]);
  // Moralis.start();
  const {
    fetch: getNFTBalance,
    data,
    error,
    isLoading,
  } = useMoralisWeb3ApiCall(account.getNFTs, {
    chain: "0x1",
    address: walletAddress,
    ...props,
  });

  console.log(error);

  useEffect(() => {
    if (isInitialized) {
      if (data?.result) {
        const NFTs = data.result;
        for (let NFT of NFTs) {
          if (NFT?.metadata) {
            //Need to refactor
            try {
              NFT.metadata = JSON.parse(NFT.metadata);
            } catch (error) {
              NFT.metadata = JSON.parse(JSON.stringify(NFT.metadata));
            }

            // metadata is a string type
            NFT.image = resolveLink(NFT.metadata?.image);
          }
        }
        setNFTBalance(NFTs);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, chainId, walletAddress, data]);

  return { getNFTBalance, NFTBalance, error, isLoading };
};
