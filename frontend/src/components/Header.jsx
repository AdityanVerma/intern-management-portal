import { useLocation } from "react-router-dom";
import "./Header.css";

function Header({ loginAs }) {
  const location = useLocation();

  // Check if current path is the login page
  const isLoginPage = location.pathname === "/login";

  return (
    <header>
      <h1>DRDO Internship Management Portal</h1>
      {!isLoginPage && (
        <button className="flex-cen-all login-btn">{loginAs}</button>
      )}
    </header>
  );
}

export default Header;
