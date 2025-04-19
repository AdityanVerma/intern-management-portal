// import { useState } from 'react'
import "./MentorPage.css";
import Header from "../../components/Header.jsx";

function HRPage() {
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

export default HRPage;
