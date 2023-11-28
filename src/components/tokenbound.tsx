"use client";

import { TokenboundClient, TokenboundClientOptions } from "@tokenbound/sdk";
import React, { useCallback, useEffect } from "react";
import { useChainId, useWalletClient } from "wagmi";

export function Tokenbound() {
  const { data: walletClient } = useWalletClient();
  const chainId = useChainId();

  const tokenboundClientOptions: TokenboundClientOptions = {
    walletClient: walletClient as any,
    chainId: chainId,
  };

  const tokenboundClient = new TokenboundClient(tokenboundClientOptions);

  return (
    <>
      <GetTBA tokenboundClient={tokenboundClient} />
      <Hr />
      <CheckAccountDeployment tokenboundClient={tokenboundClient} />
      <Hr />
      <CreateAccount tokenboundClient={tokenboundClient} />
      <Hr />
      <GetNft tokenboundClient={tokenboundClient} />
    </>
  );
}

function Hr() {
  return (
    <hr
      style={{
        margin: "20px 0",
      }}
    />
  );
}

interface Props {
  tokenboundClient: any;
}

function GetTBA({ tokenboundClient }: Props) {
  const [tba, setTba] = React.useState<string>(""); // [tokenboundAccount, setTokenboundAccount
  const getTBA = (tokenContract: string, tokenId: string) => {
    if (!tokenContract || !tokenId) return;
    const tokenboundAccount = tokenboundClient.getAccount({
      tokenContract: tokenContract,
      tokenId: tokenId,
    });

    console.log(tokenboundAccount);
    setTba(tokenboundAccount);
  };

  return (
    <>
      <h3>Get tokenbound account</h3>
      <h4>Gets the tokenbound account address for an NFT.</h4>
      <form
        action=""
        onSubmit={(event) => {
          event.preventDefault();
          const element = event.target as HTMLFormElement;
          const formData = new FormData(element);
          const tokenContractAddress = formData.get(
            "tokenContractAddress"
          ) as string;
          const tokenID = formData.get("tokenID") as string;
          getTBA(tokenContractAddress, tokenID);
        }}
      >
        <input
          type="text"
          name="tokenContractAddress"
          id="tokenContractAddress"
          placeholder="token contract address"
        />
        <input type="text" name="tokenID" id="tokenID" placeholder="token ID" />
        <button type="submit">Submit</button>
      </form>
      {tba && <div>Tokenbound Account: {tba}</div>}
    </>
  );
}

function CheckAccountDeployment({ tokenboundClient }: Props) {
  const [isTbaDeployed, setIsTbaDeployed] = React.useState<boolean>(false); // [tokenboundAccount, setTokenboundAccount
  const [isLoading, setIsLoading] = React.useState<boolean>(false); // [tokenboundAccount, setTokenboundAccount

  const checkAccountDeployment = async (accountAddress: string) => {
    if (!accountAddress) return;
    setIsLoading(true);
    const isAccountDeployed = await tokenboundClient.checkAccountDeployment({
      accountAddress: accountAddress, // tokenbound account address
    });

    setIsLoading(false);
    console.log("IS DEPLOYED?", isAccountDeployed);
    setIsTbaDeployed(isAccountDeployed);
  };
  return (
    <>
      <h3>Check account deployment</h3>
      <h4>
        Check if the tokenbound account address has been activated using
        createAccount.
      </h4>
      <form
        action=""
        onSubmit={(event) => {
          event.preventDefault();
          const element = event.target as HTMLFormElement;
          const formData = new FormData(element);
          const accountAddress = formData.get("accountAddress") as string;
          checkAccountDeployment(accountAddress);
        }}
      >
        <input
          type="text"
          name="accountAddress"
          id="accountAddress"
          placeholder="tokenbound account address"
        />
        <button type="submit">Submit</button>
      </form>
      <b>Account is deployed</b>:{" "}
      {isLoading ? "loading..." : isTbaDeployed ? "true" : "false"}
    </>
  );
}

function CreateAccount({ tokenboundClient }: Props) {
  const [tokenContract, setTokenContract] = React.useState<string>("");
  const [tokenId, setTokenId] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false); // [tokenboundAccount, setTokenboundAccount
  const [newAccount, setNewAccount] = React.useState<string>(""); // [tokenboundAccount, setTokenboundAccount

  useEffect(() => {
    (async function testTokenboundClass() {
      if (!tokenContract || !tokenId) return;
      const preparedAccount = await tokenboundClient.prepareCreateAccount({
        tokenContract: tokenContract,
        tokenId: tokenId,
      });
      console.log("preparedAccount", preparedAccount);
    })();
  }, [tokenboundClient, tokenContract, tokenId]);

  const handleChanges = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name === "tokenContractAddress") {
      setTokenContract(value);
    } else if (name === "tokenID") {
      setTokenId(value);
    }
  };

  const createAccount = useCallback(async () => {
    if (!tokenboundClient) return;
    setIsLoading(true);
    const createdAccount = await tokenboundClient.createAccount({
      tokenContract: tokenContract,
      tokenId: tokenId,
    });
    console.log("new account", createdAccount);
    setIsLoading(false);
    setNewAccount(createdAccount?.account);
  }, [tokenboundClient, tokenContract, tokenId]);

  return (
    <>
      <h3>Create Tokenbound account</h3>
      <h4>Creates a tokenbound account for an NFT.</h4>
      <form
        action=""
        onSubmit={(event) => {
          event.preventDefault();
          createAccount();
        }}
      >
        <input
          type="text"
          name="tokenContractAddress"
          id="tokenContractAddress"
          placeholder="token contract address"
          onChange={handleChanges}
        />
        <input
          type="text"
          name="tokenID"
          id="tokenID"
          placeholder="token ID"
          onChange={handleChanges}
        />
        <button type="submit">Submit</button>
      </form>
      <b>New Account</b>:
      {isLoading ? "loading..." : newAccount ? newAccount : "none"}
    </>
  );
}

function GetNft({ tokenboundClient }: Props) {
  const [nft, setNft] = React.useState<any>(); // [tokenboundAccount, setTokenboundAccount
  const [isLoading, setIsLoading] = React.useState<boolean>(false); // [tokenboundAccount, setTokenboundAccount

  async function getNft(accountAddress: string) {
    if (!accountAddress) return;
    setIsLoading(true);
    const nft = await tokenboundClient.getNFT({
      accountAddress: accountAddress, // tokenbound account address
    });
    console.log(nft);
    setIsLoading(false);
    setNft(nft);
  }

  return (
    <>
      <h3>Get NFT</h3>
      <h4>
        Extracts information about the origin NFT that is paired with the
        tokenbound account.
      </h4>
      <form
        action=""
        onSubmit={(event) => {
          event.preventDefault();
          const element = event.target as HTMLFormElement;
          const formData = new FormData(element);
          const accountAddress = formData.get("accountAddress") as string;
          getNft(accountAddress);
        }}
      >
        <input
          type="text"
          name="accountAddress"
          id="accountAddress"
          placeholder="tokenbound account address"
        />
        <button type="submit">Submit</button>
      </form>
      {isLoading ? "loading..." : null}
      {!isLoading && nft ? (
        <div>
          <b>tokenContract:</b> {nft?.tokenContract} <br />
          <b>tokenId:</b> {nft?.tokenId} <br />
          <b>chainId:</b> {nft?.chainId}
        </div>
      ) : null}
    </>
  );
}
