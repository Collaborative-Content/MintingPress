import React from 'react';
import { Container, Card, Nav, Button } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom'
import SubmitPR from '../pages/SubmitPR';
import ViewPR from '../components/ViewPR';
import { getSpecifiedContent, getPRsList } from '../utils/Contracts';

export default function StorySingle() {
  const [specifiedStory, setSpecifiedStory] = React.useState([]);
  const [PRsList, setPRsList] = React.useState([]);
  const { id } = useParams();
  console.log("Single Story component, fetching story id ", id);
  
  React.useEffect(() => {
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
  }, []);

  return (
    <>
      <div style={{ marginBottom: "20px", borderWidth: 10, borderColor: 'blue' }}>

      <Container>
        <Card className='darkCard mb-4 shadow-sm'>
          <Card.Header>{specifiedStory.token_symbol}</Card.Header>

          <Card.Body>
            <Card.Text>
              {specifiedStory.content}
            </Card.Text>
          </Card.Body>

          <Card.Footer className="text-muted">
              <Button 
                variant="primary" 
                href={id + "/submitPR"}
              >
                Submit PR
              </Button>
          </Card.Footer>
        </Card>
      </Container>

      <Container>
        <ul>
          {PRsList.map(singlePR => (
            <ViewPR key={singlePR.key} singlePR={singlePR}/>
          ))}
        </ul>
      </Container>
      </div>
    </>
  );
}
