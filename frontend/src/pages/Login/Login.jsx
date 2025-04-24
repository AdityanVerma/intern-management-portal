/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import "./Login.css";

export default function Login() {
  return (
    <>
      <div className="container">
        <div className="form-container flex-center">
          <div className="login-form ">
            <h1>Login</h1>

            <div className="form-section">
              {/* <form action="/login" method="POST" onSubmit={handleLogin}> */}
              <form action="/login" method="POST">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    // onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    // onChange={handleChange}
                    required
                  />
                </div>
                <button type="submit">Login</button>
                {/* <button type="submit" disabled={loading}>{loading? "Logging In..." : "Login"}</button> */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
