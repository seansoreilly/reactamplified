import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Calendar from './Calendar';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={`/${uuidv4()}`} />} />
        <Route path="/:uuid" element={<Calendar />} />
      </Routes>
    </Router>
  );
};

export default App;