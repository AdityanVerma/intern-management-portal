import React from "react";
import "./InternsList.css";

function InternList({
  interns = [],
  userRole = "",
  getMentorsForDomain,
  onDomainChange,
  onMentorAssign,
  onAccept,
  onReject,
}) {
  const statusOrder = { new: 1, undergoing: 2, completed: 3 };

  const sortedInterns = [...interns].sort((a, b) => {
    return statusOrder[a.internStatus] - statusOrder[b.internStatus];
  });

  return (
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
          <th>Status</th>
          <th>Domain</th>
          <th>{userRole === "HR" ? "Assign Mentor" : "Action"}</th>
        </tr>
      </thead>
      <tbody>
        {sortedInterns.map((intern, index) => (
          <tr key={index}>
            <td>{intern.fullName}</td>
            <td>{intern.email}</td>
            <td>{intern.phone}</td>
            <td>{intern.college}</td>
            <td>{intern.course}</td>
            <td>{intern.internStatus}</td>

            {/* Domain / Department */}
            <td>
              {userRole === "HR" ? (
                <select
                  value={intern.domain || ""}
                  onChange={(e) => onDomainChange(e.target.value, intern._id)}
                >
                  <option value="">Select Domain</option>
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  {/* Add more as needed */}
                </select>
              ) : (
                intern.domain || "—"
              )}
            </td>

            <td>{intern.duration}</td>
            <td>{new Date(intern.createdAt).toLocaleDateString()}</td>

            {/* Assign Mentor / Accept Reject */}
            <td>
              {userRole === "HR" ? (
                <select
                  value={intern.mentor || ""}
                  onChange={(e) => onMentorAssign(e.target.value, intern._id)}
                >
                  <option value="">Assign Mentor</option>
                  {getMentorsForDomain(intern.domain || "").map((mentor) => (
                    <option key={mentor.id} value={mentor.name}>
                      {mentor.name}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <button onClick={() => onAccept(intern._id)}>Accept</button>
                  <button onClick={() => onReject(intern._id)}>Reject</button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default InternList;
