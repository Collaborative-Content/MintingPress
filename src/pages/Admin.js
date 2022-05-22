import { Container, ButtonGroup, Button, Card } from "react-bootstrap";
import { startContributionPeriod, startVotingPeriod, endRound } from "../utils/Contracts";

export default function Admin() {

  return (
    <>
      <Container>
        <Card className='mx-auto' style={{maxWidth: '800px'}}>
          <Card.Header>Admin Controls</Card.Header>

          <Card.Body align='center' className='p-2'>
            <ButtonGroup vertical>
              <Button
                variant="primary"
                type="submit"
                size="md"
                onClick={startContributionPeriod}
                className='mt-2'
              >
                Start Contribution Period
              </Button> 

              <Button
                variant="primary"
                type="submit"
                size="md"
                onClick={startVotingPeriod}
                className='mt-2'
              >
                Start Voting Period
              </Button>

              <Button
                variant="primary"
                type="submit"
                size="md"
                onClick={endRound}
                className='mt-2'
              >
                End Round
              </Button>
            </ButtonGroup>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
