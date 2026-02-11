import { useEffect, useState } from "react";
import "./MentorPage.css";
import Header from "../../components/Header/Header.jsx";
import { NavLink, Outlet } from "react-router-dom";

function MentorPage() {
  const [user, setUser] = useState({});
  const internNavPath = `/user/${user._id}/mentor/interns`;

  // Fetching Current User from API
  useEffect(() => {
    const fetchMentorData = async () => {
      try {
        const response = await fetch(
          "https://intern-management-portal-api-backend.onrender.com/api/v1/auth/current-user",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        if (data?.data?.user) {
          setUser(data.data.user);
        } else {
          console.error("User ID not found in response:", data);
        }
      } catch (error) {
        console.error("❌ Error:", error.message);
      }
    };

    fetchMentorData();
  }, []);

  return (
    <div className="screen-container">
      <Header loginAs="M" />

      <main>
        <section className="menuSection">
          <div className="op loginAs flex-center">
            <p>Login As:</p>
            <h1>{user.fullName}</h1>
          </div>
          <NavLink
            to={`${internNavPath}/new`}
            end
            className={({ isActive }) => `op menu ${isActive ? "active" : ""}`}
          >
            New Interns
          </NavLink>
          <NavLink
            to={`${internNavPath}/undergoing`}
            end
            className={({ isActive }) => `op menu ${isActive ? "active" : ""}`}
          >
            Undergoing
          </NavLink>
          <NavLink
            to={`${internNavPath}/completed`}
            end
            className={({ isActive }) => `op menu ${isActive ? "active" : ""}`}
          >
            Completed
          </NavLink>
        </section>

        <section className="displaySection">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default MentorPage;
