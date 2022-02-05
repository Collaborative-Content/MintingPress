
import 'bootstrap/dist/css/bootstrap.min.css'
import StoryCard from "../components/StoryCard"
import {useState} from "react"
import React from 'react';

export default function List() {

  const [stories, SetStories] = useState([{id: 1, story: "story"}])

  return (
    stories.map( story => {
      return <StoryCard key={story.id} story={story}/>
    })
  );
}
