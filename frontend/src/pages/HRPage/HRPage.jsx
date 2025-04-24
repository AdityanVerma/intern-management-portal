import { useEffect } from "react";
import "./HRPage.css";
import Header from "../../components/Header.jsx";

function HRPage() {
  // Fetch hr verification
  useEffect(() => {
    const fetchHRData = async () => {
      try {
        const response = await fetch("http://localhost:7000/api/v1/users/hr", {
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
      <Header loginAs="HR" />

      <main>
        <section className="menuSection">
          <div className="op loginAs flex-center">
            <p>Login As:</p>
            <h1>Human Resource</h1>
          </div>
          <button className="op menu">New Interns</button>
          <button className="op menu">Undergoing</button>
          <button className="op menu">Completed</button>
          <button className="op menu">Issue Certificate</button>
          <button className="flex-cen-all addNewIntern">Add New Intern</button>
        </section>

        <section className="displaySection">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>College</th>
                <th>Course</th>
                <th>Department</th>
                <th>Duration</th>
                <th>Joined On</th>
                <th>Assign Mentor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Alice Sharma</td>
                <td>alice@abc.com</td>
                <td>9876543210</td>
                <td>XYZ University</td>
                <td>B.Tech CSE</td>
                <td>Computer Science</td>
                <td>6 months</td>
                <td>Apr 10, 2025</td>
                <td>
                  {/* <select
                    name="mentor"
                    id="mentor"
                    value={selectedMentor}
                    onChange={handleMentorChange}
                  >
                    <option value="" disabled>
                      Assign Mentor
                    </option>
                    <option value="Mentor1">Mentor 1</option>
                    <option value="Mentor2">Mentor 2</option>
                  </select> */}

                  <select name="mentor" id="mentor">
                    <option value="Mentor1" defaultValue={true}>Mentor 1</option>
                    <option value="Mentor2">Mentor 2</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>Rahul Verma</td>
                <td>rahul@example.com</td>
                <td>9123456789</td>
                <td>ABC College</td>
                <td>B.Tech CSE</td>
                <td>Computer Science</td>
                <td>3 months</td>
                <td>Mar 25, 2025</td>
                <td>
                  {/* <select
                    name="mentor"
                    id="mentor"
                    value={selectedMentor}
                    onChange={handleMentorChange}
                  >
                    <option value="" disabled>
                      Assign Mentor
                    </option>
                    <option value="Mentor1">Mentor 1</option>
                    <option value="Mentor2">Mentor 2</option>
                  </select> */}

                  <select name="mentor" id="mentor">
                    <option value="Mentor1" defaultValue={true}>Mentor 1</option>
                    <option value="Mentor2">Mentor 2</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default HRPage;
