import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import AuctionList from './AuctionList';
import Auction from './Auction';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<AuctionList />} />
        <Route path="/auction/:id" element={<Auction />} />
      </Routes>
    </Router>
  );
}

export default App;