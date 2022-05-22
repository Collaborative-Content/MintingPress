import 'bootstrap/dist/css/bootstrap.min.css'
import { Container, Card, Button } from 'react-bootstrap';
import StoryCard from "../components/StoryCard"
import React from 'react';
import { getContent } from '../utils/Contracts';

export default function List() {
  const [stories, setStories] = React.useState([]);

  React.useEffect(() => {
    const fetchStories = async () => {
      const response = await getContent();
      setStories(response);
    };
    fetchStories();
  }, []);

  console.log("stories length: ", stories.length);

  return (
    <Container>
      {
        stories[0] ? stories.map(story => (
          <StoryCard key={story.id} story={story}/>
        )) 
        :   
          <Card className="darkCard shadow-sm">
            <Card.Body>
              <Card.Title>No stories to show...</Card.Title>
            </Card.Body>
            <Card.Footer>
              <Button href='/mint'>Mint a Story</Button>
            </Card.Footer>
          </Card>
      }
    </Container>
  );
}

