import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Team from './page/Team'


const App = () => {
  return (
    <>
    
        <Router>
          <Routes>
            <Route path="/" element={<Team />} />
          </Routes>
        </Router>
    </>
  )
}

export default App