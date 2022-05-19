import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigate from "./components/NavBar";
import Mint from "./pages/Mint";
import List from "./pages/List";
import SubmitPR from "./pages/SubmitPR";
import Vote from "./pages/Vote";
import Admin from "./pages/Admin";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import StorySingle from "./components/StorySingle";

function App() {

  return (
    <Router>
      <div>
        <Navigate />
        <Routes>
          <Route path="/" element={<List />}></Route>
          <Route path="/mint" element={<Mint />}></Route>
          <Route path="/list" element={<List />}></Route>
          <Route path="/story/:id" element={<StorySingle />}></Route>
          <Route path="/story/:id/submitPR" element={<SubmitPR />}></Route>
          <Route path="/story/:id/:pr_id/vote" element={<Vote />}></Route>
          <Route path="/admin" element={<Admin />}></Route>
        </Routes>
      </div>
      <div>
        <ToastContainer />

        <hr></hr>
        <p className="text-center">
          Made with ❤️ by the MintingPress team.
        </p>
      </div>
    </Router>
  );
}

export default App;
