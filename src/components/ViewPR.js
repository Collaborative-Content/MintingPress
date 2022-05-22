import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom'

export default function ViewPR({ singlePR }) {

  const { id } = useParams();
  console.log("View PR component, story ID ", id);
  console.log("View PR component, PR details ", singlePR);
  
  return (
    <Card className='darkCard mb-4 shadow-sm'>
      <Card.Header>PR #{singlePR.index}</Card.Header>

      <Card.Body>
        <Card.Text className='mb-4'>{singlePR.content}</Card.Text>
        <Card.Text>Author: {singlePR.author}</Card.Text>
      </Card.Body>

      <Card.Footer className="text-muted">
          <Button 
            variant="primary" 
            href={id + "/" + singlePR.index + "/vote"}
          >
            Vote
          </Button>
      </Card.Footer>
    </Card>
  );
}
