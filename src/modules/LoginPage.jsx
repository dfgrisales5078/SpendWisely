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
      const response = await fetch("http://localhost:2020/login", {
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
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <h2 className="text-4xl text-center p-3">Welcome to SpendWisely!</h2>
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
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 px-2 rounded-md 
            shadow-md transition duration-300 ease-in-out hover:bg-blue-600 
            hover:shadow-lg active:bg-blue-700"
          >
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
  );
}

export default LoginPage;
