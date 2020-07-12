import React, { Component } from "react";
import ballotfactory from "../ethereum/ballotfactory";
import Link from "next/link";
import Layout from "../components/Layout";
import { Card, Button } from "semantic-ui-react";

class BallotIndex extends Component {
  static async getInitialProps() {
    const ballots = await ballotfactory.methods.getDeployedBallots().call();

    return { ballots };
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
