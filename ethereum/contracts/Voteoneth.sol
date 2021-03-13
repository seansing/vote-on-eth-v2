// SPDX-License-Identifier: MIT

pragma solidity >=0.5.0 <0.8.0;

contract BallotFactory {
    address[] public deployedBallotsAddress;

    function createBallot(
        string memory _title,
        string memory _description,
        string memory _option1,
        string memory _option2,
        uint256 _startTime,
        uint256 _endTime
    ) public {
        address newBallotAddress =
            address(
                new Ballot(
                    _title,
                    _description,
                    _option1,
                    _option2,
                    _startTime,
                    _endTime,
                    msg.sender
                )
            ); //to deploy another contract, it returns an address
        deployedBallotsAddress.push(newBallotAddress);
    }

    function getDeployedBallots() public view returns (address[] memory) {
        return deployedBallotsAddress;
    }
}

/// @notice create interface for an ERC20 compliant contract. Only approve and transferFrom functions are required for this dApp demo.

interface ERC20Interface {
    //use approve and transferFrom approach.
    //user will call the approve method on ZeenusToken's contract directly from the frontend as it maintains the msg.sender context
    //delegatecall will not work it will also reference the context's storage rather than the target ERC20 contract's storage
    function transferFrom(
        address from,
        address to,
        uint256 tokens
    ) external returns (bool success);
}

contract Ballot is ERC20Interface {
    //ZeenusToken's Rinkeby address
    address zeenusAddress = 0x1f9061B953bBa0E36BF50F21876132DcF276fC6e;

    //create instance of zeenus contract
    ERC20Interface zeenus = ERC20Interface(zeenusAddress);

    //Variable declarations
    enum State {Created, Voting, Ended}
    State public state;

    address public manager;
    address[] public approvedVotersList;
    uint256 public approvedVotersCount;
    uint256 public startTime;
    uint256 public endTime;
    string public title;
    string public description;
    string public optionName1;
    string public optionName2;
    uint256 private optionVoteCount1;
    uint256 private optionVoteCount2;

    mapping(address => bool) public approvedVoters;
    mapping(address => bool) private voted;

    //To keep track of number of tokens deposited by user for withdrawal/burning.
    mapping(address => uint256) private tokensDeposited;

    //Constructor to initialize variables
    //arrange similar variables together for gas optimization
    constructor(
        string memory _title,
        string memory _description,
        string memory _optionName1,
        string memory _optionName2,
        uint256 _startTime,
        uint256 _endTime,
        address creator
    ) public ERC20Interface() {
        manager = creator;
        title = _title;
        description = _description;
        optionName1 = _optionName1;
        optionName2 = _optionName2;
        startTime = _startTime;
        endTime = _endTime;
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

    modifier validTime() {
        require(
            block.timestamp >= startTime && block.timestamp <= endTime,
            "Ballot's end time has ended."
        );
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

    //ballot manager can still end the ballot at anytime
    //ballot has to call this function once the ballot has reached endTime to officiate ending.
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

    //implementation of interface function
    function transferFrom(
        address _from,
        address _to,
        uint256 _tokens
    ) public override returns (bool success) {
        require(
            zeenus.transferFrom(_from, _to, _tokens),
            "Token transfer failed."
        );
        return true;
    }

    //Public's Functions
    function voteOption1(uint256 _tokensAmount)
        public
        notVoted
        isRegistered
        inState(State.Voting)
        validTime
    {
        //call the implemented transferFrom function
        transferFrom(msg.sender, address(this), _tokensAmount);

        //Increase option 1's vote by the amount of tokens transfered
        optionVoteCount1 += _tokensAmount;

        //Increase the amount of tokens transfered
        tokensDeposited[msg.sender] += _tokensAmount;

        //Update voting status
        voted[msg.sender] = true;
    }

    function voteOption2(uint256 _tokensAmount)
        public
        notVoted
        isRegistered
        inState(State.Voting)
        validTime
    {
        //call the implemented transferFrom function
        transferFrom(msg.sender, address(this), _tokensAmount);

        //Increase option 2's vote by the amount of tokens transfered
        optionVoteCount2 += _tokensAmount;

        //Increase the amount of tokens transfered
        tokensDeposited[msg.sender] += _tokensAmount;

        //Update voting status
        voted[msg.sender] = true;
    }

    function getResults1() public view inState(State.Ended) returns (uint256) {
        return optionVoteCount1;
    }

    function getResults2() public view inState(State.Ended) returns (uint256) {
        return optionVoteCount2;
    }

    function getTotalTokens()
        public
        view
        inState(State.Ended)
        returns (uint256)
    {
        return optionVoteCount1 + optionVoteCount2;
    }
}
