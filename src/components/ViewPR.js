import React from 'react';
import { Container, Card, Nav } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom'
import { getSpecifiedContent } from '../utils/Contracts';

export default function ViewPR({ singlePR }) {

  const { id } = useParams();
  console.log("View PR component, story ID ", id);
  console.log("View PR component, PR details ", singlePR);
  
  return (
    <>
      <div style={{ marginBottom: "20px", borderWidth: 10, borderColor: 'blue' }}>
      <Container>
      <Card>
      <Card.Body>
        <Card.Title>{singlePR.index}</Card.Title>
        <Card.Text>
          {singlePR.content}
        </Card.Text>
        <Card.Text>
          {singlePR.author}
        </Card.Text>
        <Nav.Link href={id + "/" + singlePR.index + "/vote"}>
          <a className="btn btn-primary">Vote</a>
        </Nav.Link>
      </Card.Body>
    </Card>
    </Container>
    </div>
    </>
  );
}
