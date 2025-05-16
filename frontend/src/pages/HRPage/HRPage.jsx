import { useEffect, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import "./HRPage.css";
import Header from "../../components/Header/Header.jsx";
import AddNewInternModal from "../../components/AddNewInternModal/AddNewInternModal.jsx";

function HRPage() {
  const [userId, setUserId] = useState("");
  const internNavPath = `/user/${userId}/hr/interns`;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Fetching Current User from API
  useEffect(() => {
    const fetchHRData = async () => {
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
        if (data?.data?.user?._id) {
          setUserId(data.data.user._id);
        } else {
          console.error("User ID not found in response:", data);
        }
      } catch (error) {
        console.error("❌ Error:", error.message);
      }
    };

    fetchHRData();
  }, []);

  // Modal open/close handlers
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (
      file &&
      (file.name.endsWith(".csv") ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls"))
    ) {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid CSV or Excel file.");
    }
  };

  // Placeholder for actions
  const handleRegisterClick = () => {
    console.log("Register Intern clicked");
    closeModal();
  };

  // Upload File to get Interns
  const handleUploadClick = async () => {
    console.log("Upload File clicked");

    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("filename", selectedFile);

    try {
      const response = await fetch(
        "http://localhost:7000/api/v1/interns/import-intern",
        {
          method: "POST",
          body: formData,
          credentials: "include",
        }
      );

      // If the response status is OK (200-299), handle success
      if (response.ok) {
        const { data: uploadData } = await response.json();
        alert(`✅ Successfully uploaded ${uploadData.inserted} interns.`);
      } else {
        // If the response status is not OK, get the error message from the response
        const errorData = await response.json();
        alert(errorData?.message || "❌ Failed to upload file.");
      }
    } catch (error) {
      // Catch any unexpected errors (e.g., network issues)
      console.error("❌ Error uploading file:", error.message);
      alert("❌ Error uploading file: " + error.message);
    }

    setSelectedFile(null);
    closeModal();
  };

  return (
    <div className="screen-container">
      <Header loginAs="HR" />

      <main>
        <section className="menuSection">
          <div className="op loginAs flex-center">
            <p>Login As:</p>
            <h1>Human Resource</h1>
          </div>
          <NavLink
            to={`${internNavPath}/new`}
            end
            className={({ isActive }) => {
              return `op menu ${isActive ? "active" : ""}`;
            }}
          >
            New Interns
          </NavLink>
          <NavLink
            to={`${internNavPath}/undergoing`}
            end
            className={({ isActive }) => `op menu ${isActive ? "active" : ""}`}
          >
            Undergoing
          </NavLink>
          <NavLink
            to={`${internNavPath}/completed`}
            end
            className={({ isActive }) => `op menu ${isActive ? "active" : ""}`}
          >
            Completed
          </NavLink>
          <NavLink
            to={`${internNavPath}/certify`}
            end
            className={({ isActive }) => `op menu ${isActive ? "active" : ""}`}
          >
            Certificate Issued
          </NavLink>
          <button className="flex-cen-all addNewIntern" onClick={openModal}>
            Add New Intern
          </button>
        </section>

        <section className="displaySection">
          <Outlet />
        </section>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <AddNewInternModal
          onClose={closeModal}
          onRegisterClick={handleRegisterClick}
          onUploadClick={handleUploadClick}
        >
          <div className="file-upload-container">
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
            />
          </div>
        </AddNewInternModal>
      )}
    </div>
  );
}

export default HRPage;
