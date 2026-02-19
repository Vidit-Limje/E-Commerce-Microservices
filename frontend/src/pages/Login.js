import React, { useState } from "react";
import { login } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import AuthCard from "../components/AuthCard";

function Login() {
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
      await login(form);

      setMessage({ type: "success", text: "Login successful" });

      setTimeout(() => navigate("/dashboard"), 800);
    } catch {
      setMessage({ type: "danger", text: "Invalid credentials" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <h3 className="text-center mb-3">Login</h3>

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
        className="btn btn-primary w-100"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Logging in...
          </>
        ) : (
          "Login"
        )}
      </button>

      <p className="text-center mt-3">
        No account? <Link to="/signup">Signup</Link>
      </p>
    </AuthCard>
  );
}

export default Login;
