import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Navigate from '../components/NavBar';
import StoryBox from '../components/StoryBox';

export default function Vote( { story } ) {

  const [voteRef] = useState([]);
  const [approveRef] = useState([]);
  const [denyRef] = useState([]);

  function voteCreditsAvailable() {
    //need to implement this!
    return 10
  }

  function handleVote() {
    const voteCredits = voteRef.current.value;
    const approve = approveRef.current.value;
    const deny = denyRef.current.value;

    console.log(voteCredits, approve, deny);
  }

  return (
    <>
      <Container>
        <StoryBox story={story} />
        <label>Vote Credits Available: 100</label>
        <div>
          <label>Vote Credits to be used:</label>
          <input type="text" ref={voteRef} ></input>
          <label>Approve: </label>
          <input type="checkbox" ref={approveRef}></input>
          <label>Deny: </label>
          <input type="checkbox" ref={denyRef}></input>
          <button onClick={handleVote}>Submit</button>
        </div>
      </Container>
    </>
  );
}
