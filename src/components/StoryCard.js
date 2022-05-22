import React from 'react';
import { Container, Card, Nav } from 'react-bootstrap';

export default function StoryCard({ story }) {

  return (
    <>
      <div style={{ marginBottom: "20px", borderWidth: 10, borderColor: 'blue' }}>
      <Container>
      <Card>
      <Card.Body>
        <Card.Title>{story.token_symbol}</Card.Title>
        <Card.Text>
          {story.content}
        </Card.Text>
        <Nav.Link href={"story/" + story.content_token_id}>
          <a className="btn btn-primary">View Story</a>
        </Nav.Link>
      </Card.Body>
    </Card>
    </Container>
    </div>
    </>
  );
}
