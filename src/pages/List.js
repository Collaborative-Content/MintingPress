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
  // if (stories.length === 0) {
  //   return null;
  // } else {
  // return (
  //   stories.map((story) => {
  //     <StoryCard story={story} />
  //   })
  // );
  stories.map((story) => {
    console.log(story);
  });

  return stories.map((story) => {
    <StoryCard story={story} />
  });
  
  //}
}
