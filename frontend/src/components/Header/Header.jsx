import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

function Header({ loginAs }) {
  const [isActive, setIsActive] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isLoginPage = location.pathname === "/login";

  // Handle Logout
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      const response = await fetch("https://intern-management-portal-api-backend.onrender.com/api/v1/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Handle Click Outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header>
      <h1>Internship Management Portal</h1>
      {!isLoginPage && (
        <div style={{ position: "relative" }}>
          <button
            className="flex-cen-all profile-btn"
            onClick={() => {
              setIsActive(!isActive);
            }}
          >
            <p className="profile">{loginAs}</p>
            <div className="downarrow"></div>
          </button>

          {isActive && (
            <div ref={dropdownRef} className="custom-select-content">
              <div className="flex-cen-all custom-select-item">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 2.28125C9.0875 2.28125 9.96875 3.1625 9.96875 4.25C9.96875 5.3375 9.0875 6.21875 8 6.21875C6.9125 6.21875 6.03125 5.3375 6.03125 4.25C6.03125 3.1625 6.9125 2.28125 8 2.28125ZM8 10.7188C10.7844 10.7188 13.7188 12.0875 13.7188 12.6875V13.7188H2.28125V12.6875C2.28125 12.0875 5.21562 10.7188 8 10.7188ZM8 0.5C5.92812 0.5 4.25 2.17812 4.25 4.25C4.25 6.32188 5.92812 8 8 8C10.0719 8 11.75 6.32188 11.75 4.25C11.75 2.17812 10.0719 0.5 8 0.5ZM8 8.9375C5.49687 8.9375 0.5 10.1938 0.5 12.6875V14.5625C0.5 15.0781 0.921875 15.5 1.4375 15.5H14.5625C15.0781 15.5 15.5 15.0781 15.5 14.5625V12.6875C15.5 10.1938 10.5031 8.9375 8 8.9375Z"
                    fill="#190A28"
                  ></path>
                </svg>
                <span className="flex-cen-all btn-txt">View Profile</span>
              </div>
              <div
                className="flex-cen-all custom-select-item"
                onClick={handleLogout}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10 4.16667C9.77899 4.16667 9.56702 4.25446 9.41074 4.41074C9.25446 4.56702 9.16667 4.77899 9.16667 5V6.66667C9.16667 7.1269 8.79357 7.5 8.33333 7.5C7.8731 7.5 7.5 7.1269 7.5 6.66667V5C7.5 4.33696 7.76339 3.70107 8.23223 3.23223C8.70107 2.76339 9.33696 2.5 10 2.5H15.8333C16.4964 2.5 17.1323 2.76339 17.6011 3.23223C18.0699 3.70107 18.3333 4.33696 18.3333 5V15C18.3333 15.663 18.0699 16.2989 17.6011 16.7678C17.1323 17.2366 16.4964 17.5 15.8333 17.5H10C9.33696 17.5 8.70107 17.2366 8.23223 16.7678C7.76339 16.2989 7.5 15.663 7.5 15V13.3333C7.5 12.8731 7.8731 12.5 8.33333 12.5C8.79357 12.5 9.16667 12.8731 9.16667 13.3333V15C9.16667 15.221 9.25446 15.433 9.41074 15.5893C9.56703 15.7455 9.77899 15.8333 10 15.8333H15.8333C16.0543 15.8333 16.2663 15.7455 16.4226 15.5893C16.5789 15.433 16.6667 15.221 16.6667 15V5C16.6667 4.77899 16.5789 4.56702 16.4226 4.41074C16.2663 4.25446 16.0543 4.16667 15.8333 4.16667H10Z"
                    fill="#190A28"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M5.58936 6.91075C5.9148 7.23619 5.9148 7.76382 5.58936 8.08926L4.51195 9.16667H12.5001C12.9603 9.16667 13.3334 9.53977 13.3334 10C13.3334 10.4602 12.9603 10.8333 12.5001 10.8333H2.50011C2.16305 10.8333 1.85919 10.6303 1.73021 10.3189C1.60122 10.0075 1.67252 9.64908 1.91085 9.41075L4.41085 6.91075C4.73629 6.58531 5.26392 6.58531 5.58936 6.91075Z"
                    fill="#190A28"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.91083 9.41075C2.23626 9.08531 2.7639 9.08531 3.08934 9.41075L5.58934 11.9107C5.91477 12.2362 5.91477 12.7638 5.58934 13.0893C5.2639 13.4147 4.73626 13.4147 4.41083 13.0893L1.91083 10.5893C1.58539 10.2638 1.58539 9.73619 1.91083 9.41075Z"
                    fill="#190A28"
                  ></path>
                </svg>
                <span className="flex-cen-all btn-txt">Logout</span>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
