import 'bootstrap/dist/css/bootstrap.min.css'
import StoryCard from "../components/StoryCard"
import React from 'react';

export default function List({stories}) {

  return stories.map((story) => {
    return (
      <StoryCard key={story.id} story={story} />
    );
  });
}
