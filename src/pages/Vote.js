import { useEffect, useState } from "react";
import { Container, Card, Button, ListGroup } from "react-bootstrap";
import { useParams } from 'react-router-dom'
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
        <Card className='darkCard mx-auto shadow-sm' style={{maxWidth: '800px'}}>
          <Card.Header>{specifiedStory.token_symbol}</Card.Header>

          <Card.Body>
            <Card.Text>{specifiedStory.content}</Card.Text>
              <ListGroup variant="flush">
                <ListGroup.Item>PR ID: {specifiedPR.index}</ListGroup.Item>
                <ListGroup.Item>Vote Credits Available: {voteCredit}</ListGroup.Item>
              </ListGroup>
          </Card.Body>

          <Card.Footer className="text-muted">
              <Button 
                type="submit"
                variant="primary" 
                onClick={handleVote}
              >
                Submit your Vote!
              </Button>
          </Card.Footer>
        </Card>
      </Container>
    </>
  );
}
