import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Team from './page/Team';
import Home from './page/Home';
import Profile from './page/profile'
import MSG from './page/MSG'
import Search from './page/Search'
import UserLogin from './page/userLogin'
import UserSignup from './page/userSignup'
import AdvocateSignup from './page/AdvoSignup';
import AdvocateLogin from './page/Advologin'


const App = () => {
  return (
    <>
    
        <Router>
          <Routes>
            <Route path="/home" element={<Home />} />
            <Route path="/" element={<Team />} />
            <Route path="/userprofile" element={<Profile />} />
            <Route path="/usermsg" element={<MSG />} />
            <Route path="/usersearch" element={<Search />} />
            <Route path="/userlogin" element={<UserLogin />} />
            <Route path="/usersignup" element={<UserSignup />} />
            <Route path="/advocatesignup" element={<AdvocateSignup />} />
            <Route path="/advocatelogin" element={<AdvocateLogin />} />

          </Routes>
        </Router>
    </>
  )
}

export default App