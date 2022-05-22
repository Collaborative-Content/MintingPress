import React from "react";
import { Form, Card } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import { v4 } from "uuid";

const LOCAL_STORAGE_KEY = "storiesApp.stories";

function StoryBox({ story }) {
  const [stories, setStories] = useState([{ id: 1, story: "My Story" }]);
  const storyRef = useRef();

  useEffect(() => {
    const storedStories = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedStories) setStories(storedStories);
  }, []);

  // need this to persist across page reload inside local browser
  // first param is function that will run, second param is the trigger.
  // in this case any time array of todos changes, the effect is run.
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stories));
  }, [stories]);

  // e for event
  function handleAddStory(e) {
    const name = storyRef.current.value;
    if (name === "") return;
    console.log(name);

    setStories((prevStories) => {
      return [...prevStories, { id: v4(), name: name }];
    });
    storyRef.current.value = null; // clears input box
  }

  return (
    <>
      <Card>
        <Card.Header>Story</Card.Header>

        <Card.Body>
          <Form>
            <Form.Group controlId="formGridStoryBox" className='mb-2'>
              <Form.Control
                type="text"
                disabled
                readOnly
                placeholder="..."
                ref={storyRef}
              />
              {story}
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}

export default StoryBox;
