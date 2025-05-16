import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useMemo, useState } from "react";
import "./InternsList.css";

function NewInterns() {
  // DB VARIABES
  const [user, setUser] = useState(null);
  const [interns, setInterns] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [departments, setDepartments] = useState([]);
  // MODAL VARIABLES
  const [hrShowModal, setHrShowModal] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [selectedMentorId, setSelectedMentorId] = useState("");
  const [mentorModalOpen, setMentorModalOpen] = useState(false);
  // REJECT MODAL VARIABLES
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionRemarks, setRejectionRemarks] = useState("");
  const [suggestedMentorId, setSuggestedMentorId] = useState("");
  const [selectedInternId, setSelectedInternId] = useState(null); // To know which intern is being rejected
  // LOADING VARIABLES
  const [mentorDataLoading, setMentorDataLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user
  const fetchCurrentUser = async () => {
    try {
      const res = await fetch(
        "http://localhost:7000/api/v1/auth/current-user",
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();
      if (data?.data?.user) setUser(data.data.user);
    } catch (err) {
      console.error("Error fetching user:", err.message);
    }
  };

  // Fetch interns
  const fetchInterns = async () => {
    try {
      const res = await fetch(
        "http://localhost:7000/api/v1/interns/interns-data",
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();
      if (res.ok) {
        setInterns(data?.data?.intern || []);
      } else {
        toast.error("Failed to fetch interns");
      }
    } catch (err) {
      toast.error(err.message || "Error fetching interns");
    } finally {
      setLoading(false);
    }
  };

  // Filtered interns
  const filteredInterns = useMemo(() => {
    if (!user) return [];

    if (user.role === "hr") {
      return interns.filter(
        (i) => i.internStatus === "new" || i.internStatus === "pending"
      );
    }

    if (user.role === "mentor") {
      return interns.filter(
        (i) =>
          i.internStatus === "pending" &&
          i.requestedMentorIds?.includes(user._id)
      );
    }

    return [];
  }, [interns, user]);

  // Fetch mentors and departments
  const fetchMentors = async () => {
    try {
      const [res1, res2] = await Promise.all([
        fetch("http://localhost:7000/api/v1/auth/mentor-data"),
        fetch("http://localhost:7000/api/v1/departments/get-departments"),
      ]);

      const data1 = await res1.json();
      const data2 = await res2.json();

      if (res1.ok && res2.ok) {
        setMentors(data1?.data?.user || []);
        setDepartments(data2?.data?.department || []);
      } else {
        setError("Failed to load mentors or departments");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setMentorDataLoading(false);
    }
  };

  // Get department name
  const getDepartmentName = (id) => {
    const dept = departments.find((d) => d._id === id);
    return dept?.departmentName?.toUpperCase() || "UNKNOWN";
  };

  // Assign mentor
  const onMentorAssign = async (mentorId, internId, mentorName, internName) => {
    const deptName = getDepartmentName(
      mentors.find((m) => m._id === mentorId)?.departmentId
    );

    const confirm = window.confirm(
      `Confirm mentor request:\n${mentorName} (${deptName}) for ${internName}?`
    );
    if (!confirm) return;

    try {
      const res = await fetch(
        "http://localhost:7000/api/v1/interns/request-mentor",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ internId, mentorId }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Mentor requested!");
        setHrShowModal(false); // move here
        fetchInterns();
      } else {
        toast.error(data?.message || "Request failed.");
      }
    } catch (err) {
      toast.error(err.message || "An error occurred.");
    }
  };

  // onAccept intern
  const onAccept = async (internId, mentorId) => {
    if (!window.confirm("Accept this intern?")) return;
    if (loading) return;

    setLoading(true);
    try {
      const res = await fetch(
        "http://localhost:7000/api/v1/interns/mentor-accept",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ internId, mentorId }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Intern accepted!");
        fetchInterns();
      } else {
        toast.error(data?.message || "Accept failed.");
      }
    } catch (err) {
      console.error("Accept Intern Error:", err);
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // onReject intern
  const onReject = async (
    internId,
    mentorId,
    remarks,
    suggestedMentorId = null
  ) => {
    if (!window.confirm("Reject this intern?")) return;

    try {
      const response = await fetch(
        "http://localhost:7000/api/v1/interns/mentor-reject",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            internId,
            mentorId,
            remarks,
            suggestedMentorId,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Intern rejected successfully");
        setRejectModalOpen(false);
        fetchInterns(); // Refresh the intern list
      } else {
        toast.error(data.message || "Failed to reject intern");
      }
    } catch (error) {
      console.error("Error rejecting intern:", error);
      toast.error("An error occurred while rejecting the intern");
    }
  };

  // Initial effects
  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (user) {
      fetchInterns();
      fetchMentors();
    }
  }, [user]);

  if (!user) return <div>Loading user info...</div>;
  if (loading || mentorDataLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {filteredInterns.length === 0 ? (
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
              <th>Duration</th>
              <th>Status</th>
              <th>Joined</th>
              <th>{user.role === "hr" ? "Assign Mentor" : "Action"}</th>
            </tr>
          </thead>
          <tbody>
            {filteredInterns.map((intern) => (
              <tr key={intern._id}>
                <td>{intern.fullName}</td>
                <td>{intern.age}</td>
                <td>{intern.email}</td>
                <td>{intern.phone}</td>
                <td>{intern.college}</td>
                <td>{intern.course}</td>
                <td>{intern.duration}</td>
                <td>{intern.internStatus.toUpperCase()}</td>
                <td>{new Date(intern.createdAt).toLocaleDateString()}</td>
                <td>
                  {user.role === "hr" ? (
                    <button
                      className="openModalBtn"
                      onClick={() => {
                        setSelectedIntern(intern);
                        setSelectedMentorId("");
                        setHrShowModal(true);
                      }}
                    >
                      Assign
                    </button>
                  ) : (
                    <div className="flex-cen-all">
                      <button
                        className="openModalBtn"
                        onClick={() => {
                          setSelectedIntern(intern);
                          setMentorModalOpen(true);
                        }}
                      >
                        DETAILS
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ASSIGN MENTOR MODAL */}
      {hrShowModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Assign Mentor to {selectedIntern?.fullName}</h3>
            <select
              value={selectedMentorId}
              onChange={(e) => setSelectedMentorId(e.target.value)}
            >
              <option value="">Select Mentor</option>
              {mentors.map((mentor) => (
                <option key={mentor._id} value={mentor._id}>
                  {mentor.fullName} ({getDepartmentName(mentor.departmentId)})
                </option>
              ))}
            </select>
            <div className="assign-modal-buttons">
              <button
                onClick={() => {
                  const mentor = mentors.find(
                    (m) => m._id === selectedMentorId
                  );
                  if (!mentor || !selectedIntern) {
                    toast.error("Please select a mentor.");
                    return;
                  }
                  onMentorAssign(
                    mentor._id,
                    selectedIntern._id,
                    mentor.fullName,
                    selectedIntern.fullName
                  );
                }}
              >
                Confirm
              </button>
              <button onClick={() => setHrShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* MENTOR ACTION MODAL */}
      {mentorModalOpen && selectedIntern && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex-cen-all modal-header">
              <h3>Intern Details</h3>
              {/* Close button on top-left */}
              <button
                className="modal-close-btn"
                onClick={() => setMentorModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="internDetails">
              <p>
                <strong>Name:</strong> {selectedIntern.fullName}
              </p>
              <p>
                <strong>Age:</strong> {selectedIntern.age}
              </p>
              <p>
                <strong>Email:</strong> {selectedIntern.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedIntern.phone}
              </p>
              <p>
                <strong>College:</strong> {selectedIntern.college}
              </p>
              <p>
                <strong>Course:</strong> {selectedIntern.course}
              </p>
              <p>
                <strong>Duration:</strong> {selectedIntern.duration}
              </p>
            </div>

            <div className="assign-modal-buttons">
              <button
                className="accept-btn"
                onClick={() => {
                  if (!loading) {
                    onAccept(selectedIntern._id, user._id);
                    setMentorModalOpen(false);
                  }
                }}
                disabled={loading}
              >
                {loading ? "Processing..." : "Accept"}
              </button>

              <button
                className="reject-btn"
                onClick={() => {
                  setRejectModalOpen(true);
                  setMentorModalOpen(false);
                  setSelectedInternId(selectedIntern._id);
                }}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MENTOR REJECT MODAL */}
      {rejectModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex-cen-all modal-header">
              <h3>Reject Intern</h3>
              <button
                className="modal-close-btn"
                onClick={() => setRejectModalOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="internRemarks">
              <label>
                <strong>Remarks:</strong>
                <textarea
                  value={rejectionRemarks}
                  onChange={(e) => setRejectionRemarks(e.target.value)}
                  placeholder="Enter reason for rejection"
                  rows={4}
                />
              </label>

              <label>
                <strong>Suggest Mentor (Optional):</strong>
                <select
                  value={suggestedMentorId}
                  onChange={(e) => setSuggestedMentorId(e.target.value)}
                >
                  <option value="">-- Select Mentor --</option>
                  {mentors.map((mentor) => (
                    <option key={mentor._id} value={mentor._id}>
                      {mentor.fullName} (
                      {getDepartmentName(mentor.departmentId)})
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="assign-modal-buttons">
              <button
                className="reject-btn"
                onClick={() => {
                  if (!rejectionRemarks.trim()) {
                    toast.error("Please provide remarks for rejection.");
                    return;
                  }

                  onReject(
                    selectedInternId,
                    user._id,
                    rejectionRemarks,
                    suggestedMentorId || null
                  );

                  // Reset modal state
                  setRejectionRemarks("");
                  setSuggestedMentorId("");
                  setSelectedInternId(null);
                }}
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectionRemarks("");
                  setSuggestedMentorId("");
                  setSelectedInternId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default NewInterns;
