"use client";

// This ensures the component is treated as a client
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { buildPoseidon } from "circomlibjs";
import { ethers } from "ethers";
import * as snarkjs from "snarkjs";
import { useDeployedContractInfo } from "~~/hooks/scaffold-eth";

//random comment

const GenerateProofForm: React.FC = () => {
  const { data: deployedContractData } = useDeployedContractInfo("ZKFundingContract");
  const [zkFundingContract, setZKFundingContract] = useState<ethers.Contract | null>(null);
  const [input, setInput] = useState({
    userAddress: "",
    depositAmount: "",
    expectedDepositHash: "",
  });

  const router = useRouter();

  useEffect(() => {
    if (deployedContractData) {
      // Initialize the contract instance with ethers.js
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Set up the contract instance with the signer to interact with it
      const contract = new ethers.Contract(deployedContractData.address, deployedContractData.abi, signer);

      setZKFundingContract(contract);
    }
  }, [deployedContractData]);

  const handleProveClick = () => {
    router.push("/zkFund"); // Navigate to the zkFund page
  };

  const calculatePoseidonHash = async () => {
    const poseidon = await buildPoseidon();
    const F = poseidon.F;

    const userAddressBigInt = BigInt(input.userAddress);
    const depositAmountBigInt = BigInt(input.depositAmount);

    const hash = poseidon([userAddressBigInt, depositAmountBigInt]);

    return F.toString(hash);
  };

  const handleGenerateProof = async () => {
    try {
      const calculatedHash = await calculatePoseidonHash();

      const updatedInput = {
        ...input,
        expectedDepositHash: calculatedHash,
      };

      const wasmFile = "/circuit/circuit.wasm";
      const zkeyFile = "/circuit/circuit_final.zkey";

      const inputs = {
        userAddress: updatedInput.userAddress,
        depositAmount: updatedInput.depositAmount,
        expectedDepositHash: updatedInput.expectedDepositHash,
      };

      const { proof, publicSignals } = await snarkjs.groth16.fullProve(inputs, wasmFile, zkeyFile);

      const response = await fetch("/circuit/verification_key.json");
      const vKey = await response.json();

      const isValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);

      if (isValid) {
        // Call the verifyProof method in the contract
        if (zkFundingContract) {
          const proofInputs = {
            _pA: [proof.pi_a[0], proof.pi_a[1]],
            _pB: [
              [proof.pi_b[0][1], proof.pi_b[0][0]],
              [proof.pi_b[1][1], proof.pi_b[1][0]],
            ],
            _pC: [proof.pi_c[0], proof.pi_c[1]],
            _pubSignals: [publicSignals[0]],
          };

          const isValidOnChain = await zkFundingContract.verifyProof(
            proofInputs._pA,
            proofInputs._pB,
            proofInputs._pC,
            proofInputs._pubSignals,
          );

          if (isValidOnChain) {
            alert("Proof verified on-chain!");
          } else {
            alert("On-chain verification failed.");
          }
        }
      } else {
        alert("Proof verification failed.");
      }
    } catch (error) {
      console.error("Error generating proof:", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <div className="max-w-md w-full p-6 bg-base-100 shadow-xl rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Generate Liquidity Deposit Proof</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="User Address"
            className="input input-bordered w-full"
            value={input.userAddress}
            onChange={e => setInput({ ...input, userAddress: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <input
            type="number"
            placeholder="Deposit Amount"
            className="input input-bordered w-full"
            value={input.depositAmount}
            onChange={e => setInput({ ...input, depositAmount: e.target.value })}
          />
        </div>

        <button className="btn btn-primary w-full mb-4" onClick={handleGenerateProof}>
          Generate Proof
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
