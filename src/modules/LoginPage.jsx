import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      navigate("/transactions");
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setError("Invalid email format. Please enter a valid email address.");
      return;
    }

    if (password.trim() === "") {
      setError("Password cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.status === 200) {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("name", data.name);

        navigate("/transactions");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("There was an error logging in", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                Welcome to SpendWisely!
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    ref={emailRef}
                    className="form-control"
                    placeholder="Enter your email"
                    autoComplete="email"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    ref={passwordRef}
                    className="form-control"
                    placeholder="Enter your password"
                  />
                </div>
                <div>
                  {error && (
                    <div
                      className="alert alert-danger alert-dismissible fade show"
                      role="alert"
                    >
                      {error}
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                        aria-label="Close"
                        onClick={() => setError("")}
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary btn-block">
                    Login
                  </button>
                  <p className="text-center mt-3">
                    <a href="register" className="btn btn-link">
                      Not enrolled? Sign up now!
                    </a>
                    <a href="forgot-password" className="btn btn-link">
                      Forgot password?
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
