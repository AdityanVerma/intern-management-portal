import "./Login.css";

function Login() {
  return (
    <>
      <div className="container">
        <header>
          <h1>DRDO Internship Management Portal</h1>
        </header>
        <div className="form-container flex-center">
          <div className="login-form ">
            <h1>Login</h1>

            <div className="form-section">
              <form action="/login" method="POST">
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input type="text" id="username" name="username" required />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                  />
                </div>
                <button type="submit">Login</button>
              </form>
              {/* <p className="register-link">
            Don't have an account? <a href="/register">Register here</a>
            </p> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
