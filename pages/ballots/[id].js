import React, { Component } from "react";
import ballotInstance from "../../ethereum/ballot";
import web3 from "../../ethereum/web3";
import Router from "next/router";
import { Form, Button, Input, Message, Table } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Link from "next/link";

class BallotShow extends Component {
  static async getInitialProps(props) {
    const ballotAddress = props.query.id;
    const ballot = ballotInstance(ballotAddress);
    return {
      manager: await ballot.methods.manager().call(),
      title: await ballot.methods.title().call(),
      description: await ballot.methods.description().call(),
      option1: await ballot.methods.optionName1().call(),
      option2: await ballot.methods.optionName2().call(),
      approvedVotersCount: await ballot.methods.approvedVotersCount().call(),
      ballotAddress: ballotAddress,
      ballotState: await ballot.methods.state().call(),
    };
  }

  state = {
    errorMessageVote1: "",
    errorMessgaeVote2: "",
    loadingVote1: false,
    loadingVote2: false,
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

  onVote1 = async (event) => {
    event.preventDefault();

    const ballotAddress = this.props.ballotAddress;
    const ballot = ballotInstance(ballotAddress);

    this.setState({ loadingVote1: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await ballot.methods.voteOption1().send({ from: accounts[0] });
    } catch (err) {
      this.setState({ errorMessageVote1: err.message });
    }
    this.setState({ loadingVote1: false });
  };

  onVote2 = async (event) => {
    event.preventDefault();

    const ballotAddress = this.props.ballotAddress;
    const ballot = ballotInstance(ballotAddress);

    this.setState({ loadingVote2: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await ballot.methods.voteOption2().send({ from: accounts[0] });
    } catch (err) {
      this.setState({ errorMessageVote2: err.message });
    }
    this.setState({ loadingVote2: false });
  };

  render() {
    const {
      manager,
      title,
      description,
      option1,
      option2,
      approvedVotersCount,
      ballotAddress,
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

          {this.renderBallotState()}
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
                      <Button loading={this.state.loadingVote1} secondary>
                        Vote
                      </Button>
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
                      <Button loading={this.state.loadingVote2} secondary>
                        Vote
                      </Button>
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
