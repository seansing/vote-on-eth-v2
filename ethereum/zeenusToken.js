//get instance created
import web3 from "./web3";

//tell web3 about already deployed contract by providing address and abi of deployed contract.
import ZeenusToken from "./build/contracts/ZeenusToken.json";

const instance = new web3.eth.Contract(
  ZeenusToken,
  "0x1f9061B953bBa0E36BF50F21876132DcF276fC6e"
);

export default instance;
