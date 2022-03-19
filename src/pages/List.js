import 'bootstrap/dist/css/bootstrap.min.css'
import StoryCard from "../components/StoryCard"
import React from 'react';
import {getContent } from '../utils/Contracts';

export default function List() {

  function getState() {
    const stories = getContent();
    return stories;
  }

  // TODO initialize state here
  // see https://stackoverflow.com/a/40030884 and https://daveceddia.com/where-initialize-state-react/


  const stories = getState();
  stories.then((storyarray) => {
    console.log("These are stories ", storyarray);
    return storyarray.map((story) => {
      return (
        <StoryCard key={story.id} story={story} />
      );
    });
  });




  // return stories.then((storyarray) => {
  //   storyarray.map((story) => {
  //     return (
  //       <StoryCard key={story.id} story={story} />
  //     );
  //   })
  // });
}
