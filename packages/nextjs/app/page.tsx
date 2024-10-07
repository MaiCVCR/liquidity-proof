"use client";

//import { useAccount } from "wagmi";
import { GenerateProofForm } from "../components/Form";
import type { NextPage } from "next";

const Home: NextPage = () => {
  //const { address: connectedAddress } = useAccount();

  return (
    <div>
      <h1>Generate Proof Page</h1>
      <GenerateProofForm />
    </div>
  );
};

export default Home;
