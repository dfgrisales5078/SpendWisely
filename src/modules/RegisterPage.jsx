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

  const handleSubmit = async (event) => {
    event.preventDefault();
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
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card border-0">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Register</h2>

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

              <form onSubmit={handleSubmit}>
                <div className="form-group">
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

                <button type="submit" className="btn btn-primary btn-block">
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
