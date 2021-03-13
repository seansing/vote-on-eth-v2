import React, { Component } from "react";
import ballotfactory from "../ethereum/ballotfactory";
import web3 from "../ethereum/web3";
import zeenusToken from "../ethereum/zeenusToken";
import Link from "next/link";
import Layout from "../components/Layout";
import { Card, Button, Message, Form } from "semantic-ui-react";

class BallotIndex extends Component {
  static async getInitialProps() {
    const ballots = await ballotfactory.methods.getDeployedBallots().call();
    return { ballots };
  }
  state = {
    loadingRequest: false, 
    errorMessage: ""
  }
  renderBallots() {
    const items = this.props.ballots.map((address) => {
      return {
        header: address,
        description: (
          <Link href={`/ballots/${address}`}>
            <a>
              <Button secondary>View Ballot</Button>
            </a>
          </Link>
        ),
        fluid: true,
      };
    });

    return <Card.Group items={items} />;
  }

  requestZeenus = async (event) => {
    event.preventDefault();

    console.log("called requesst zeenus");

    this.setState({ loadingRequest: true, errorMessage: "" });

    const zeenusAddress = "0x1f9061B953bBa0E36BF50F21876132DcF276fC6e";

    try {
      const accounts = await web3.eth.getAccounts();
      await web3.eth.sendTransaction({to: zeenusAddress, from: accounts[0], value: 0});
      console.log("success")

    } catch (err) {
      this.setState({ errorMessage: err.message });
      console.log("fail");
    }
    this.setState({ loadingRequest: false });
  };

  render() {
    return (
      <Layout>
        <div className="pageContainer">
          <main>
            <section className="landing">
              <h1 className="title">Vote-On-Eth</h1>
              <p className="description">
                a decentralized voting application
                <br />
                powered by Ethereum
                <br />
              </p>
              <div>
                <img
                  id="voteonethimage"
                  src="/voteonethimage.svg"
                  alt="voteoneth"
                />
              </div>
              <div className="landingButtons">
                <Link href="/ballots/new">
                  <a>
                    <Button secondary> Create a Ballot </Button>
                  </a>
                </Link>
                <Link href="/#existingBallotsSection">
                  <a>
                    <Button content="View Existing Ballots" />
                  </a>
                </Link>
              </div>
            </section>

            <section id="howToSection">
                <h2>How does it work?</h2>
                <div className="howToDescribe">
                  <p>Vote-On-Eth utilizes ERC20 tokens as voting weights for all ballots.</p>
                  <p>Currently, only the Zeenus Token is supported.</p>
                  <p>Don't own any ZEENUS? Don't Worry!</p>
                  <p>Get a free supply of 1000 ZEENUS by clicking the button bellow.</p>
                  <p>Once the transaction is successful, check for your balance at Zeenus Token's contract {""}
                    <a href="https://rinkeby.etherscan.io/address/0x1f9061B953bBa0E36BF50F21876132DcF276fC6e#readContract" target="_blank" style={{display:"inline", float: "none"}}>
                     here.
                    </a>
                </p>
                </div>
                <Form
              onSubmit={this.requestZeenus}
              error={!!this.state.errorMessage}
              style={{marginTop: "20px", marginBottom: "20px"}}
            >
                <Button loading={this.state.loadingRequest} secondary>
                        Request 1000 ZENUS
                </Button>
                <Message
                        error
                        header="Oops!"
                        content={this.state.errorMessage}
                      />

                </Form>

            </section>
            <section id="existingBallotsSection">
              <h2>Existing Ballots (by address)</h2>
              {this.renderBallots()}
            </section>
          </main>

          <footer>
            <a
              href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by{" "}
              <img src="/vercel.svg" alt="Vercel Logo" className="logo" />
            </a>
          </footer>
        </div>
      </Layout>
    );
  }
}

export default BallotIndex;
