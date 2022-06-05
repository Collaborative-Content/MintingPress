import React from 'react';
import { Button, Card, Container, Nav } from 'react-bootstrap';

export default function StoryCard({ story }) {

  return (
    <Card className='darkCard mb-4 shadow-sm'>
      <Card.Header>{story.token_symbol}</Card.Header>

      <Card.Body>
        <Card.Text>
          {story.content}
        </Card.Text>
      </Card.Body>

      <Card.Footer className="text-muted">
          <Button 
            variant="primary" 
            href={"story/" + story.content_token_id}
          >
            View Story
          </Button>
      </Card.Footer>
    </Card>
  );
}