import React, { useState } from "react";
import { signup } from "../services/api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // 🔒 Frontend validation (prevents 422)
    if (!form.email || !form.password) {
      alert("Email and password are required");
      return;
    }

    if (form.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      console.log("Sending signup data:", form); // 🧪 debug

      await signup({
        email: form.email.trim(),
        password: form.password,
      });

      alert("User created successfully");
      navigate("/");
    } catch (err) {
      console.error(err?.response?.data);
      alert(
        err?.response?.data?.detail
          ? JSON.stringify(err.response.data.detail)
          : "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Signup</h2>

      <input
        value={form.email}
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
      />

      <input
        value={form.password}
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Signup"}
      </button>

      <br /><br />

      <button onClick={() => navigate("/")}>
        Go to Login
      </button>
    </div>
  );
}

export default Signup;
