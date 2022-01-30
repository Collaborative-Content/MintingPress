import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import Navigate from '../components/NavBar';
import StoryBox from '../components/StoryBox';

export default function PR({story}) {
  const [pr, setPr] = useState([]);
  const prRef = useState([]);

  function handleSubmitPR() {
    const price = prRef.current.value;
    //sign and send the PR and handle any exceptions
  }
  
  return (
    <>
      <Navigate>
      </Navigate>
      <Container>
        <StoryBox story={story}>
        </StoryBox>
      </Container>
      <label>Price for PR</label>
      <input type="text" ref={prRef}/>
      <button onClick={handleSubmitPR}>Sumbit Pull Request</button>
    </>
  );
}
