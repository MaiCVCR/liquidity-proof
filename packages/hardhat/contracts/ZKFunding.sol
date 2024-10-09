// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "hardhat/console.sol";

// Interface to zk-SNARK verifier contract
interface Groth16Verifier {
    function verifyProof(
        uint[2] calldata _pA, 
        uint[2][2] calldata _pB, 
        uint[2] calldata _pC, 
        uint[1] calldata _pubSignals
    ) external view returns (bool);    
}

contract ZKFundingContract {
    address public owner;
    Groth16Verifier public zkVerifier; // Groth16 verifier contract

    struct Deposit {
        uint256 amount;
        uint256 pubSignal; // Public signal for zk proof verification
    }

    // Mapping for array of depositor addresses
    mapping(address => Deposit[]) public deposits;

    // Array to store all addresses that have deposited
    address[] public depositors;

    // Event for successful deposit
    event DepositMade(address indexed user, uint256 amount, uint256 pubSignal);

    // Event for successful withdrawal
    event Withdrawal(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    // Initialize the contract with the address of the zk-SNARK verifier contract
    constructor(address _zkVerifier) {
        owner = msg.sender;
        zkVerifier = Groth16Verifier(_zkVerifier);
    }

    // Function to deposit ETH into the contract along with a zk-proof
    function depositFunds(uint256 pubSignal) external payable {
        require(msg.value > 0, "Must send ETH to deposit");

        // Store the deposit information (with public signal for verification)
        deposits[msg.sender].push(Deposit({
            amount: msg.value,
            pubSignal: pubSignal
        }));

        // Add depositor to list if first-time deposit
        if (deposits[msg.sender].length == 1) {
            depositors.push(msg.sender);
        }

        // Emit deposit event
        emit DepositMade(msg.sender, msg.value, pubSignal);
    }

    // Function to verify zk-proof for a given deposit
    function verifyProof(
        address depositor,
        uint256 index,
        uint[2] calldata _pA,
        uint[2][2] calldata _pB,
        uint[2] calldata _pC,
        uint[1] calldata _pubSignals
    ) external view returns (bool) {
        require(index < deposits[depositor].length, "Invalid deposit index");

        Deposit memory deposit = deposits[depositor][index];

        // Verify the zk-proof with the external zk-SNARK verifier, using deposit's public signal
        bool valid = zkVerifier.verifyProof(_pA, _pB, _pC, _pubSignals);

        require(valid, "Invalid zk-proof");
        return valid;
    }

    // Function to allow the owner to withdraw all funds
    function withdrawFunds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds available to withdraw");

        // Transfer the contract balance to the owner
        payable(owner).transfer(balance);

        // Emit withdrawal event
        emit Withdrawal(owner, balance);
    }

    // Retrieve all depositors
    function getAllDepositors() external view returns (address[] memory) {
        return depositors;
    }

    // Retrieve all deposits for a specific address
    function getDeposits(address depositor) external view returns (Deposit[] memory) {
        return deposits[depositor];
    }
}
