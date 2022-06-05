import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Form, Col, Card, Stack } from 'react-bootstrap';
import React, { useState, useRef } from 'react';
import { mint } from '../utils/Contracts';

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
          <Card className='darkCard mx-auto shadow-sm' style={{maxWidth: '800px'}}>
            <Card.Header>Create a Story</Card.Header>

            <Card.Body>
              <Form>
                <Form.Group as={Col} controlId="formGridCreateStory" className='mb-2'>
                  <Form.Control
                    as="textarea"
                    placeholder="Once upon a time..."
                    name="story"
                    value={fields.story}
                    onChange={handleInputChange}
                    className='mb-2'
                    style={{height: '25vh'}}
                  />
                </Form.Group>

                <Stack direction='horizontal' className='gap-3 mb-2'>
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
                </Stack>

                <Form.Group as={Col} controlId="formGridOwnerStake" className='mb-2'>
                  <Form.Label>Owner Stake</Form.Label>

                  <Form.Control 
                    name="stake"
                    value={fields.stake}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridMinPRPrice" className='mb-2'>
                  <Form.Label>Min PR Price</Form.Label>

                  <Form.Control 
                    name="PRprice"
                    value={fields.PRprice}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group as={Col} controlId="formGridETH" className='mb-2'>
                  <Form.Label>ETH Value</Form.Label>

                  <Form.Control 
                    name="val"
                    value={fields.val}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Form>
            </Card.Body>

            <Card.Footer className="text-muted">
                <Button 
                  type="submit"
                  variant="primary" 
                  onClick={mintStory}
                >
                  Mint Your Story!
                </Button>
            </Card.Footer>
          </Card>
        </Container>
    </>
  );
}
