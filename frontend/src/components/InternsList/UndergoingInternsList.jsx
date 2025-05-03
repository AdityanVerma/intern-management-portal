import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import "./InternsList.css";

function NewInterns() {
  const [user, setUser] = useState(null);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);

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

        console.log(filteredInterns);
        // Filtering based on role
        if (user?.role === "hr") {
          // HR should see "undergoing" interns
          filteredInterns = filteredInterns.filter(
            (intern) => intern.internStatus === "undergoing"
          );
        } else if (user?.role === "mentor") {
          // Mentors should only see "undergoing" interns with matching requestedMentorId
          filteredInterns = filteredInterns.filter(
            (intern) =>
              intern.internStatus === "undergoing" &&
              intern.mentorId?.includes(user?._id)
          );
        }
        console.log(filteredInterns);

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

  // useEffects
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchInterns();
    }
  }, [user]);

  // Messages
  if (!user) return <div>Loading user info...</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {interns.length === 0 ? (
        <p>No interns to display.</p>
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
              {user?.role === "hr" ? <th>Assigned Mentor</th> : <th>Review</th>}
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
                    <div>{intern?.mentorId?.includes(user?._id)?.fullName}</div>
                  ) : (
                    <div>null</div>
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
