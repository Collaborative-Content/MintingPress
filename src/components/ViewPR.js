import React from 'react';
import { Container, Card, Nav } from 'react-bootstrap';
import { useHistory, useParams } from 'react-router-dom'
import { getSpecifiedContent } from '../utils/Contracts';

export default function ViewPR({ singlePR }) {

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
        <Nav.Link>
          <a className="btn btn-primary">Upvote</a>
        </Nav.Link>
        <Nav.Link>
          <a className="btn btn-primary">Downvote</a>
        </Nav.Link>
      </Card.Body>
    </Card>
    </Container>
    </div>
    </>
  );
}
