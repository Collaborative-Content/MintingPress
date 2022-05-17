import React from 'react';
import { Container, Card, Nav } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom'
import PR from '../pages/PR';
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
    fetchStory(id);
    fetchPRs(id);
  }, []);

  async function fetchPRs (id) {
    const response = await getPRsList(id);
    setPRsList(response);
  };

  return (
    <>
      <div style={{ marginBottom: "20px", borderWidth: 10, borderColor: 'blue' }}>
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
    <ul>
      {PRsList.map(singlePR => (
        <li key={singlePR.key}>
          <ViewPR singlePR={singlePR} />
        </li>
      ))}
    </ul>
    </Container>
    </div>
    </>
  );
}
