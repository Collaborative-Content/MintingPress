import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigate from "./components/NavBar";
import Mint from "./pages/Mint";
import List from "./pages/List";
import PR from "./pages/PR";
import Vote from "./pages/Vote";
import Admin from "./pages/Admin";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import { requestAccount } from './utils/common';
import {v4} from 'uuid';
import { getContent, getSpecifiedContent } from "./utils/Contracts";
import StoryCard from "./components/StoryCard";
import StorySingle from "./components/StorySingle";

function App() {

  // const [stories, setStories] = React.useState("");
  // React.useEffect(() => {
  //   const fetchStories = async () => {
  //     const response = await getContent();
  //     //const { storiesContent } = await response.json();
  //     setStories(response);
  //   };
  //   fetchStories();
  // }, []);
  //useState([{id: v4(), story: () => getFirstContent(), name: "$STORY"}, {id: v4(), story: () => getFirstContent(), name: "$STORY2"}])

  return (
    <Router>
      <div>
        <Navigate />
        <Routes>
          <Route path="/" element={<Mint />}></Route>
          <Route path="/mint" element={<Mint />}></Route>
          <Route path="/list" element={<List />}></Route>
          <Route path="/story/:id" element={<StorySingle />}></Route>
          <Route path="/submitPR" element={<PR />}></Route>
          <Route path="/vote" element={<Vote />}></Route>
          <Route path="/admin" element={<Admin />}></Route>
        </Routes>
      </div>
      <div>
        <ToastContainer />

        <hr></hr>
        <p className="text-center">
          Made with ❤️ by Annu, Marci, Rohan &amp; Sagar for DappCamp
        </p>
      </div>
    </Router>
  );
}

export default App;
