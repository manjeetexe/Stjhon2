import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Team from './page/Team';
import Home from './page/Home';
import Profile from './page/profile'
import MSG from './page/MSG'
import Search from './page/Search'
const App = () => {
  return (
    <>
    
        <Router>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Team />} />
            <Route path="/userprofile" element={<Profile />} />
            <Route path="/msg" element={<MSG />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </Router>
    </>
  )
}

export default App