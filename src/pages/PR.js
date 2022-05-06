import React, { useEffect, useState } from "react";
import { Button, Card, Container, FloatingLabel, Form, Nav } from "react-bootstrap";
import { useHistory, useParams } from 'react-router-dom'
import { getSpecifiedContent } from '../utils/Contracts';
import StoryBox from "../components/StoryBox";
import { toast } from "react-toastify";
import { submitPR, getPRexists } from '../utils/Contracts';

export default function PR() {

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
        <Card>
        <Card.Body>
          <Card.Title>{specifiedStory.token_symbol}</Card.Title>
          <Card.Text>
            {specifiedStory.content}
          </Card.Text>
        </Card.Body>
        </Card>
        {/* <StoryBox story={specifiedStory}></StoryBox> */}
        <FloatingLabel
          controlId="floatingTextarea2"
          label="PR addition"
          style={{ marginBottom: "25px" }}
        >
          <Form.Control
            name="text"
            as="textarea"
            placeholder="Leave a comment here"
            style={{ height: "200px" }}
            onChange={handleInputChange}
          />
        </FloatingLabel>
        {/* <label>Price for PR</label>
        <br />
        <input className="form-control" type="text" onChange={handleInputChange}/>
        <br /> */}
        <Form.Group>
          <Form.Label>ETH Value</Form.Label>
          <Form.Control 
              name="val"
              value={fields.val}
              onChange={handleInputChange}
            />
        </Form.Group>
        </Container>

        <Container>
          <Button
            variant="primary"
            type="submit"
            className="btn-block"
            onClick={handleSubmitPR}
          >
            Submit Pull Request!
          </Button>
        </Container>
    </>
  );
}
