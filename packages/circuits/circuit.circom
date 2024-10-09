pragma circom 2.1.6;

include "circomlib/poseidon.circom";

template LiquidityDepositCheck() {

    signal input expectedDepositHash;    
    signal input userAddress;
    signal input depositAmount;
    signal output valid;

    component hasher = Poseidon(2);
    hasher.inputs[0] <== userAddress;
    hasher.inputs[1] <== depositAmount;

    signal hashedInput;
    hashedInput <== hasher.out;

    signal difference;
    difference <== expectedDepositHash - hashedInput;    

    valid <== 1 - difference * difference;

    expectedDepositHash === hashedInput;

}

component main = LiquidityDepositCheck();

/* INPUT = {
    "userAddress": "0x1F658AF12F5a0D72e4652f53399e556B9dB23904",   
    "depositAmount": "77",
    "expectedDepositHash": "10498113131465187611389739299725499724323348692756369634100151577008307298304"
} */