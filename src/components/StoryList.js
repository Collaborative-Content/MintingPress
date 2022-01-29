import React from 'react';
import StoryCard from './StoryCard';

export default function StoryList({ stories }) {
  return( stories.map( story => {
    return <StoryCard key={story.id} story={story}/>
  })
  )
}
