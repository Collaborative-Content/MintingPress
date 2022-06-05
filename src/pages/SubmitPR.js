import React, { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useParams } from 'react-router-dom'
import { getSpecifiedContent } from '../utils/Contracts';
import { submitPR, getPRexists } from '../utils/Contracts';

export default function SubmitPR() {
  const [specifiedStory, setSpecifiedStory] = React.useState([]);
  const { id } = useParams();
  
  console.log("PR page for story id ", id);
  
  const [fields, setFields] = useState({
    text: "",
    val: "",
  })

  React.useEffect(() => {
    async function fetchStory (id) {
      const response = await getSpecifiedContent(id);
      setSpecifiedStory(response);
    };
    fetchStory(id);
  }, []);

  const handleInputChange = (e) => {
    setFields({
        ...fields,
        [e.target.name]:e.target.value
    })
  }

  function handleSubmitPR() {
    submitPR(fields.text, id, fields.val)
    console.log("PR text:", fields.text, "; content id:", id, "; value:", fields.val)
    const isPRexists = getPRexists(id);
    // toast("Pull request submitted!");
  }

  return (
    <>
      <Container>
        <Card className="darkCard mb-4 shadow-sm">
          <Card.Header>{specifiedStory.token_symbol}</Card.Header>
          <Card.Body>
            <Card.Text>
              <p>
                {specifiedStory.content}
              </p>
              <footer className="blockquote-footer">
                MintingPress NFT #{specifiedStory.content_token_id}
              </footer>
            </Card.Text>

            <Form.Group controlId="prAddition" className='mb-2'>
              <Form.Label>PR Addition</Form.Label>

              <Form.Control 
                name="text"
                placeholder="Leave a comment here"
                value={fields.text}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group controlId="ethValue" className='mb-2'>
              <Form.Label>ETH Value</Form.Label>

              <Form.Control 
                name="val"
                placeholder="0"
                value={fields.val}
                onChange={handleInputChange}
              />
            </Form.Group>

          </Card.Body>

          <Card.Footer>
            <Button
              variant="primary"
              type="submit"
              className="btn-block"
              onClick={handleSubmitPR}
            >
              Submit Pull Request!
            </Button>
          </Card.Footer>
        </Card>

        {/* <StoryBox story={specifiedStory}></StoryBox> */}

        {/* <label>Price for PR</label>
        <br />
        <input className="form-control" type="text" onChange={handleInputChange}/>
        <br /> */}

    </Container>
    </>
  );
}
