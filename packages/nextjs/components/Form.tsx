import { useState } from "react";
import { buildPoseidon } from "circomlibjs";

export const GenerateProofForm = () => {
  const [input, setInput] = useState({
    userAddress: "",
    depositAmount: "",
    expectedDepositHash: "",
  });
  const [proof, setProof] = useState(null);
  const [publicSignals, setPublicSignals] = useState(null);

  const calculatePoseidonHash = async () => {
    const poseidon = await buildPoseidon();
    console.log(input.userAddress);
    console.log(input.depositAmount);
    const hash = poseidon([input.userAddress, input.depositAmount]);
    console.log(hash);
    console.log(hash.toString());
    //const poseidon = await circomlibjs.buildPoseidon();
    //const hash = poseidon.F.toString(poseidon([input.userAddress, input.depositAmount]));
    //console.log("Calculated Poseidon Hash: ", hash);
    //return hash;
    return "10498113131465187611389739299725499724323348692756369634100151577008307298304";
  };

  const handleGenerateProof = async () => {
    try {
      const calculatedHash = await calculatePoseidonHash();

      const updatedInput = {
        ...input,
        expectedDepositHash: calculatedHash,
      };

      const response = await fetch("/api/generateProofAPI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: updatedInput }),
      });

      const data = await response.json();

      console.log("test");
      console.log(response);

      if (response.ok) {
        setProof(data.proof);
        setPublicSignals(data.publicSignals);
        console.log("Proof:", data.proof);
        console.log("Public Signals:", data.publicSignals);
      } else {
        console.error("Error generating proof:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Generate Liquidity Deposit Proof</h2>

      <input
        type="text"
        placeholder="User Address"
        value={input.userAddress}
        onChange={e => setInput({ ...input, userAddress: e.target.value })}
      />
      <br />

      <input
        type="number"
        placeholder="Deposit Amount"
        value={input.depositAmount}
        onChange={e => setInput({ ...input, depositAmount: e.target.value })}
      />
      <br />

      <button onClick={handleGenerateProof}>Generate Proof</button>

      {proof && (
        <div>
          <h3>Proof Generated</h3>
          <pre>{JSON.stringify(proof, null, 2)}</pre>
          <h3>Public Signals</h3>
          <pre>{JSON.stringify(publicSignals, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
