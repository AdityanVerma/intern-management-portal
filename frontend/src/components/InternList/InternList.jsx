import React from "react";
import "./InternList.css"

function InternList() {
  return (
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
              <option value="Mentor1" defaultValue={true}>
                Mentor 1
              </option>
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
              <option value="Mentor1" defaultValue={true}>
                Mentor 1
              </option>
              <option value="Mentor2">Mentor 2</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default InternList;
