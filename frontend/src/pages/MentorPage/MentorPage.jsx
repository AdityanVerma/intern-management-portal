// import { useState } from 'react'
import "./MentorPage.css";

function HRPage() {
  return (
    <div className="container">

      <header>
        <h1>DRDO Internship Management Portal</h1>
        <button className="btn">Mentor</button>
      </header>

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

export default HRPage;
