import { useState } from "react";
import { buildPoseidon } from "circomlibjs";
import * as snarkjs from "snarkjs";

export const GenerateProofForm = () => {
  const [input, setInput] = useState({
    userAddress: "",
    depositAmount: "",
    expectedDepositHash: "",
  });

  const calculatePoseidonHash = async () => {
    const poseidon = await buildPoseidon();
    const F = poseidon.F;

    // Convierte los inputs a BigInt
    const userAddressBigInt = BigInt(input.userAddress);
    const depositAmountBigInt = BigInt(input.depositAmount);

    // Calcula el hash con Poseidon
    const hash = poseidon([userAddressBigInt, depositAmountBigInt]);

    // Convierte el hash a un formato legible y lo almacena
    console.log(F.toString(hash));
    return F.toString(hash);
  };

  const handleGenerateProof = async () => {
    try {
      const calculatedHash = await calculatePoseidonHash();

      const updatedInput = {
        ...input,
        expectedDepositHash: calculatedHash,
      };

      // Rutas a los archivos .wasm y .zkey (deberás asegurarte de que estén en la carpeta public o accesibles)
      const wasmFile = "/circuit/circuit.wasm";
      const zkeyFile = "/circuit/circuit_final.zkey";

      // Inputs para el circuito
      const inputs = {
        userAddress: updatedInput.userAddress,
        depositAmount: updatedInput.depositAmount,
        expectedDepositHash: updatedInput.expectedDepositHash,
      };

      // Generación de la prueba en el frontend
      const { proof, publicSignals } = await snarkjs.groth16.fullProve(inputs, wasmFile, zkeyFile);

      console.log("Proof:", proof);
      console.log("Public Signals:", publicSignals);
    } catch (error) {
      console.error("Error generating proof:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200">
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

        <button className="btn btn-primary w-full" onClick={handleGenerateProof}>
          Generate Proof
        </button>
      </div>
    </div>
  );
};
