import { useEffect, useState } from "react";
import { Container, Card, Nav } from "react-bootstrap";
import { useHistory, useParams } from 'react-router-dom'
import { getSelectedAddress, requestAccount } from "../utils/common";
import { getVotes, getSpecifiedContent, getPRsList } from "../utils/Contracts";
import { toast } from "react-toastify";

export default function Vote() {
  const [specifiedStory, setSpecifiedStory] = useState([]);
  const [specifiedPR, setSpecifiedPR] = useState([]);
  const [voteCredit, setVoteCredit] = useState();
  const [voteRef] = useState([]);
  const [approveRef] = useState([]);
  const [denyRef] = useState([]);

  const { id } = useParams();
  const { pr_id } = useParams();
  console.log("Vote page, fetching story id ", id);
  console.log("Vote page, fetching PR id ", pr_id);
 
  useEffect(() => {
    async function fetchStory (id) {
      const response = await getSpecifiedContent(id);
      setSpecifiedStory(response);
      console.log("Story: ", response);
    };
    async function fetchPR (id, pr_id) {
      const responseList = await getPRsList(id);
      const response = responseList[pr_id-1];
      setSpecifiedPR(response);
      console.log("PR for story: ", response);
    };
    // could add 'connect to metamask' button to get the user address
    async function voteCreditsAvailable(id) {
      let credits = await getVotes(id);
      setVoteCredit(parseInt(credits));
      console.log("vote credits available: ", voteCredit);
    }
    fetchStory(id);
    fetchPR(id, pr_id);
    voteCreditsAvailable(id);
  }, []);

  function handleVote() {
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
        <Card>
          <Card.Body>
            <Card.Text>
              {specifiedPR.content}
            </Card.Text>
            <Card.Text>
              PR ID:
              {specifiedPR.index}
            </Card.Text>
            <Card.Text>
              PR Author:
              {specifiedPR.author}
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
      <Container>
        <label>Vote Credits Available: {voteCredit}</label>
        {/* <div>
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
