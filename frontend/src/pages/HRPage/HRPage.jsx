// import { useState } from 'react'
import "./HRPage.css";

function HRPage() {
  return (
    <>
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
            <div className="op menu active">New Intern</div>
            <div className="op menu">Undergoing</div>
            <div className="op menu">Completed</div>
            <div className="op menu">Certificate Issue</div>
            <div className="addNewIntern">Add New Intern</div>
          </section>

          <section className="displaySection"></section>

        </main>

      </div>
    </>
  );
}

export default HRPage;
