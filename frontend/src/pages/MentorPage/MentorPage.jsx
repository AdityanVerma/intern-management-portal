import { useEffect } from 'react'
import "./MentorPage.css";
import Header from "../../components/Header.jsx";

function MentorPage() {
  // Fetch hr verification
  useEffect(() => {
    const fetchHRData = async () => {
      try {
        const response = await fetch("http://localhost:7000/api/v1/users/mentor", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        console.log("Response:", data.message);
      } catch (error) {
        console.error("❌ HR Page Error:", error.message);
      }
    };

    fetchHRData();
  }, []);

  return (
    <div className="screen-container">
      <Header loginAs="M" />

      <main>
        <section className="menuSection">
          <div className="op loginAs flex-center">
            <p>Login As:</p>
            <h1>Mentor Name</h1>
          </div>
          <div className="op menu active">New Interns</div>
          <div className="op menu">Undergoing</div>
          <div className="op menu">Completed</div>
        </section>

        <section className="displaySection"></section>
      </main>
    </div>
  );
}

export default MentorPage;
