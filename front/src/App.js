import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MessageEncryption from './components/MessageEncryption';
import KeyGeneration
// import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        {/* <Navbar /> */}
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<KeyGeneration />} />
            <Route path="/encrypt" element={<MessageEncryption />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;