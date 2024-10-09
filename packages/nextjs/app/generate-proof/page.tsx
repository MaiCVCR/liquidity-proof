"use client"; // This ensures the component is treated as a client component

import React, { useState } from 'react';
import { buildPoseidon } from 'circomlibjs';
import * as snarkjs from 'snarkjs';
import { useRouter } from 'next/navigation';

//random comment

const GenerateProofForm: React.FC = () => {
  const [input, setInput] = useState({
    userAddress: '',
    depositAmount: '',
    expectedDepositHash: '',
  });

  const router = useRouter();

  const handleProveClick = () => {
    router.push('/zkFund'); // Navigate to the zkFund page
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

      const wasmFile = '/circuit/circuit.wasm';
      const zkeyFile = '/circuit/circuit_final.zkey';

      const inputs = {
        userAddress: updatedInput.userAddress,
        depositAmount: updatedInput.depositAmount,
        expectedDepositHash: updatedInput.expectedDepositHash,
      };

      const { proof, publicSignals } = await snarkjs.groth16.fullProve(
        inputs,
        wasmFile,
        zkeyFile
      );

      console.log('Proof:', proof);
      console.log('Public Signals:', publicSignals);
    } catch (error) {
      console.error('Error generating proof:', error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <div className="max-w-md w-full p-6 bg-base-100 shadow-xl rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Generate Liquidity Deposit Proof
        </h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="User Address"
            className="input input-bordered w-full"
            value={input.userAddress}
            onChange={(e) =>
              setInput({ ...input, userAddress: e.target.value })
            }
          />
        </div>

        <div className="mb-4">
          <input
            type="number"
            placeholder="Deposit Amount"
            className="input input-bordered w-full"
            value={input.depositAmount}
            onChange={(e) =>
              setInput({ ...input, depositAmount: e.target.value })
            }
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
