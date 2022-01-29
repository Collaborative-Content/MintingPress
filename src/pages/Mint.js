
import 'bootstrap/dist/css/bootstrap.min.css'
import StoryBox from '../components/StoryBox'
import { Container, Button} from 'react-bootstrap';

import React from 'react';
// TODO how do we get the storyRef here, and move handleAddStory here
export default function Mint() {
  return (
      <>
      <Container> 
      <StoryBox story={""} />
      </Container>
      <Container> 
      
      <Button variant="primary" type="submit">
    Mint!
    </Button>
    </Container>
    </>
  );
}
