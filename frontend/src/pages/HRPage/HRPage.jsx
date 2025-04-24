import { useEffect, useState } from "react";
import "./HRPage.css";
import Header from "../../components/Header/Header.jsx";
import { NavLink, Outlet } from "react-router-dom";

function HRPage() {
  // Fetch hr verification
  const [userId, setUserId] = useState({});
  const internNavPath = `/user/${userId}/hr/interns`;

  useEffect(() => {
    const fetchHRData = async () => {
      try {
        const response = await fetch(
          "http://localhost:7000/api/v1/auth/current-user",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();
        setUserId(data.data.user._id);
      } catch (error) {
        console.error("❌ Error:", error.message);
      }
    };

    fetchHRData();
  }, []);

  return (
    <div className="screen-container">
      <Header loginAs="HR" />

      <main>
        <section className="menuSection">
          <div className="op loginAs flex-center">
            <p>Login As:</p>
            <h1>Human Resource</h1>
          </div>
          <NavLink
            to={`${internNavPath}/new`}
            end
            className={({ isActive }) => {
              console.log("isActive", isActive); // Check this in devtools console
              return `op menu ${isActive ? "active" : ""}`;
            }}
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
            to={`${internNavPath}/certify`}
            end
            className={({ isActive }) => `op menu ${isActive ? "active" : ""}`}
          >
            Issue Certificate
          </NavLink>
          <NavLink
            to={`${internNavPath}/completed`}
            end
            className={({ isActive }) => `op menu ${isActive ? "active" : ""}`}
          >
            Completed
          </NavLink>
          <button className="flex-cen-all addNewIntern">Add New Intern</button>
        </section>

        <section className="displaySection">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

export default HRPage;
