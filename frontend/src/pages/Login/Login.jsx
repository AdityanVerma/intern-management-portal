import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Send login request to backend
    try {
      const response = await fetch("http://localhost:7000/api/v1/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // Check if the login was successful
      if (!response.ok) {
        throw new Error("Invalid credentials"); // Handle invalid login
      }

      const data = await response.json();

      //  Print the entire response to the browser console
      console.log("Login response:", data);

      // Store JWT token in localStorage (or a cookie)
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      // Redirect based on role (hr or mentor)
      if (data.data.user.role === "hr") {
        navigate(`/user/${data.data.user._id}/hr`);
      } else if (data.data.user.role === "mentor") {
        navigate(`/user/${data.data.user._id}/mentor`);
      }      
    } catch (error) {
      setError(error.message); // Error message if login fails
    }
  };

  return (
    <>
      <div className="container">
        <div className="form-container flex-center">
          <div className="login-form">
            <h1>Login</h1>

            <div className="form-section">
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit">Login</button>
                {/* Show error message 👇 */}
                {error && <p className="error">{error}</p>}{" "}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
