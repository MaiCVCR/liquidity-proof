import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy the Groth16Verifier contract
  const verifierDeployment = await deploy("Groth16Verifier", {
    from: deployer,
    contract: "contracts/verifier.sol:Groth16Verifier",
    log: true,
    autoMine: true,
  });

  // Deploy the ZKFundingContract contract and pass the address of the deployed verifier as an argument
  await deploy("ZKFundingContract", {
    from: deployer,
    args: [verifierDeployment.address], // Pass the address of the deployed verifier
    log: true,
    autoMine: true,
  });

  console.log("✅ Contracts deployed successfully");
};

export default deployContracts;

deployContracts.tags = ["Groth16Verifier", "ZKFundingContract"];
