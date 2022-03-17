import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-toastify";
import { Container, Button, Form, Col, Row, FloatingLabel } from 'react-bootstrap';
import React, { useState, useRef, useEffect } from 'react';
import {v4} from 'uuid';
import { mint } from '../utils/Contracts';
import StoryBox from "../components/StoryBox";

const LOCAL_STORAGE_KEY = 'storiesApp.stories'

// TODO how do we get the storyRef here, and move handleAddStory here
export default function Mint() {

  const storyRef = useRef()

  const [fields, setFields] = useState({
    story: "this is the story",
    supply: "",
    stake:"",
    symbol: "",
    PRprice: "",
    val: "",
  })

  const handleInputChange = (e) => {
      setFields({
          ...fields,
          [e.target.name]:e.target.value
      })
  }

  // useEffect(() => {
  //   const storedStories = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
  //   if (storedStories) setStories(storedStories)
  // }, [])

  // need this to persist across page reload inside local browser
  // first param is function that will run, second param is the trigger.
  // in this case any time array of todos changes, the effect is run.
  // useEffect(() => {
  //   localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stories))
  // }, [stories])

  function mintStory() {
    mint(fields.symbol, fields.supply, fields.stake, fields.PRprice, fields.story, fields.val)
    console.log(fields.story)
    console.log(fields.symbol)
  }

  return (
      <>
      <Container> 
      <FloatingLabel controlId="floatingTextarea2" label="Story">
        <Form.Control
          as="textarea"
          placeholder="Leave a comment here"
          style={{ height: '600px' }}
          name="story"
          value={fields.story}
          onChange={handleInputChange}
        />
      </FloatingLabel>
      </Container>
      <Container> 
      
{/* from rahul's react branch */}
{/* import React from "react";
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
      <Container>  */}

      <Row className="mb-3">
    <Form.Group as={Col} controlId="formGridTokenSymbol">
      <Form.Label>Token Symbol</Form.Label>
      <Form.Control
          name="symbol"
          value={fields.symbol}
          onChange={handleInputChange}
        />
    </Form.Group>

    <Form.Group as={Col} controlId="formGridSupply">
    <Form.Label>Supply</Form.Label>
      <Form.Control 
          name="supply"
          value={fields.supply}
          onChange={handleInputChange}
        />
    </Form.Group>

    <Form.Group as={Col} controlId="formGridOwnerStake">
      <Form.Label>Owner Stake</Form.Label>
      <Form.Control 
          name="stake"
          value={fields.stake}
          onChange={handleInputChange}
        />
    </Form.Group>

    <Form.Group as={Col} controlId="formGridMinPRPrice">
      <Form.Label>Min PR Price</Form.Label>
      <Form.Control 
          name="PRprice"
          value={fields.PRprice}
          onChange={handleInputChange}
        />
    </Form.Group>

    <Form.Group as={Col} controlId="formGridETH">
      <Form.Label>ETH Value</Form.Label>
      <Form.Control 
          name="val"
          value={fields.val}
          onChange={handleInputChange}
        />
    </Form.Group>

  </Row>
  </Container>
      <Container>
        <Button
          variant="primary"
          type="submit"
          className="btn-block"
          onClick={mintStory}
        >
          Mint Your Story!
        </Button>
      </Container>
    </>
  );
}
