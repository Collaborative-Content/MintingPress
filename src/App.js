import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigate from "./components/NavBar";
import Mint from "./pages/Mint";
import List from "./pages/List";
import PR from "./pages/PR";
import Vote from "./pages/Vote";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { requestAccount } from './utils/common';
import { getFirstContent } from './utils/Contracts';

function App() {
  return (
    <Router>
      <div>
        <Navigate />
        <Routes>
          <Route path="/" element={<Mint />}></Route>
          <Route path="/mint" element={<Mint />}></Route>
          <Route path="/view-story/:id" element={<PR id={""} />}></Route>
          <Route path="/list" element={<List />}></Route>
          <Route path="/vote" element={<Vote />}></Route>
          <Route path="/submitPR" element={<PR />}></Route>
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
