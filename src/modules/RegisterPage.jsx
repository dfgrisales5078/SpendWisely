import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const [name, setName] = useState("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    emailRef.current = event.target.value;
  };

  const handlePasswordChange = (event) => {
    passwordRef.current = event.target.value;
  };

  const checkPasswordStrength = (password) => {
    const min = 8;
    const hasNumber = /\d/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);

    if (password.length >= min && hasNumber && hasUpperCase && hasLowerCase) {
      return true;
    }
    return false;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!checkPasswordStrength(passwordRef.current)) {
      setError("Password is not strong enough.");
      return;
    }

    try {
      const response = await fetch("http://localhost:2020/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email: emailRef.current,
          password: passwordRef.current,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message || "An unexpected error occurred. Please try again."
        );
        return;
      }

      setError("");
      setSuccessMessage("User registered successfully!");

      setTimeout(() => {
        setSuccessMessage("");
        navigate("/");
      }, 3000);
    } catch (error) {
      setError("An account with this email already exists.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <h2 className="text-4xl text-center p-3">Register now!</h2>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            className="form-control"
            placeholder="Enter your name"
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            onChange={handleEmailChange}
            className="form-control"
            placeholder="Enter your email"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            onChange={handlePasswordChange}
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
          {successMessage && (
            <div
              className="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              {successMessage}
              <button
                type="button"
                className="close"
                data-dismiss="alert"
                aria-label="Close"
                onClick={() => setSuccessMessage("")}
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
            Register
          </button>
          <p className="text-center mt-3">
            <a href="login" className="btn btn-link">
              Already enrolled? Log in now!
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

export default RegisterPage;
