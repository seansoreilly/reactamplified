import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import Calendar from './Calendar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:uuid" element={<Calendar />} />
      </Routes>
    </Router>
  );
}

export default App;

