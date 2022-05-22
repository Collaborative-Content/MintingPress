import React, { useState } from "react";
import { Container, Card, Form, Button } from "react-bootstrap";
import StoryBox from "../components/StoryBox";
import { toast } from "react-toastify";

export default function PR({ story }) {
  const [fields, setFields] = useState({
    prPrice: "",
  })

  const handleInputChange = (e) => {
    setFields({
        ...fields,
        [e.target.name]:e.target.value
    })
  }

  function handleSubmitPR() {
    const price = fields.prPrice;

    //sign and send the PR and handle any exceptions
    console.log(price);

    toast("Pull request submitted!!");
  }

  return (
    <>
      <Container>
        <Card className='mx-auto' style={{maxWidth: '800px'}}>
          <Card.Header>Submit a Pull Request</Card.Header>

          <Card.Body>
            <StoryBox story={story}></StoryBox>

            <Form.Group controlId="formGridPRPrice" className='mt-2 mb-2'>
              <Form.Label>Price For PR</Form.Label>

              <Form.Control 
                name="voteCredits"
                value={fields.prPrice}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Card.Body>

          <Card.Footer className="text-muted">
              <Button 
                type="submit"
                variant="primary" 
                onClick={handleSubmitPR}
              >
                Submit Pull Request
              </Button>
          </Card.Footer>
        </Card>
      </Container>
    </>
  );
}
