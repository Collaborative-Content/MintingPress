
import React from 'react';
import { Form, FloatingLabel } from 'react-bootstrap';
{/* <input ref={storyRef} type="text" />
<Button onClick={handleAddStory}>Add Stories</Button> */}

function StoryBox() {

  return (
<>
  <FloatingLabel controlId="floatingTextarea2" label="Story">
    <Form.Control
      as="textarea"
      placeholder="Leave a comment here"
      style={{ height: '600px' }}
    />

  </FloatingLabel>


</>
    );
}

export default StoryBox;