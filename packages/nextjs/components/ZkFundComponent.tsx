import React, { useState, useRef } from 'react';
import { GenerateProofForm } from './Form';

export const ZkFundComponent: React.FC = () => {
  const [currentDepositValue, setCurrentDepositValue] = useState<number>(0);
  const proofFormRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    if (proofFormRef.current) {
      proofFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-base-200">
      {/* First Section */}
      <div className="flex flex-grow justify-center items-center">
        <div className="max-w-md w-full p-6 bg-base-100 shadow-xl rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-center">Welcome to the zkFund!</h2>

          <div className="mb-4 text-center">
            <p className="text-lg">Current deposit value: ${currentDepositValue}</p>
          </div>

          <div className="flex justify-center gap-4">
            <button className="btn btn-primary">Deposit</button>
            <button className="btn btn-secondary">Withdraw</button>
            <button className="btn btn-accent" onClick={scrollToForm}>Prove</button> {/* Scrolls to form */}
          </div>
        </div>
      </div>

      {/* Second Section (Form) */}
      <div ref={proofFormRef}>
        <GenerateProofForm /> {/* The form is rendered here */}
      </div>
    </div>
  );
};
