import React, { useState } from "react";
import { signup } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";

function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setMessage(null);

    if (!form.email || !form.password) {
      setMessage({ type: "danger", text: "All fields required" });
      return;
    }

    try {
      setLoading(true);
      await signup(form);

      setMessage({
        type: "success",
        text: "User created successfully",
      });

      setTimeout(() => navigate("/"), 1000);
    } catch {
      setMessage({ type: "danger", text: "Signup failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <h3 className="text-center mb-3">Signup</h3>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <input
        className="form-control mb-3"
        placeholder="Email"
        value={form.email}
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        type="password"
        className="form-control mb-3"
        placeholder="Password"
        value={form.password}
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button
        className="btn btn-success w-100"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Creating account...
          </>
        ) : (
          "Signup"
        )}
      </button>

      <p className="text-center mt-3">
        Already have an account? <Link to="/">Login</Link>
      </p>
    </AuthCard>
  );
}

export default Signup;
