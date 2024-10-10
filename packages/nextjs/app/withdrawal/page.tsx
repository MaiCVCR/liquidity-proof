"use client";

// This ensures the component is treated as a client
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Contract, ethers } from "ethers";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

interface ZKFundingContract extends Contract {
  withdrawFunds: () => Promise<ethers.providers.TransactionResponse>;
}

const GenerateProofForm: React.FC = () => {
  const { data: deployedContractData } = useDeployedContractInfo("ZKFundingContract");
  const [zkFundingContract, setZKFundingContract] = useState<ZKFundingContract | null>(null);

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

  const withdrawFunds = async (): Promise<void> => {
    if (!zkFundingContract) {
      console.error("Contract is not loaded");
      return;
    }

    try {
      const ownerAddress = await zkFundingContract.owner();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      if (userAddress.toLowerCase() !== ownerAddress.toLowerCase()) {
        window.alert("You are not the owner, so you cannot withdraw the funds.");
        return;
      }
      const tx = await zkFundingContract.withdrawFunds();
      await tx.wait();
      const explorerUrl = `https://cardona-zkevm.polygonscan.com/tx/${tx.hash}`;
      window.alert(`Withdrawal successful! You can view the transaction at: ${explorerUrl}`);
    } catch (error) {
      console.error("Error withdrawing funds:", error);
    }
  };

  const router = useRouter();

  const handleProveClick = () => {
    router.push("/zkFund"); // Navigate to the zkFund page
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <div className="max-w-md w-full p-6 bg-base-100 shadow-xl rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Withdraw from Contract</h2>

        <button className="btn btn-primary w-full mb-4" onClick={() => withdrawFunds}>
          Withdraw ETH
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
