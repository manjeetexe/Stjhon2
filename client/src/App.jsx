import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Team from './page/Team';
import Home from './page/Home';


const App = () => {
  return (
    <>
    
        <Router>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Team />} />
          </Routes>
        </Router>
    </>
  )
}

export default App