"use client"; // This ensures the component is treated as a client component

import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  const handleZkFundClick = () => {
    router.push('/zkFund');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-base-200">
      <div className="max-w-md w-full p-6 bg-base-100 shadow-xl rounded-lg text-center">
        <h1 className="text-3xl font-bold mb-4">zkFund Home</h1>
        <button className="btn btn-primary w-full" onClick={handleZkFundClick}>
          Go to zkFund
        </button>
      </div>
    </div>
  );
};

export default Home;
