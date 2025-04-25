/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import "./InternsList.css";

function NewInterns() {
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch interns with internStatus = "new"
  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const response = await fetch(
          "http://localhost:7000/api/v1/interns/interns-data",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          // Filter interns with status "new"
          const newInterns = data?.data?.intern?.filter(
            (intern) => intern.internStatus === "new"
          );
          setInterns(newInterns);
        } else {
          setError("Failed to fetch interns");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInterns();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {interns.length === 0 ? (
        <p>No new interns to display.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Phone</th>
              <th>College</th>
              <th>Course</th>
              <th>Internship Duration</th>
              <th>Joined On</th>
              <th>Domain</th>
              <th>Assign Mentor</th>
            </tr>
          </thead>
          <tbody>
            {interns.map((intern) => (
              <tr key={intern._id}>
                <td>{intern.fullName}</td>
                <td>{intern.age}</td>
                <td>{intern.email}</td>
                <td>{intern.phone}</td>
                <td>{intern.college}</td>
                <td>{intern.course}</td>
                <td>{intern.duration}</td>

                <td>
                  {new Date(intern.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>

                <td>
                  <select
                    value={intern.domain || ""}
                    onChange={(e) => onDomainChange(e.target.value, intern._id)}
                  >
                    <option value="">Select Domain</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    {/* Add more as needed */}
                  </select>
                </td>

                <td>
                  <select
                    value={intern.mentor || ""}
                    onChange={(e) => onMentorAssign(e.target.value, intern._id)}
                  >
                    <option value="">Assign Mentor</option>
                    {/* {getMentorsForDomain(intern.domain || "").map((mentor) => (
                      <option key={mentor.id} value={mentor.name}>
                        {mentor.name}
                      </option>
                    ))} */}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default NewInterns;
