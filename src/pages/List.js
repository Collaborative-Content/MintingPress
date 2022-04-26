import 'bootstrap/dist/css/bootstrap.min.css'
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
    <ul>
      {stories.map(story => (
        <li key={story.key}>
          <StoryCard story={story} />
        </li>
      ))}
    </ul>
  );
}
