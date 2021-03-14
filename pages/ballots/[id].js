import React, { Component } from "react";
import ballotInstance from "../../ethereum/ballot";
import web3 from "../../ethereum/web3";
import zeenusToken from "../../ethereum/zeenusToken";
import { Form, Button, Input, Message, Table } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Link from "next/link";

class BallotShow extends Component {
  static async getInitialProps(props) {
    const ballotAddress = props.query.id;
    const ballot = ballotInstance(ballotAddress);

    const checkState = await ballot.methods.state().call();
    let resultsVote1;
    let resultsVote2;

    if (checkState === "2") {
      resultsVote1 = await ballot.methods.getResults1().call();
      resultsVote2 = await ballot.methods.getResults2().call();
    } else {
      resultsVote1 = 0;
      resultsVote2 = 0;
    }

    return {
      manager: await ballot.methods.manager().call(),
      title: await ballot.methods.title().call(),
      description: await ballot.methods.description().call(),
      option1: await ballot.methods.optionName1().call(),
      option2: await ballot.methods.optionName2().call(),
      approvedVotersCount: await ballot.methods.approvedVotersCount().call(),
      ballotAddress: ballotAddress,
      ballotState: await ballot.methods.state().call(),
      ballotStartTime: await ballot.methods.startTime().call(),
      ballotEndTime: await ballot.methods.endTime().call(),
      resultsVote1: resultsVote1,
      resultsVote2: resultsVote2
    };
  }

  state = {
    errorMessageVote1: "",
    errorMessageVote2: "",
    errorMessageApprove: "",
    loadingVote1: false,
    loadingVote2: false,
    loadingApprove: false,
    tokensApproved: 0
  };

  renderBallotState() {
    if (this.props.ballotState === "0") {
      return <Message warning>Voting has not started</Message>;
    } else if (this.props.ballotState === "1") {
      return <Message positive>Voting is in progress</Message>;
    } else {
      return <Message info>Voting has ended</Message>;
    }
  }

  renderVotingButtonOrResult1() {
    if (this.props.ballotState === "2"  ) {
      return <h2 style={{margin: "0"}}>{this.props.resultsVote1} Token Votes</h2>;
    } else {
      return <Button loading={this.state.loadingVote1} secondary>
      Vote
    </Button>;
    }
  }
  renderVotingButtonOrResult2() {
    if (this.props.ballotState === "2"  ) {
      return <h2 style={{margin: "0"}}>{this.props.resultsVote2} Token Votes</h2>;
    } else {
      return <Button loading={this.state.loadingVote2} secondary>
      Vote
    </Button>;
    }
  }
  

  onInput = (event) => {
    this.setState({tokensApproved: event.target.value});
    console.log(event.target.value);
  }

  approveZeenus = async (event) => {
    event.preventDefault();

    console.log("testing")
    this.setState({ loadingApprove: true, errorMessageApprove: "" });
    
    try {
      const accounts = await web3.eth.getAccounts();
      await zeenusToken.methods.approve(this.props.ballotAddress, this.state.tokensApproved).send({ from: accounts[0] });
      console.log("success");
    } catch (err) {
      this.setState({ errorMessageApprove: err.message });
      console.log("fail");
    }
    this.setState({ loadingApprove: false });
  }

  onVote1 = async (event) => {
    event.preventDefault();

    const ballotAddress = this.props.ballotAddress;
    const ballot = ballotInstance(ballotAddress);

    this.setState({ loadingVote1: true, errorMessageVote1: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await ballot.methods.voteOption1(this.state.tokensApproved).send({ from: accounts[0] });
    } catch (err) {
      this.setState({ errorMessageVote1: err.message });
    }
    this.setState({ loadingVote1: false });
  };

  onVote2 = async (event) => {
    event.preventDefault();

    const ballotAddress = this.props.ballotAddress;
    const ballot = ballotInstance(ballotAddress);

    this.setState({ loadingVote2: true, errorMessageVote2: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await ballot.methods.voteOption2(this.state.tokensApproved).send({ from: accounts[0] });
    } catch (err) {
      this.setState({ errorMessageVote2: err.message });
    }
    this.setState({ loadingVote2: false });
  };

  getDate = (epochDate) => {
    var d = new Date(epochDate * 1000).toLocaleString();
    return d;
  }

  render() {
    const {
      manager,
      title,
      description,
      option1,
      option2,
      approvedVotersCount,
      ballotAddress,
      ballotState,
      ballotStartTime,
      ballotEndTime,
      getResults1
    } = this.props;

    return (
      <Layout>
        <Link href="/">
          <a>
            <img id="backArrow" src="/back.svg" alt="back" width="20" />
          </a>
        </Link>
        <div className="pageContainer">
          <h2>{title} Ballot</h2>
          <h3>Ballot start time : {this.getDate(ballotStartTime)}</h3>
          <h3>Ballot end time : {this.getDate(ballotEndTime)}</h3>

          {this.renderBallotState()}
          <hr />
          <div className="voteTableSection">
            <h4>This ballot uses the 'approve and transferFrom' approach for receiving ERC20 tokens as votes.</h4>
            <h4>Please set and approve the number of ZEENUS tokens you wish cast as votes.</h4>
            <h4>Once the transaction is successful, you may proceed to cast your vote based on the number of tokens you approved.</h4>
            <Form
              onSubmit={this.approveZeenus}
              error={!!this.state.errorMessageApprove}
            >
              <Input
                label={{ basic: true, content: 'ZEENUS' }}
                labelPosition='right'
                placeholder='Enter number of tokens to approve.'
                onChange={this.onInput}
                style={{marginRight:"100px"}}
              />
              <Button loading={this.state.loadingApprove}>Approve</Button>
              <Message
                          error
                          header="Oops!"
                          content={this.state.errorMessageApprove}
                        />
              </Form>
          </div>
          <hr />
          <div className="voteTableSection">
            <h4>{description}</h4>
            <Form
              onSubmit={this.onVote1}
              error={!!this.state.errorMessageVote1}
            >
              <Table>
                <Table.Body>
                  <Table.Row textAlign="center">
                    <Table.Cell width={1}>
                      <h3>{option1}</h3>
                    </Table.Cell>
                    <Table.Cell width={1}>
                      {this.renderVotingButtonOrResult1()}
                      <Message
                        error
                        header="Oops!"
                        content={this.state.errorMessageVote1}
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Form>
            <Form
              onSubmit={this.onVote2}
              error={!!this.state.errorMessageVote2}
            >
              <Table>
                <Table.Body>
                  <Table.Row textAlign="center">
                    <Table.Cell width={1}>
                      <h3>{option2}</h3>
                    </Table.Cell>
                    <Table.Cell width={1}>
                    {this.renderVotingButtonOrResult2()}
                      <Message
                        error
                        header="Oops!"
                        content={this.state.errorMessageVote2}
                      />
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Form>
          </div>
          <hr />
          <h4>Ballot Address: {this.props.ballotAddress}</h4>
          <h4>Administrator : {manager}</h4>
          <Link href={`/ballots/admin/${ballotAddress}`}>
            <Button>Admin Page</Button>
          </Link>
        </div>
      </Layout>
    );
  }
}

export default BallotShow;
