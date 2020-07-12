import React, { Component } from "react";
import ballotInstance from "../../../ethereum/ballot";
import web3 from "../../../ethereum/web3";
import Router from "next/router";
import { Card, Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "../../../components/Layout";
import Link from "next/link";

class BallotAdmin extends Component {
  static async getInitialProps(props) {
    const ballot = ballotInstance(props.query.add);
    const ballotAddress = props.query.add;
    return {
      title: await ballot.methods.title().call(),
      approvedVotersCount: await ballot.methods.approvedVotersCount().call(),
      ballotAddress: ballotAddress,
      ballotState: await ballot.methods.state().call(),
      /*votersList: await ballot.methods.getVotersList().call(),*/
    };
  }

  state = {
    title: "",
    newVoterAddress: "",
    errorMessageAddVoter: "",
    errorMessageVoteStart: "",
    errorMessageVoteEnd: "",
    loadingAddVoter: false,
    loadingVoteStart: false,
    loadingVoteEnd: false,
  };

  renderBallotState() {
    if (this.props.ballotState === "0") {
      return "Voting has not started";
    } else if (this.props.ballotState === "1") {
      return "Voting is in progress";
    } else {
      return "Voting has ended";
    }
  }

  /* renderVoters() {
    const voters = this.props.votersList.map((address) => {
      return {
        header: address,
        fluid: true,
      };
    });
    return <Card.Group items={voters} />;
  } */

  onAddVoter = async (event) => {
    event.preventDefault();

    this.setState({ loadingAddVoter: true, errorMessageVoteStart: "" });

    const ballot = await ballotInstance(this.props.ballotAddress);
    const accounts = await web3.eth.getAccounts();

    try {
      await ballot.methods.addVoter(this.state.newVoterAddress).send({
        from: accounts[0],
      });
    } catch (err) {
      this.setState({ errorMessageAddVoter: err.message });
    }

    this.setState({ loadingAddVoter: false });
  };

  onStartVote = async (event) => {
    event.preventDefault();

    this.setState({ loadingVoteStart: true, errorMessageVoteStart: "" });

    const ballot = await ballotInstance(this.props.ballotAddress);
    const accounts = await web3.eth.getAccounts();

    try {
      await ballot.methods.startBallot().send({
        from: accounts[0],
      });
    } catch (err) {
      this.setState({ errorMessageVoteStart: err.message });
    }

    this.setState({ loadingVoteStart: false });
  };

  onEndVote = async (event) => {
    event.preventDefault();

    this.setState({ loadingVoteEnd: true, errorMessageVoteStart: "" });

    const ballot = await ballotInstance(this.props.ballotAddress);
    const accounts = await web3.eth.getAccounts();

    try {
      await ballot.methods.endBallot().send({
        from: accounts[0],
      });
    } catch (err) {
      this.setState({ errorMessageVoteStart: err.message });
    }

    this.setState({ loadingVoteEnd: false });
  };

  render() {
    const { title, approvedVotersCount, ballotAddress } = this.props;

    return (
      <Layout>
        <Link href={`/ballots/${ballotAddress}`}>
          <a>
            <img id="backArrow" src="/back.svg" alt="back" width="20" />
          </a>
        </Link>
        <div className="pageContainer">
          <h2>Administrative Page for {title} Ballot</h2>
          <h4>
            Only the ballot administrator is allowed to start and end the voting
            process and add approved voters to this ballot.
          </h4>
          <hr />
          <h4>Ballot state</h4>
          <Card centered>
            <Card.Content
              header={"Current state : " + this.renderBallotState()}
            />
            <Card.Content
              description={
                <div className="stateButtons">
                  <Form
                    onSubmit={this.onStartVote}
                    error={!!this.state.errorMessageVoteEnd}
                  >
                    <Button loading={this.state.loadingVoteStart}>
                      Start Voting
                    </Button>
                    <Message
                      error
                      header="Oops!"
                      content={this.state.errorMessageVoteStart}
                    />
                  </Form>

                  <Form
                    onSubmit={this.onEndVote}
                    error={!!this.state.errorMessageVoteEnd}
                  >
                    <Button loading={this.state.loadingVoteEnd}>
                      End Voting
                    </Button>
                    <Message
                      error
                      header="Oops!"
                      content={this.state.errorMessageVoteEnd}
                    />
                  </Form>
                </div>
              }
            />
          </Card>
          <hr />
          <h4>Voters</h4>
          <div className="addVoterForm">
            <h4>Total approved voters: {approvedVotersCount}</h4>
            <h4>Total votes received: </h4>
            <Form
              onSubmit={this.onAddVoter}
              error={!!this.state.errorMessageAddVoter}
            >
              <Form.Field>
                <label>Address</label>
                <Input
                  value={this.state.newVoterAddress}
                  onChange={(event) =>
                    this.setState({ newVoterAddress: event.target.value })
                  }
                />
              </Form.Field>
              <Message
                error
                header="Oops!"
                content={this.state.errorMessageAddVoter}
              />
              <div className="button">
                <Button loading={this.state.loadingAddVoter} secondary>
                  Add Voter
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </Layout>
    );
  }
}

export default BallotAdmin;
