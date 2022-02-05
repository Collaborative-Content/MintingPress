import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Navigate from "../components/NavBar";
import StoryBox from "../components/StoryBox";
import { toast } from "react-toastify";

export default function PR({ story }) {
  const [pr, setPr] = useState([]);
  const prRef = useState([]);

  function handleSubmitPR() {
    toast("Pull request submitted!!");

    const price = prRef.current.value;
    //sign and send the PR and handle any exceptions
    console.log(price);
  }

  return (
    <>
      <Container>
        <StoryBox story={story}></StoryBox>
        <label>Price for PR</label>
        <br />
        <input className="form-control" type="text" ref={prRef} />
        <br />
        <button class="btn btn-primary" onClick={handleSubmitPR}>
          Submit Pull Request
        </button>
      </Container>
    </>
  );
}
