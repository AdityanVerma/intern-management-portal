import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import "./InternsList.css";

function NewInterns() {
  const [user, setUser] = useState(null);
  const [interns, setInterns] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [mentorDataLoading, setMentorDataLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetching current User
  const fetchCurrentUser = async () => {
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
      if (data?.data?.user) {
        setUser(data.data.user);
      } else {
        console.error("User ID not found in response:", data);
      }
    } catch (error) {
      console.error("❌ Error:", error.message);
    }
  };

  // Fetching interns with internStatus
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
        let filteredInterns = data?.data?.intern || [];

        // Filtering based on role
        if (user?.role === "hr") {
          // HR should see "new" and "pending" interns
          filteredInterns = filteredInterns.filter(
            (intern) =>
              intern.internStatus === "new" || intern.internStatus === "pending"
          );
        } else if (user?.role === "mentor") {
          // Mentors should only see "pending" interns with matching requestedMentorId
          filteredInterns = filteredInterns.filter(
            (intern) =>
              intern.internStatus === "pending" &&
              intern.requestedMentorIds?.includes(user?._id)
          );
        }

        setInterns(filteredInterns);
      } else {
        toast.error("Failed to fetch interns");
      }
    } catch (error) {
      toast.error(
        error?.message || "Something went wrong while fetching interns!!",
        {
          position: "bottom-right",
          autoClose: 3000,
        }
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetching mentors along with department
  const fetchMentors = async () => {
    try {
      const [userResponse, departmentResponse] = await Promise.all([
        fetch("http://localhost:7000/api/v1/auth/mentor-data"),
        fetch("http://localhost:7000/api/v1/departments/get-departments"),
      ]);

      const userData = await userResponse.json();
      const departmentData = await departmentResponse.json();

      if (userResponse.ok && departmentResponse.ok) {
        setMentors(userData?.data?.user || []);
        setDepartments(departmentData?.data?.department || []);
      } else {
        setError("Failed to fetch mentors or departments");
      }
    } catch (err) {
      setError(err?.message || "Error fetching mentors/departments");
    } finally {
      setMentorDataLoading(false);
    }
  };

  // Helper Function to get Mentors' Department name
  const getDepartmentName = (deptId) => {
    if (!deptId || !Array.isArray(departments) || departments.length === 0) {
      return "UNKNOWN DEPARTMENT";
    }

    const dept = departments.find((d) => d._id === deptId);
    return dept?.departmentName?.toUpperCase() || "UNKNOWN DEPARTMENT";
  };

  // onAssign Mentor
  const onMentorAssign = async (mentorId, internId, mentorName, internName) => {
    if (user?.role !== "hr") {
      toast.error("Only HR can assign mentors.");
      return;
    }

    const mentor = mentors.find((m) => m._id === mentorId);
    const departmentName = getDepartmentName(mentor?.departmentId);

    const confirmed = window.confirm(
      `Are you sure you want to request\n${mentorName} (${departmentName}) as the mentor for\n${internName}?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        "http://localhost:7000/api/v1/interns/request-mentor",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ internId, mentorId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Mentor request sent successfully!", {
          position: "bottom-right",
          autoClose: 3000,
        });
        fetchInterns();
      } else {
        toast.error(data?.message || "Failed to send mentor request.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error(err.message || "An error occurred.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  // onAccept Mentor
  const onAccept = async (internId, mentorId) => {
    const confirmed = window.confirm(
      "Are you sure you want to accept this intern?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:7000/api/v1/interns/mentor-accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            internId,
            mentorId: user?.role === "mentor" ? mentorId : "",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Intern accepted successfully!", {
          position: "bottom-right",
          autoClose: 3000,
        });
        fetchInterns();
      } else {
        toast.error(data?.message || "Failed to accept intern.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error(err.message || "An error occurred.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  // onReject Mentor
  const onReject = async (internId, mentorId) => {
    const confirmed = window.confirm(
      "Are you sure you want to reject this intern?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:7000/api/v1/interns/mentor-reject`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            internId,
            mentorId: user?.role === "mentor" ? mentorId : "",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Intern rejected successfully!", {
          position: "bottom-right",
          autoClose: 3000,
        });
        fetchInterns();
      } else {
        toast.error(data?.message || "Failed to reject intern.", {
          position: "bottom-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error(err.message || "An error occurred.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  // useEffects
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchInterns();
      fetchMentors();
    }
  }, [user]);

  // Messages
  if (!user) return <div>Loading user info...</div>;
  if (loading || mentorDataLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {interns.length === 0 ? (
        <p>No new interns to display.</p>
      ) : (
        <table className="newInternTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Email</th>
              <th>Phone</th>
              <th>College</th>
              <th>Course</th>
              <th>Internship Duration</th>
              <th>Intern Status</th>
              <th>Joined On</th>
              {user?.role === "hr" ? <th>Assign Mentor</th> : <th>Action</th>}
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
                <td>{intern.internStatus.toUpperCase()}</td>

                <td>
                  {new Date(intern.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>

                <td>
                  {user?.role === "hr" ? (
                    <select
                      value={intern.mentor || ""}
                      onChange={(e) => {
                        const selectedMentorId = e.target.value;
                        const selectedMentor = mentors.find(
                          (m) => m._id === selectedMentorId
                        );
                        onMentorAssign(
                          selectedMentorId,
                          intern._id,
                          selectedMentor?.fullName,
                          intern.fullName
                        );
                      }}
                    >
                      <option value="">Assign Mentor</option>
                      {departments.length > 0 &&
                        mentors.map((mentor) => {
                          const deptName = getDepartmentName(
                            mentor.departmentId
                          );
                          return (
                            <option key={mentor._id} value={mentor._id}>
                              {mentor.fullName} ({deptName})
                            </option>
                          );
                        })}
                    </select>
                  ) : (
                    <div className="flex-cen-all action-btn">
                      <button
                        type="button"
                        className="accept-btn"
                        onClick={() => onAccept(intern._id, user._id)}
                      >
                        Accept
                      </button>
                      /
                      <button
                        type="button"
                        className="reject-btn"
                        onClick={() => onReject(intern._id, user._id)}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <ToastContainer />
    </div>
  );
}

export default NewInterns;
