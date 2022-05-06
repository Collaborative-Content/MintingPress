import React, { useEffect, useState } from "react";
import { Container, Card, Form, FloatingLabel, Nav } from "react-bootstrap";
import { useHistory, useParams } from 'react-router-dom'
import { getSpecifiedContent } from '../utils/Contracts';
import StoryBox from "../components/StoryBox";
import { toast } from "react-toastify";

export default function PR() {

  const [specifiedStory, setSpecifiedStory] = React.useState([]);
  const { id } = useParams();
  console.log("PR page for story id ", id);
  const [pr, setPr] = useState([]);

  React.useEffect(() => {
    async function fetchStory (id) {
      const response = await getSpecifiedContent(id);
      setSpecifiedStory(response);
    };
    fetchStory(id);
  }, []);

  function handleSubmitPR() {
    toast("Pull request submitted!");

    const price = pr.current.value;
    //sign and send the PR and handle any exceptions
    console.log(price);
    // invoke SC submitPR method
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
            as="textarea"
            placeholder="Leave a comment here"
            style={{ height: "200px" }}
          />
        </FloatingLabel>
        <label>Price for PR</label>
        <br />
        <input className="form-control" type="text" ref={pr} />
        <br />
        <button class="btn btn-primary" onClick={handleSubmitPR}>
          Submit Pull Request
        </button>
      </Container>
    </>
  );
}
