import React, { useState } from 'react';
import {
  BrowserRouter as Router, Route, Routes
} from "react-router-dom";
import './App.css';
import Home from './Component/Home/Home';
import Inbox from "./Component/Inbox/Inbox";
import Navigationbar from './Component/Navigationbar/Navigationbar';
import PrivateRoute from './Component/PrivateRoute/PrivateRoute';

export default function App() {

  const [sessionToken,setsessionToken] = useState(sessionStorage.getItem("token"));

  return (
    <Router>
      <Navigationbar sessionToken={sessionToken} setsessionToken={setsessionToken}/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/inbox" element={
            <PrivateRoute>
              <Inbox setsessionToken={setsessionToken}/>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}