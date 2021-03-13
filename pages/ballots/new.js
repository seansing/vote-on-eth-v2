import React, { Component } from "react";
import ballotFactory from "../../ethereum/ballotfactory";
import web3 from "../../ethereum/web3";
import Router from "next/router";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Layout from "../../components/Layout";
import Link from "next/link";

class BallotNew extends Component {
  state = {
    title: "",
    description: "",
    startDate: 0,
    endDate: 0,
    option1: "",
    option2: "",
    errorMessage: "",
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault(); //prevent browser from refreshing after submitting form

    this.setState({ loading: true, errorMessage: "" });

    try {
      const accounts = await web3.eth.getAccounts();
      await ballotFactory.methods
        .createBallot(
          this.state.title,
          this.state.description,
          this.state.option1,
          this.state.option2,
          this.state.startDate,
          this.state.endDate
        )
        .send({
          from: accounts[0],
        });
      //route user to root page of application
      Router.push("/#existingBallotsSection");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
  };

  onChangeStartDate = (e) => {
    let epoch = Date.parse(e.target.value);
    this.setState({startDate:epoch/1000});
  }
  onChangeEndDate = (e) => {
    let epoch = Date.parse(e.target.value);
    this.setState({endDate:epoch/1000});
  }
  checkState = () => {
    console.log(this.state.startDate); 
    console.log(this.state.endDate);
  }

  render() {
    return (
      <Layout>
        <Link href="/">
          <a>
            <img id="backArrow" src="/back.svg" alt="back" width="20" />
          </a>
        </Link>
        <div className="pageContainer">
          <h2>New Ballot Form</h2>
          <hr />
          <h4>
            Please provide your ballot with a title, description, start and end dates and two options
            to vote from.
          </h4>
          <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
            <Form.Field>
              <label>Title</label>
              <Input
                value={this.state.title}
                onChange={(event) =>
                  this.setState({ title: event.target.value })
                }
              />
              <label>Description</label>
              <Input
                value={this.state.description}
                onChange={(event) =>
                  this.setState({ description: event.target.value })
                }
              />
              <label for="ballotStart">Start date:</label>
              <input onChange={this.onChangeStartDate} type="datetime-local" id="ballotStart" name="ballotStart"></input>
              <label for="ballotEnd">End date:</label>
              <input onChange={this.onChangeEndDate}type="datetime-local" id="ballotEnd" name="ballotEnd"></input>
              
              <label>Option 1</label>
              <Input
                value={this.state.option1}
                onChange={(event) =>
                  this.setState({ option1: event.target.value })
                }
              />
              <label>Option 2</label>
              <Input
                value={this.state.option2}
                onChange={(event) =>
                  this.setState({ option2: event.target.value })
                }
              />
            </Form.Field>
            <Message error header="Oops!" content={this.state.errorMessage} />
            <div className="button">
              <Button loading={this.state.loading} secondary>
                Create Ballot
              </Button>
            </div>
          </Form>
        </div>
      </Layout>
    );
  }
}

export default BallotNew;
