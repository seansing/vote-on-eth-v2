//get instance created
import web3 from "./web3";

//tell web3 about already deployed contract by providing address and abi of deployed contract.
import BallotFactory from "./build/contracts/BallotFactory.json";

const instance = new web3.eth.Contract(
  BallotFactory.abi,
  "0x5A1104c1836FcD08Dc786a25Ec6cd44Ed1e1157B"
);

export default instance;
