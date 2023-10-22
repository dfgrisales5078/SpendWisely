import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ setIsLoggedIn }) {
  // Define the state variables for email/password, & error state
  const navigate = useNavigate();
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [error, setError] = useState("");

  // Check if the user is already logged in
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn");
    if (loggedInStatus === "true") {
      navigate("/transactions");
    }
  }, [navigate]);

  // Define the function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get the values from the email and password input fields
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validate the email and password formats
    if (!emailPattern.test(email)) {
      setError("Invalid email format. Please enter a valid email address.");
      return;
    }

    if (password.trim() === "") {
      setError("Password cannot be empty.");
      return;
    }

    // Send the email and password to the server
    try {
      const response = await fetch("http://localhost:2020/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // if successful, update the state variables
      if (response.status === 200) {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user_id", data.user_id);
        localStorage.setItem("name", data.name);

        // redirect the user to the transactions page
        navigate("/transactions");
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("There was an error logging in", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  // Render login form
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          {/* Heading for the login page */}
          <h2 className="text-4xl text-center p-3">Welcome to SpendWisely!</h2>
          {/* Email input field */}
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
        {/* Password input field */}
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
          {/* Conditional rendering of error message */}
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
          {/* Login button */}
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 px-2 rounded-md 
            shadow-md transition duration-300 ease-in-out hover:bg-blue-600 
            hover:shadow-lg active:bg-blue-700"
          >
            Login
          </button>
          {/* Links for registration and forgotten password */}
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
