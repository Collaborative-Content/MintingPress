import 'bootstrap/dist/css/bootstrap.min.css'
import StoryCard from "../components/StoryCard"
import React from 'react';
import {getContent } from '../utils/Contracts';

export default function List(stories) {

  // const [stories, setStories] = React.useState("");
  // React.useEffect(() => {
  //   const fetchStories = async () => {
  //     const response = await getContent();
  //     //const { storiesContent } = await response.json();
  //     setStories(response);
  //   };
  //   fetchStories();
  // }, []);

  console.log("These are stories ", stories);
  return stories.map((story) => {
    return (
      <StoryCard key={story.id} story={story} />
    );
  });




  // return stories.then((storyarray) => {
  //   storyarray.map((story) => {
  //     return (
  //       <StoryCard key={story.id} story={story} />
  //     );
  //   })
  // });
}
