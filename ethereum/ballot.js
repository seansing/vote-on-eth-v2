import web3 from "./web3";
import Ballot from "./artifacts/contracts/Voteoneth.sol/Ballot.json";

//We need to dynamically receive address.

export default (address) => {
  return new web3.eth.Contract(Ballot.abi, address);
};
