import React from 'react';
import { Container, Card, Nav } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom'
import { getSpecifiedContent } from '../utils/Contracts';

export default function StorySingle() {
  
  const [specifiedStory, setSpecifiedStory] = React.useState([]);
  const { id } = useParams();
  console.log("Single Story component, fetching story id ", id);
  
  React.useEffect(() => {
    async function fetchStory (id) {
      const response = await getSpecifiedContent(id);
      setSpecifiedStory(response);
    };
    fetchStory(id);
  }, []);

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
    </div>
    </>
  );
}
