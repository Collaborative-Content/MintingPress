import React from 'react';
import { Container, Card, Button, Nav } from 'react-bootstrap';

export default function StoryCard({ story }) {

  return (
    <>
      <div style={{ marginBottom: "20px", borderWidth: 10, borderColor: 'blue' }}>
      <Container>
      <Card>
      <Card.Body>
        <Card.Title>{story.name}</Card.Title>
        <Card.Text>
          {story.story}
        </Card.Text>
        <Nav.Link href="submitPR">
          <a className="btn btn-primary">View Story</a>
        </Nav.Link>
      </Card.Body>
    </Card>
    </Container>
    </div>
    </>
  );
}
