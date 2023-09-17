import React from "react";

function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form>
        <div className="form-group">
          <h2 className="text-4xl text-center p-3">Password Reset</h2>
          <input
            type="email"
            className="form-control"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <button
            type="submit"
            className="bg-blue-500 text-white w-full py-2 px-2 rounded-md 
            shadow-md transition duration-300 ease-in-out hover:bg-blue-600 
            hover:shadow-lg active:bg-blue-700"
          >
            Reset Password
          </button>
          <p className="text-center mt-3">
            <a href="/" className="btn btn-link">
              Remembered? Log in now!
            </a>
            <a href="register" className="btn btn-link">
              Not enrolled? Sign up now!
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default ForgotPasswordPage;
