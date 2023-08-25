import React from 'react';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import LoginPage from './modules/LoginPage';
import ForgotPasswordPage from './modules/ForgotPasswordPage';
import RegisterPage from './modules/RegisterPage';
import './App.css'; 

function App() {
  return (
    <Router>
      <div>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/register" className="nav-link">Register</Link>
          </li>
          <li className="nav-item">
            <Link to="/forgot-password" className="nav-link">Forgot password</Link>
          </li>
          <li className="nav-item">
            <Link to="/transactions" className="nav-link">Transactions</Link>
          </li>
        </ul>

        <div className="center-vertically">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
