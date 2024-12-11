import React, { useEffect, useReducer, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { allSupportedChains, ChainKey, CosmosChain } from "./constans";
declare global {
  interface Window {
    thorchain?: any;
    maya?: any;
    cosmos: any;
    vultisig: any;
  }
}

interface StateProps {
  address?: string;
  selectedChain?: ChainKey;
}

enum TXStatus {
  INITIAL = "initial",
  FAIL = "fail",
  SUCCESS = "success",
  SUBMITTING = "submitting",
}

function App() {
  const initialState = {
    address: undefined,
    selectedChain: ChainKey.BITCOIN,
    isInstalled: false,
    connecting: false,
    status: TXStatus.INITIAL,
    txHash: "",
  };

  function reducer(state: any, action: { type: any; payload: any }) {
    switch (action.type) {
      case "SET_CHAIN":
        return { ...state, selectedChain: action.payload };
      case "SET_ADDRESS":
        return { ...state, address: action.payload };
      case "SET_STATUS":
        return { ...state, status: action.payload };
      case "SET_TX_HASH":
        return { ...state, txHash: action.payload };
      case "SET_CONNECTING":
        return { ...state, connecting: action.payload };
      case "SET_INSTALLED":
        return { ...state, isInstalled: true };
      default:
        return state;
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (value: any) => {
    const chainKey = value.target.value as ChainKey;
    dispatch({ type: "SET_CHAIN", payload: chainKey });
  };

  const handleConnect = async () => {
    dispatch({ type: "SET_CONNECTING", payload: true });

    const selectedChain = allSupportedChains.find(
      (chain) => chain.name === state.selectedChain
    );
    console.log("selectedChain:", selectedChain);

    const isCosmos = Object.values(CosmosChain).includes(state.selectedChain!);
    const chainRequest = isCosmos
      ? window.vultisig.cosmos
      : window.vultisig[state.selectedChain!.toLowerCase()];

    try {
      if (isCosmos) {
        const currentChainID = await chainRequest.request({
          method: "chain_id",
          params: [],
        });

        if (currentChainID !== selectedChain?.id) {
          await chainRequest.request({
            method: "wallet_switch_chain",
            params: [{ chainId: selectedChain?.id }],
          });
        }
      }

      const accountAddress = await chainRequest.request({
        method: "request_accounts",
        params: [],
      });

      dispatch({ type: "SET_CONNECTING", payload: false });
      dispatch({ type: "SET_ADDRESS", payload: accountAddress });
    } catch (err) {
      console.error("Error connecting:", err);
      dispatch({ type: "SET_CONNECTING", payload: false });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      dispatch({ type: "SET_STATUS", payload: TXStatus.SUBMITTING });

      const formData = new FormData(e.currentTarget);
      const receiver = formData.get("receiver") as string;
      const memo = formData.get("memo") as string;
      const amount = Number(formData.get("amount"));

      const transaction = {
        data: memo,
        from: state.address,
        to: receiver,
        value: amount.toString(16),
      };

      const selectedChain = allSupportedChains.find(
        (chain) => chain.name === state.selectedChain
      );

      if (!selectedChain) throw new Error("Selected chain is not supported.");

      const isCosmosChain = isCosmos(state.selectedChain!);

      const chainRequest = isCosmosChain
        ? window.vultisig.cosmos
        : window.vultisig[state.selectedChain!.toLowerCase()];

      if (isCosmosChain) {
        const currentChainID = await chainRequest.request({
          method: "chain_id",
          params: [],
        });

        if (currentChainID !== selectedChain.id) {
          await switchChain(chainRequest, selectedChain.id);
        }
      }

      const txHash = await sendTransaction(chainRequest, transaction);

      dispatch({
        type: "SET_STATUS",
        payload: TXStatus.SUCCESS,
      });

      dispatch({
        type: "SET_TX_HASH",
        payload: txHash,
      });
    } catch (error) {
      console.error("Transaction failed", error);
      dispatch({ type: "SET_STATUS", payload: TXStatus.FAIL });
    }
  };

  const isCosmos = (chainKey: ChainKey): boolean => {
    return (Object.values(CosmosChain) as unknown as ChainKey[]).includes(
      chainKey
    );
  };

  const switchChain = async (chainRequest: any, targetChainId: string) => {
    try {
      const response = await chainRequest.request({
        method: "wallet_switch_chain",
        params: [{ chainId: targetChainId }],
      });

      if (response !== targetChainId) {
        throw new Error(`Failed to switch to chain: ${targetChainId}`);
      }
    } catch (error) {
      console.error(`Error switching to chain ${targetChainId}`, error);
      throw new Error("Failed to switch chain");
    }
  };

  const sendTransaction = async (
    chainRequest: any,
    transaction: any
  ): Promise<string> => {
    try {
      const txHash = await chainRequest.request({
        method: "send_transaction",
        params: [transaction],
      });
      return txHash;
    } catch (error) {
      console.error("Error sending transaction", error);
      throw new Error("Transaction failed");
    }
  };

  useEffect(() => {
    if (window.vultisig) {
      dispatch({ type: "SET_INSTALLED", payload: true });
    }
  }, []);

  return (
    <div className="App flex justify-center">
      <div className="w-1/2 my-2 p-2 flex justify-between bg-[#11284a] rounded-lg items-center">
        {!state.address ? (
          <div className="flex-col items-center w-full min-h-[500px]">
            <form className="max-w-sm mx-auto" onChange={handleChange}>
              <select
                id="chains"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                {allSupportedChains.map((chain) => (
                  <option key={chain.name} value={chain.name}>
                    {chain.name}
                  </option>
                ))}
              </select>
            </form>
            <button
              disabled={state.connecting || !state.isInstalled}
              className="my-2 disabled:opacity-50 min-w-[100px]"
              onClick={handleConnect}
            >
              {!state.isInstalled
                ? "Vulticonnect not Detected"
                : state.connecting
                ? "Connecting"
                : "Connect"}
            </button>
          </div>
        ) : (
          <>
            <div className="mx-auto min-h-[500px]">
              <div className="max-w-sm mx-auto text-white font-bold">
                Connected {state.selectedChain}
              </div>
              <div className="max-w-sm mx-auto text-white">
                Current Address: {state.address}
              </div>
              <form className="max-w-sm mx-auto mt-5" onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label
                    htmlFor="receiver"
                    className="block mb-2 text-sm font-medium "
                  >
                    Receiver Address
                  </label>
                  <input
                    type="text"
                    id="receiver"
                    name="receiver"
                    className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    defaultValue={state.address}
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="memo"
                    className="block mb-2 text-sm font-medium "
                  >
                    Memo
                  </label>
                  <input
                    type="text"
                    id="memo"
                    name="memo"
                    defaultValue={"hi"}
                    className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-5">
                  <label
                    htmlFor="memo"
                    className="block mb-2 text-sm font-medium"
                  >
                    Amount
                  </label>
                  <input
                    type="text"
                    id="amount"
                    name="amount"
                    defaultValue={"10000000"}
                    className="bg-gray-50 border border-gray-300  text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={state.status === TXStatus.SUBMITTING}
                  className=" active:hover:bg-blue-800 focus:ring-4 disabled:opacity-50 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  {state.status === TXStatus.SUBMITTING
                    ? "Submitting"
                    : "Submit Transaction"}
                </button>
                {state.status === TXStatus.SUCCESS && state.txHash && (
                  <>
                    <div className="text-[#33e6bf]">Transaction Successful</div>
                    <div className="text-[#33e6bf]">txHash: {state.txHash}</div>
                  </>
                )}
              </form>
            </div>
          </>
        )}
      </div>
      <div className="absolute bottom-2 text-gray-400">
        Vulticonnect Integration Example
      </div>
    </div>
  );
}

export default App;
