const BallotFactory = artifacts.require("BallotFactory");
const Ballot = artifacts.require("Ballot");

contract("Vote on Eth", (accounts) => {
  let [manager, person1, person2] = accounts;
  let factoryInstance;
  let ballotInstance;
  let ballotAddress;

  beforeEach(async () => {
    factoryInstance = await BallotFactory.new({ from: manager });

    await factoryInstance.createBallot(
      "President",
      "Vote for Alice or Bob",
      "Alice",
      "Bob",
      {
        from: manager,
      }
    );

    [ballotAddress] = await factoryInstance.getDeployedBallots();
    ballotInstance = await Ballot.at(ballotAddress);
  });

  it("deploys a ballot factory and a ballot", () => {
    assert.ok(factoryInstance.address);
    assert.ok(ballotInstance.address);
  });
  it("should only allow manager to start ballot", async () => {
    try {
      await ballotInstance.startBallot({ from: person1 });
    } catch (err) {
      assert(err);
    }
  });
  it("allows voters to only vote once", async () => {
    await ballotInstance.addVoter(person1, { from: manager });
    await ballotInstance.startBallot({ from: manager });
    try {
      await ballotInstance.voteOption1({ from: person1 });
      await ballotInstance.voteOption2({ from: person1 });
      assert(false, "Voter voted twice!");
    } catch (err) {
      assert(err);
    }
  });
  it("should not allow unregistered voters to vote", async () => {
    await ballotInstance.addVoter(person1, { from: manager });
    await ballotInstance.startBallot({ from: manager });
    try {
      await ballotInstance.voteOption1({ from: person2 });
      assert(false, "Unregistered voter voted!");
    } catch (err) {
      assert(err);
    }
  });
  it("should not allow voting after manager ends ballot", async () => {
    await ballotInstance.startBallot({ from: manager });
    await ballotInstance.endBallot({ from: manager });
    try {
      await ballotInstance.voteOption1({ from: person1 });
      assert(false, "Voter voted after balllot ended!");
    } catch (err) {
      assert(err);
    }
  });
  it("should only allow results to be returned after ballot ended", async () => {
    await ballotInstance.startBallot({ from: manager });
    try {
      await ballotInstance.getResults1();
    } catch (err) {
      assert(err);
    }
  });
});
