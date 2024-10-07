import { groth16 } from 'snarkjs';
import fs from 'fs/promises';
import path from 'path';

export async function generateProof(input) {
  try {
    const wasmPath = path.join(process.cwd(), 'public/circuit/circuit.wasm');
    const zkeyPath = path.join(process.cwd(), 'public/circuit/circuit_final.zkey');

    //const wasmFile = await fs.readFile(wasmPath);
    //const zkeyFile = await fs.readFile(zkeyPath);

    //console.log(zkeyFile);
    //console.log(input);

    console.log("backend 1");
    const { proof, publicSignals } = await groth16.fullProve(input, wasmPath, zkeyPath);
    console.log("backend 2");

    return { proof, publicSignals };
  } catch (error) {
    console.error('Error generating proof:', error);
    throw new Error('Error generating proof');
  }
}
