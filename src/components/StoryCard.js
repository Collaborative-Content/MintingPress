import React from 'react';
import { Card, Button } from 'react-bootstrap';

export default function StoryCard({ story}) {

  return (
    <>
      <Card>
      <Card.Body>
        <Card.Title>Token Symbol Here</Card.Title>
        <Card.Text>
          {story.story}
        </Card.Text>
        <Button variant="primary">View Story</Button>
      </Card.Body>
    </Card>
    </>
  )
}

{/* <div>
      <label> 
        <input type="checkbox" checked = {todo.complete} onChange={handleTodoClick}/>
        {todo.name}
      </label>
  </div> */}