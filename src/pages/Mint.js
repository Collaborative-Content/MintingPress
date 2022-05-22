import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from "react-toastify";
import { Button, Col, Container, FloatingLabel, Form, Row } from 'react-bootstrap';
import React, { useState, useRef, useEffect } from 'react';
import {v4} from 'uuid';
import { mint } from '../utils/Contracts';
import StoryBox from "../components/StoryBox";

const LOCAL_STORAGE_KEY = 'storiesApp.stories'

// TODO how do we get the storyRef here, and move handleAddStory here
export default function Mint() {

  const storyRef = useRef()

  const [fields, setFields] = useState({
    story: "",
    supply: "",
    stake:"",
    symbol: "",
    PRprice: "",
    val: "",
  })

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

  const handleInputChange = (e) => {
    setFields({
        ...fields,
        [e.target.name]:e.target.value
    })
  }

  function mintStory() {
    mint(fields.symbol, fields.supply, fields.stake, fields.PRprice, fields.story, fields.val)
    console.log("story:", fields.story, "; symbol:", fields.symbol)
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
