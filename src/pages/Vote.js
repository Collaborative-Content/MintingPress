import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Navigate from "../components/NavBar";
import StoryBox from "../components/StoryBox";
import { getVotes, getSpecifiedContent } from "../utils/Contracts";
import { toast } from "react-toastify";
import { getSelectedAddress } from "../utils/common";
import StoryCard from "../components/StoryCard";
import SubmitPR from "./SubmitPR";


export default function Vote({tokenID, content, prAddress}) {
  const [stories, setStories] = useState([]);
  const [voteRef] = useState([]);
  const [approveRef] = useState([]);
  const [denyRef] = useState([]);
  const [voteCredit, setVoteCredit] = useState();
 
  useEffect(() => {
    const address = getSelectedAddress();
    console.log(address);
    setStories(content);
    voteCreditsAvailable(tokenID-1, address);
  }, []);
  
  async function voteCreditsAvailable(tokenID, address) {
    let credits = await getVotes(tokenID, address);
    setVoteCredit(parseInt(credits));
  }

  function handleVote() {
    if(voteCredit > 0){
      const voteCreditsUsed = voteRef.current.value;
      const approve = approveRef.current.value;
      const deny = denyRef.current.value;
      const prAuthor = prAddress;
      let positive = approve > 0 ? 1 :  0;
      console.log(voteCreditsUsed, approve, deny);

      if(voteCreditsUsed <= voteCredit) {
        setVoteCredit(voteCredit - voteCreditsUsed);

        toast("Your vote has been submitted!!");
      } else {
        toast("You cannot cast more votes than available");
      }
    } else {
      toast('You do not have the vote credits to perform that operation');
    }
  }

  return (
    <>
      <Container>
        <StoryCard story={stories} />
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
