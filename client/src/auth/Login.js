import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {};

  return (
    <div className="container">
      <div className="row p-5">
        <h4>login</h4>
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
        </form>
      </div>
    </div>
  );
}
