//get instance created
import web3 from "./web3";

//tell web3 about already deployed contract by providing address and abi of deployed contract.
import BallotFactory from "./artifacts/contracts/Voteoneth.sol/BallotFactory.json";

const instance = new web3.eth.Contract(
  BallotFactory.abi,
  "0x2857f6737EaF0d04b94A89159d2270bEd7aeae3d"
);

export default instance;
