import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {v4} from 'uuid';
import Navigate from './components/NavBar'
import Mint from './pages/Mint'
import Home from './pages/Home'
import 'bootstrap/dist/css/bootstrap.min.css'

const LOCAL_STORAGE_KEY = 'todoApp.todos'

function App() {
  const [stories, setStories] = useState([])
  const storyRef = useRef()

  useEffect(() => {
    const storedStories = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if (storedStories) setStories(storedStories)
  }, [])

  // need this to persist across page reload inside local browser
  // first param is function that will run, second param is the trigger.
  // in this case any time array of todos changes, the effect is run.
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stories))
  }, [stories])

  // e for event
  function handleAddStory(e) {
    const name = storyRef.current.value
    if (name === '') return
    console.log(name)
    setStories(prevStories => {
      return [...prevStories, { id: v4(), name: name}]
    })
    storyRef.current.value = null // clears input box
  }

  return (
    <Router>
      <div>
        <Navigate />
        <Routes>
          <Route path="/mint" element={<Mint/>}>
          </Route>
          <Route path="/view-story/:id">
          </Route>
          <Route path="/" element={<Home />}>
          </Route>
          <Route path="/home" element={<Home />}>
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

{/* <> 
      
<StoryBox />

<div>{stories.length} stories</div>
</> */}

{/* <input ref={storyRef} type="text" />
<Button onClick={handleAddStory}>Add Stories</Button> */}
export default App;
