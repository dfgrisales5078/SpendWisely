import React, { useState } from "react";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import LoginPage from "./modules/LoginPage";
import ForgotPasswordPage from "./modules/ForgotPasswordPage";
import RegisterPage from "./modules/RegisterPage";
import TransactionsPage from "./modules/TransactionsPage";
import GraphsPage from "./modules/GraphPage";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const handleSignOut = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
    localStorage.removeItem("user_id");
    localStorage.removeItem("name");
  };

  return (
    <Router>
      <div>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          {isLoggedIn && (
            <li>
              <Link to="/bar-graph" className="nav-link">
                Bar Graph
              </Link>
            </li>
          )}
          {!isLoggedIn && (
            <>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/forgot-password" className="nav-link">
                  Forgot password
                </Link>
              </li>
            </>
          )}
          {isLoggedIn && (
            <li className="nav-item ml-auto">
              <Link to="/" className="nav-link" onClick={handleSignOut}>
                Sign out
              </Link>
            </li>
          )}
        </ul>

        <div className="center-vertically">
          <Routes>
            <Route
              path="/"
              element={<LoginPage setIsLoggedIn={setIsLoggedIn} />}
            />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/bar-graph" element={<GraphsPage />}>
              {" "}
            </Route>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
