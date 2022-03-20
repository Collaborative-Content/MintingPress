import 'bootstrap/dist/css/bootstrap.min.css'
import StoryCard from "../components/StoryCard"
import React from 'react';
import {getContent } from '../utils/Contracts';

export default function List() {

  // const [readytoRender, setReadyToRender] = React.useState(False);
  const [stories, setStories] = React.useState([]);
  React.useEffect(() => {
    const fetchStories = async () => {
      const response = await getContent();
      //const { storiesContent } = await response.json();
      setStories(response);
    }
    fetchStories()
      .catch(console.error);;
  }, []);

  console.log("These are stories ", stories);
  // return (
  //   <div> 
  //     <h1>{stories.toString()}</h1>
  //   </div>
  // );

  console.log("stories length: ", stories.length);
  if (stories.length === 0) {
    return null;
  } else {
    for (let i=0; i++; i<stories.length) {
      let story = stories[i];
      return (
        <StoryCard key={story.id} story={story} />
      );
    };
  }


  // return stories.then((storyarray) => {
  //   storyarray.map((story) => {
  //     return (
  //       <StoryCard key={story.id} story={story} />
  //     );
  //   })
  // });
}
