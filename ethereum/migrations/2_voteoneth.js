const BallotFactory = artifacts.require("BallotFactory");

module.exports = function (deployer) {
  deployer.deploy(BallotFactory);
};
