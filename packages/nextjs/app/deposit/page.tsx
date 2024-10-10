"use client";

// This ensures the component is treated as a client
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Contract, ethers } from "ethers";
import { BigNumber } from "ethers";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

interface ZKFundingContract extends Contract {
  depositFunds: (pubSignal: number, overrides: { value: BigNumber }) => Promise<ethers.providers.TransactionResponse>;
}

const GenerateProofForm: React.FC = () => {
  const { data: deployedContractData } = useDeployedContractInfo("ZKFundingContract");
  const [zkFundingContract, setZKFundingContract] = useState<ZKFundingContract | null>(null);
  const [pubSignal, setPubSignal] = useState<number>(0);
  const [ethAmount, setEthAmount] = useState<string>("");

  useEffect(() => {
    if (deployedContractData) {
      // Initialize the contract instance with ethers.js
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create contract instance with proper typing
      const contract = new ethers.Contract(
        deployedContractData.address,
        deployedContractData.abi,
        signer,
      ) as ZKFundingContract;

      // Save the contract instance to state
      setZKFundingContract(contract);
    }
  }, [deployedContractData]);

  const depositFunds = async (pubSignal: number, ethAmount: string): Promise<void> => {
    if (zkFundingContract) {
      try {
        const tx = await zkFundingContract.depositFunds(pubSignal, {
          value: ethers.utils.parseEther(ethAmount), // Convert ETH to wei
        });
        await tx.wait();
        console.log("Deposit successful:", tx, "Transaction hash:", tx.hash);
        window.alert("Deposit successful. \nTransaction hash: " + tx.hash);
      } catch (error) {
        console.error("Error depositing funds:", error);
      }
    }
  };

  const router = useRouter();

  const handleProveClick = () => {
    router.push("/zkFund"); // Navigate to the zkFund page
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <div className="max-w-md w-full p-6 bg-base-100 shadow-xl rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Deposit into Contract</h2>

        <div className="mb-4">
          <input
            type="number"
            placeholder="Public Signal"
            className="input input-bordered w-full"
            onChange={e => setPubSignal(Number(e.target.value))}
          />
        </div>

        <div className="mb-4">
          <input
            type="number"
            placeholder="Amount (ETH)"
            className="input input-bordered w-full"
            onChange={e => setEthAmount(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-full mb-4" onClick={() => depositFunds(pubSignal, ethAmount)}>
          Deposit ETH
        </button>

        {/* Back Button with different styling */}
        <button className="btn btn-secondary w-full" onClick={handleProveClick}>
          Back to zkFund
        </button>
      </div>
    </div>
  );
};

export default GenerateProofForm;
