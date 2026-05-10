import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function CreateAccount() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // Basic validation (you can expand later)
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // TODO: Add backend or local storage logic here
    navigate("/home");
  }

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "black",
        overflow: "hidden"
      }}
    >

      {/* HEADER */}
      <div
        style={{
          padding: "20px 0",
          textAlign: "center"
        }}
      >
        <p
          style={{
            color: "white",
            fontSize: "26px",
            fontWeight: "600",
            textDecoration: "underline",
            margin: 0
          }}
        >
          Create Account
        </p>
      </div>

      {/* FORM SECTION */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            width: "90vw",
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "15px"
          }}
        >
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={inputStyle}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            style={inputStyle}
          />

          <button
            type="submit"
            style={{
              marginTop: "10px",
              padding: "12px",
              backgroundColor: "white",
              color: "black",
              fontSize: "18px",
              fontWeight: "600",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            Create Account
          </button>
        </form>
      </div>

      {/* FOOTER */}
      <div
        style={{
          padding: "20px 0",
          textAlign: "center"
        }}
      >
        <p style={{ margin: 0 }}>
          <Link
            to="/"
            style={{
              color: "white",
              fontSize: "20px",
              textDecoration: "underline",
              fontWeight: "500"
            }}
          >
            Back to Login
          </Link>
        </p>
      </div>

    </div>
  );
}

const inputStyle = {
  padding: "12px",
  fontSize: "16px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  outline: "none"
};
