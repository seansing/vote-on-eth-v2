pragma solidity >=0.5.0 <0.6.8;


contract BallotFactory {
    address[] public deployedBallotsAddress;

    function createBallot(
        string memory _title,
        string memory _description,
        string memory _option1,
        string memory _option2
    ) public {
        address newBallotAddress = address(
            new Ballot(_title, _description, _option1, _option2, msg.sender)
        ); //to deploy another contract, it returns an address
        deployedBallotsAddress.push(newBallotAddress);
    }

    function getDeployedBallots() public view returns (address[] memory) {
        return deployedBallotsAddress;
    }
}


contract Ballot {
    //Variable declarations
    enum State {Created, Voting, Ended}
    State public state;

    address public manager;
    address[] public approvedVotersList;
    uint256 public approvedVotersCount;
    string public title;
    string public description;
    string public optionName1;
    string public optionName2;
    uint256 private optionVoteCount1;
    uint256 private optionVoteCount2;

    mapping(address => bool) public approvedVoters;
    mapping(address => bool) private voted;

    //Constructor to initialize variables
    constructor(
        string memory _title,
        string memory _description,
        string memory _optionName1,
        string memory _optionName2,
        address creator
    ) public {
        manager = creator;
        title = _title;
        description = _description;
        optionName1 = _optionName1;
        optionName2 = _optionName2;
        state = State.Created;
    }

    //Modifiers
    modifier onlyManager {
        require(msg.sender == manager);
        _;
    }

    modifier notVoted {
        require(voted[msg.sender] == false);
        _;
    }

    modifier inState(State _state) {
        require(state == _state);
        _;
    }

    modifier isRegistered() {
        require(approvedVoters[msg.sender] == true);
        _;
    }

    //Manager's Functions
    function addVoter(address _voter)
        public
        onlyManager
        inState(State.Created)
    {
        approvedVoters[_voter] = true;
        approvedVotersList.push(_voter);
        approvedVotersCount++;
    }

    function startBallot() public onlyManager inState(State.Created) {
        state = State.Voting;
    }

    function endBallot() public onlyManager inState(State.Voting) {
        state = State.Ended;
    }

    function getVotersList()
        public
        view
        inState(State.Ended)
        returns (address[] memory)
    {
        return approvedVotersList;
    }

    //Public's Functions
    function voteOption1() public notVoted isRegistered inState(State.Voting) {
        optionVoteCount1++;
        voted[msg.sender] = true;
    }

    function voteOption2() public notVoted isRegistered inState(State.Voting) {
        optionVoteCount2++;
        voted[msg.sender] = true;
    }

    //Get results function
    function getResults1() public view inState(State.Ended) returns (uint256) {
        return optionVoteCount1;
    }

    function getResults2() public view inState(State.Ended) returns (uint256) {
        return optionVoteCount2;
    }
}
