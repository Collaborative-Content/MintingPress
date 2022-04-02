import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Navigate from "../components/NavBar";
import StoryBox from "../components/StoryBox";
import { getVotes } from "../utils/Contracts";
import { toast } from "react-toastify";
import { getSelectedAddress } from "../utils/common";

export default function Vote({ story }) {
  const [voteRef] = useState([]);
  const [approveRef] = useState([]);
  const [denyRef] = useState([]);
  const [voteCredit, setVoteCredit] = useState();
 
  useEffect(() => {
    const address = getSelectedAddress();
    console.log(address);
    voteCreditsAvailable(0, address);
  }, []);
  
  async function voteCreditsAvailable(tokenID, address) {
    let credits = await getVotes(tokenID, address);
    setVoteCredit(parseInt(credits));
  }

  function handleVote() {
    const voteCreditsUsed = voteRef.current.value;
    const approve = approveRef.current.value;
    const deny = denyRef.current.value;

    console.log(voteCreditsUsed, approve, deny);
    toast("Your vote has been submitted!!");
  }

  return (
    <>
      <Container>
        <StoryBox story={story} />
        <label>Vote Credits Available: {voteCredit}</label>
        <div>
          <label>Vote Credits to be used:</label>
          <input type="text" className="form-control" ref={voteRef}></input>
          <br />
          <div>
            <input type="radio" ref={approveRef}></input> &nbsp;
            <label>Approve </label> &nbsp;
            <input type="radio" ref={denyRef}></input>&nbsp;
            <label>Deny </label>
          </div>
          <br />
          <div>
            <button
              onClick={handleVote}
              className="btn btn-primary"
            >
              Submit Your Vote!
            </button>
          </div>
        </div>
      </Container>
    </>
  );
}
