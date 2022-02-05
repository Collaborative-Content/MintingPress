import "bootstrap/dist/css/bootstrap.min.css";
import StoryBox from "../components/StoryBox";
import { Container, Button, Row, Form, Col } from "react-bootstrap";
import { toast } from "react-toastify";

import React from "react";
// TODO how do we get the storyRef here, and move handleAddStory here
export default function Mint() {
  const mint = () => {
    setTimeout(() => {
      toast("Your story has been minted!");
    }, 1000);
  };

  return (
    <>
      <Container>
        <div className="text-center">
          <img
            style={{ height: "200px", margin: "20px auto", width: "200px" }}
            src="https://cdn.discordapp.com/attachments/931173500289437817/937359950659858512/pp2.png"
          />
        </div>

        <StoryBox story={""} />
      </Container>
      <Container> 
      <Row className="mb-3">
    <Form.Group as={Col} controlId="formGridTokenSymbol">
      <Form.Label>Token Symbol</Form.Label>
      <Form.Control />
    </Form.Group>

    <Form.Group as={Col} controlId="formGridSupply">
    <Form.Label>Supply</Form.Label>
      <Form.Control />
    </Form.Group>

    <Form.Group as={Col} controlId="formGridOwnerStake">
      <Form.Label>Owner Stake</Form.Label>
      <Form.Control />
    </Form.Group>

    <Form.Group as={Col} controlId="formGridMinPRPrice">
      <Form.Label>Min PR Price</Form.Label>
      <Form.Control />
    </Form.Group>

    <Form.Group as={Col} controlId="formGridETH">
      <Form.Label>ETH Value</Form.Label>
      <Form.Control />
    </Form.Group>

  </Row>
  </Container>
      <Container>
        <Button
          variant="primary"
          type="submit"
          className="btn-block"
          onClick={mint}
        >
          Mint Your Story!
        </Button>
      </Container>
    </>
  );
}
