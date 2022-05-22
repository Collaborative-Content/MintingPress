import React, { useEffect, useState } from "react";
import { Container, Card, Button, Form } from "react-bootstrap";
import StoryBox from "../components/StoryBox";
import { getVotes } from "../utils/Contracts";
import { toast } from "react-toastify";
import { getSelectedAddress } from "../utils/common";

export default function Vote({ story }) {
  const [voteCredit, setVoteCredit] = useState();
  const [checked, setChecked] = useState(false);
  console.log(checked);

  const [fields, setFields] = useState({
    voteCredits: "",
  })
 
  useEffect(() => {
    const address = getSelectedAddress();
    console.log(address);
    voteCreditsAvailable(0, address);
  }, []);
  
  async function voteCreditsAvailable(tokenID, address) {
    let credits = await getVotes(tokenID, address);
    setVoteCredit(parseInt(credits));
  }

  // *** HANDLERS ***

  const handleInputChange = (e) => {
    setFields({
        ...fields,
        [e.target.name]:e.target.value
    })
  }

  function handleVote() {
    const voteCreditsUsed = fields.voteCredits; // number as a string
    const approve = checked; // boolean if approved or not

    console.log(voteCreditsUsed, approve);
    toast("Your vote has been submitted!!");
  }

  return (
    <>
      <Container>
        <Card className='mx-auto' style={{maxWidth: '800px'}}>
          <Card.Header>Vote for a Story</Card.Header>

          <Card.Body>
            <StoryBox story={story} />

            <Form.Label className='mt-2'>Exisiting Vote Credits: {voteCredit}</Form.Label>

            <Form.Group controlId="formGridMinPRPrice" className='mt-2 mb-2'>
              <Form.Label>Vote Credits to be used:</Form.Label>

              <Form.Control 
                name="voteCredits"
                value={fields.voteCredits}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Check 
              type="switch"
              id="custom-switch"
              label="Approve"
              onChange={e => setChecked(e.currentTarget.checked)}
            />
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
