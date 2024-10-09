"use client"; // This ensures the component is treated as a client component

import React from 'react';
import { useRouter } from 'next/navigation';

const ZkFundComponent: React.FC = () => {
  const router = useRouter();

  const handleProveClick = () => {
    router.push('/generate-proof'); // Navigate to the Generate Proof page
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-base-200">
      <div className="max-w-md w-full p-6 bg-base-100 shadow-xl rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome to the zkFund!</h2>

        <div className="mb-4 text-center">
          <p className="text-lg">Current deposit value: $0</p>
        </div>

        <div className="flex justify-center gap-4">
          <button className="btn btn-primary">Deposit</button>
          <button className="btn btn-secondary">Withdraw</button>
          <button className="btn btn-accent" onClick={handleProveClick}>
            Prove
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZkFundComponent;
