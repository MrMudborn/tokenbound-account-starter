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
      <Hr />
      <IsValidSigner tokenboundClient={tokenboundClient} />
      <Hr />
      <SignMessage tokenboundClient={tokenboundClient} />
      <Hr />
      <Execute tokenboundClient={tokenboundClient} />
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
  const chainId = useChainId();
  const [tba, setTba] = React.useState<string>(""); // [tokenboundAccount, setTokenboundAccount
  const getTBA = (tokenContract: string, tokenId: string) => {
    if (!tokenContract || !tokenId) return;
    const tokenboundAccount = tokenboundClient.getAccount({
      tokenContract: tokenContract,
      tokenId: tokenId,
      chainId: chainId,
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
  const chainId = useChainId();
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
        chainId: chainId,
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

function IsValidSigner({ tokenboundClient }: Props) {
  const [isValid, setIsValid] = React.useState<boolean>(false); // [tokenboundAccount, setTokenboundAccount
  const [isLoading, setIsLoading] = React.useState<boolean>(false); // [tokenboundAccount, setTokenboundAccount

  async function isValidSignerFn(accountAddress: string) {
    if (!accountAddress) return;
    setIsLoading(true);
    const isValidSigner = await tokenboundClient.isValidSigner({
      account: accountAddress, // tokenbound account address
    });

    console.log("isValidSigner?", isValidSigner);
    setIsLoading(false);
    setIsValid(isValidSigner);
  }

  return (
    <>
      <h3>Is Valid Signer</h3>
      <h4>Checks if a tokenbound account has signing authorization.</h4>
      <form
        action=""
        onSubmit={(event) => {
          event.preventDefault();
          const element = event.target as HTMLFormElement;
          const formData = new FormData(element);
          const accountAddress = formData.get("accountAddress") as string;
          isValidSignerFn(accountAddress);
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
      {!isLoading ? (
        <div>
          <b>isValid:</b> {isValid ? "true" : "false"}
        </div>
      ) : null}
    </>
  );
}

function SignMessage({ tokenboundClient }: Props) {
  const [signature, setSignature] = React.useState<string>(""); // [tokenboundAccount, setTokenboundAccount
  const [isLoading, setIsLoading] = React.useState<boolean>(false); // [tokenboundAccount, setTokenboundAccount

  async function signMessage(message: string) {
    if (!message) return;
    setIsLoading(true);
    const signature = await tokenboundClient.signMessage({
      message: message,
    });

    console.log("signature", signature);
    setIsLoading(false);
    setSignature(signature);
  }

  return (
    <>
      <h3>Sign Message</h3>
      <h4>Signs a message using the tokenbound account.</h4>
      <form
        action=""
        onSubmit={(event) => {
          event.preventDefault();
          const element = event.target as HTMLFormElement;
          const formData = new FormData(element);
          const message = formData.get("message") as string;
          signMessage(message);
        }}
      >
        <input type="text" name="message" id="message" placeholder="message" />
        <button type="submit">Sign Message</button>
      </form>
      {isLoading ? "loading..." : null}
      {!isLoading ? (
        <div>
          <b>signature:</b> {signature}
        </div>
      ) : null}
    </>
  );
}

function Execute({ tokenboundClient }: Props) {
  const [tokenboundAccount, setTokenboundAccount] = React.useState<string>(""); // [tokenboundAccount, setTokenboundAccount
  const [recipientAddress, setRecipientAddress] = React.useState<string>(""); // [tokenboundAccount, setTokenboundAccount
  const [ethAmountWei, setEthAmountWei] = React.useState<number>(~~0.001); // [tokenboundAccount, setTokenboundAccount
  const [isLoading, setIsLoading] = React.useState<boolean>(false); // [tokenboundAccount, setTokenboundAccount

  useEffect(() => {
    (async function testTokenboundClass() {
      if (!tokenboundClient || !tokenboundAccount || !recipientAddress) return;
      const preparedExecution = await tokenboundClient.prepareExecution({
        account: tokenboundAccount, // tokenbound account address (sender address)
        to: recipientAddress, // recipient address
        value: ethAmountWei,
      });
      console.log("preparedAccount", preparedExecution);
    })();
  }, [tokenboundClient, tokenboundAccount, recipientAddress]);

  const execute = useCallback(async () => {
    if (!tokenboundClient || !tokenboundAccount || !recipientAddress) return;
    console.log("executing...");
    setIsLoading(true);
    const executedCall = await tokenboundClient.execute({
      account: tokenboundAccount,
      to: recipientAddress,
      value: ethAmountWei,
    });
    executedCall && console.log("Executed", executedCall);
    setIsLoading(false);
  }, [tokenboundClient]);

  return (
    <>
      <h3>Execute</h3>
      <h4>Executes a transaction using the tokenbound account.</h4>
      <form
        action=""
        onSubmit={(event) => {
          event.preventDefault();
          execute();
        }}
      >
        <input
          type="text"
          name="tokenboundAccount"
          id="tokenboundAccount"
          placeholder="tokenbound account address"
          onChange={(event) => {
            const { value } = event.target;
            setTokenboundAccount(value);
          }}
        />
        <input
          type="text"
          name="recipientAddress"
          id="recipientAddress"
          placeholder="recipient address"
          onChange={(event) => {
            const { value } = event.target;
            setRecipientAddress(value);
          }}
        />
        <input
          step={"0.0001"}
          type="number"
          name="ethAmount"
          id="ethAmount"
          placeholder="ETH amount"
          onChange={(event) => {
            const { value } = event.target;
            setEthAmountWei(~~Number(value) * 10 ** 18);
          }}
        />
        <button type="submit">Submit</button>
      </form>
      {isLoading ? "loading..." : null}
    </>
  );
}
