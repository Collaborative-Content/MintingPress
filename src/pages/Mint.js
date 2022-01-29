
import 'bootstrap/dist/css/bootstrap.min.css'
import StoryBox from '../components/StoryBox'
import { Button} from 'react-bootstrap';

import React from 'react';

export default function Mint() {
  return (
      <>
    <StoryBox />
    <Button variant="primary" type="submit">
    Mint!
    </Button>
    </>
  );
}
