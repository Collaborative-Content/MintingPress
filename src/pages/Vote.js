import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Navigate from "../components/NavBar";
import StoryBox from "../components/StoryBox";
import { getVotes, getContent } from "../utils/Contracts";
import { toast } from "react-toastify";
import { getSelectedAddress } from "../utils/common";
import StoryCard from "../components/StoryCard";
import PR from "./PR";


export default function Vote() {
  const [stories, setStories] = useState([]);
  const [voteRef] = useState([]);
  const [approveRef] = useState([]);
  const [denyRef] = useState([]);
  const [voteCredit, setVoteCredit] = useState();
 
  useEffect(() => {
    // fetch all stories
    const fetchStories = async () => {
      const response = await getContent();
      setStories(response);
    };
    fetchStories();

    const address = getSelectedAddress();
    const tokenID = 1;
    console.log(address);
    async function voteCreditsAvailable(tokenID, address) {
      let credits = await getVotes(tokenID, address);
      setVoteCredit(parseInt(credits));
    }
    voteCreditsAvailable(tokenID, address);
  }, []);
  
  

  function handleVote() {
    const voteCreditsUsed = voteRef.current.value;
    const approve = approveRef.current.value;
    const deny = denyRef.current.value;

    console.log(voteCreditsUsed, approve, deny);
    toast("Your vote has been submitted!!");
  }

  return (
    // <>
    //   <Container>
    //     <StoryCard story={story} />
    //     <label>Vote Credits Available: {voteCredit}</label>
    //     <div>
    //       <label>Vote Credits to be used:</label>
    //       <input type="text" className="form-control" ref={voteRef}></input>
    //       <br />
    //       <div>
    //         <input type="radio" ref={approveRef}></input> &nbsp;
    //         <label>Approve </label> &nbsp;
    //         <input type="radio" ref={denyRef}></input>&nbsp;
    //         <label>Deny </label>
    //       </div>
    //       <br />
    //       <div>
    //         <button
    //           onClick={handleVote}
    //           className="btn btn-primary"
    //         >
    //           Submit Your Vote!
    //         </button>
    //       </div>
    //     </div>
    //   </Container>
    // </>
    <ul>
      {stories.map(story => (
        <li key={story.key}>
          <StoryCard story={story} />
          <PR />
        </li>
      ))}
    </ul>
  );
}
