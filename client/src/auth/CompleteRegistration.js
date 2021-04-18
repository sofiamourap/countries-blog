import React, { useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export default function CompleteRegistration() {
  const { dispatch } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    //validation
    if (!email || !password) {
      toast.error("Email and password required");
      return;
    }
    try {
      const result = await auth.signInWithEmailLink(
        email,
        window.location.href
      );
      console.log(result);
      if (result.user.emailVerified) {
        window.localStorage.removeItem("emailForRegistration");
        let user = auth.currentUser;
        await user.updatePassword(password);
        //dispatch user with token and email then redirect
        const idTokenResult = await user.getIdTokenResult();
        dispatch({
          type: "LOGGED_IN_USER",
          payload: { email: user.email, token: idTokenResult.token },
        });
        //make api request to save/update user in mongodb
        history.push("/");
      }
    } catch (error) {
      console.log("register complete error", error.message);
      setLoading(false);
      toast.error(error.message);
    }
  };

  let history = useHistory();

  useEffect(() => {
    setEmail(window.localStorage.getItem("emailForRegistration"));
  }, []);

  return (
    <div className="container p-5">
      {loading ? (
        <h4 className="text-danger">Loading...</h4>
      ) : (
        <h4>Complete Your Registration</h4>
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
            disabled
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-control"
            placeholder="Enter password"
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
