// import { useState } from 'react'
import "./HRPage.css";

function HRPage() {
  return (
    <div className="container">

      <header>
        <h1>DRDO Internship Management Portal</h1>
        <button className="btn">HR</button>
      </header>

      <main>

        <section className="menuSection">
          <div className="op loginAs flex-center">
            <p>Login As:</p>
            <h1>Human Resource</h1>
          </div>
          <div className="op menu active">New Interns</div>
          <div className="op menu">Undergoing</div>
          <div className="op menu">Completed</div>
          <div className="op menu">Issue Certificate</div>
          <div className="addNewIntern">Add New Intern</div>
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
              <th>Duration</th>
              <th>Joined On</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alice Sharma</td>
              <td>alice@abc.com</td>
              <td>9876543210</td>
              <td>XYZ University</td>
              <td>B.Tech CSE</td>
              <td>6 months</td>
              <td>Apr 10, 2025</td>
            </tr>
            <tr>
              <td>Rahul Verma</td>
              <td>rahul@example.com</td>
              <td>9123456789</td>
              <td>ABC College</td>
              <td>MBA</td>
              <td>3 months</td>
              <td>Mar 25, 2025</td>
            </tr>
          </tbody>
        </table>
        </section>

      </main>

    </div>
  );
}

export default HRPage;
