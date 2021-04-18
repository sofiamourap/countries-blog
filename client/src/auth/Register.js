import React, { useState } from "react";
import { auth } from "../firebase";
import { toast } from "react-toastify";

export default function Register() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const config = {
      url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
      handleCodeInApp: true,
    };
    const result = await auth.sendSignInLinkToEmail(email, config);
    console.log("this is the result", result);
    //show toast notification to user avout email sent
    toast.success(
      `An email was send to ${email}. Click the link to complete your registration`
    );
    //save user email to local storage
    window.localStorage.setItem("emailFormRegistration", email);
    setEmail("");
    setLoading(false);
  };

  return (
    <div className="container p-5">
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <h4>Register</h4>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email Adress</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Enter email"
            disabled={loading}
          />
        </div>
        <button
          className="btn btn-raised btn-primary"
          disabled={!email || loading}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
