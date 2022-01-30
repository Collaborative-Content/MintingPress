
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigate from './components/NavBar'
import Mint from './pages/Mint'
import List from './pages/List'
import PR from './pages/PR'
import Vote from './pages/Vote'
import 'bootstrap/dist/css/bootstrap.min.css'
import { requestAccount } from './utils/common';


function App() {

  return (
    <Router>
      <div>
        <Navigate />
        <Routes>
          <Route path="/mint" element={<Mint/>}>
          </Route>
          <Route path="/view-story/:id" element={<PR id={""}/>}>
          </Route>
          <Route path="/list" element={<List />}>
          </Route>
          <Route path="/vote" element={<Vote />}>
          </Route>
        </Routes>
      </div>
      {/* for sample contract */}
      {/* <button onClick={requestAccount}>write some text between</button> */}
    </Router>
  )
}

export default App;
