import React, { useEffect, useState } from "react";
import { Container, Card, Nav } from "react-bootstrap";
import { useHistory, useParams } from 'react-router-dom'
import { getVotes, getSpecifiedContent, getPRsList } from "../utils/Contracts";
import { toast } from "react-toastify";

export default function Vote() {
  const [specifiedStory, setSpecifiedStory] = React.useState([]);
  const [PRsList, setPRsList] = React.useState([]);
  const [voteRef] = useState([]);
  const [approveRef] = useState([]);
  const [denyRef] = useState([]);
  const [voteCredit, setVoteCredit] = useState();

  const { id } = useParams();
  const { pr_id } = useParams();
  console.log("Vote page, fetching story id ", id);
  console.log("Vote page, fetching PR id ", pr_id);
 
  useEffect(() => {
    async function fetchStory (id) {
      const response = await getSpecifiedContent(id);
      setSpecifiedStory(response);
    };
    async function fetchPRs (id) {
      const response = await getPRsList(id);
      setPRsList(response);
    };
    fetchStory(id);
    fetchPRs(id);

    // async function voteCreditsAvailable(tokenID, address) {
    //   let credits = await getVotes(tokenID, address);
    //   setVoteCredit(parseInt(credits));
    // }
    // voteCreditsAvailable(tokenID-1, address);
  }, []);

  // function handleVote() {
  //   if(voteCredit > 0){
  //     const voteCreditsUsed = voteRef.current.value;
  //     const approve = approveRef.current.value;
  //     const deny = denyRef.current.value;
  //     const prAuthor = prAddress;
  //     let positive = approve > 0 ? 1 :  0;
  //     console.log(voteCreditsUsed, approve, deny);

  //     if(voteCreditsUsed <= voteCredit) {
  //       setVoteCredit(voteCredit - voteCreditsUsed);

  //       toast("Your vote has been submitted!!");
  //     } else {
  //       toast("You cannot cast more votes than available");
  //     }
  //   } else {
  //     toast('You do not have the vote credits to perform that operation');
  //   }
  // }

  return (
    <>
      <Container>
        <Card>
        <Card.Body>
          <Card.Title>{specifiedStory.token_symbol}</Card.Title>
          <Card.Text>
            {specifiedStory.content}
          </Card.Text>
          <Nav.Link href={id + "/submitPR"}>
            <a className="btn btn-primary">Submit PR</a>
          </Nav.Link>
        </Card.Body>
        </Card>
      </Container>
      <Container>
        {/* <StoryCard story={stories} />
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
        </div> */}
      </Container>
    </>
  );
}
