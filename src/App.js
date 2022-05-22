import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import React from "react";
import { ToastContainer } from "react-toastify";
import StorySingle from "./components/StorySingle";
import Navigate from "./components/NavBar";
import Landing from "./pages/Landing";
import Mint from "./pages/Mint";
import List from "./pages/List";
import SubmitPR from "./pages/SubmitPR";
import Vote from "./pages/Vote";
import Admin from "./pages/Admin";
import {ThemeProvider} from "styled-components";
import { useDarkMode } from "./components/useDarkMode"
import { GlobalStyles } from "./components/globalStyles";
import { lightTheme, darkTheme } from "./components/Themes"

function App() {
  const [theme, themeToggler, mountedComponent] = useDarkMode();

  const themeMode = theme === 'light' ? lightTheme : darkTheme;

  if(!mountedComponent) return <div/>
  return (
    <ThemeProvider theme={themeMode}>
      <>
        <GlobalStyles/>

        <Router>
          <div>
            <Navigate theme={theme} themeToggler={themeToggler}/>
            <Routes>
              <Route path="/" element={<Landing />}></Route>
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
            <p className="footerText text-center">
              Made with ❤️ by the MintingPress team.
            </p>
          </div>
        </Router>
    </>
  </ThemeProvider>
  );
}

export default App;
