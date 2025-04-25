import React from "react";
import "./AddNewInternModal.css"; // We'll style it in the next step.

const AddNewInternModal = ({
  onClose,
  onRegisterClick,
  onUploadClick,
  children,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add New Intern</h2>
        <div className="modal-buttons">
          <button onClick={onRegisterClick}>Register Intern</button>
          <div className="file-upload-section">
            <div>{children}</div>
            <button onClick={onUploadClick}>Upload File</button>
          </div>
        </div>

        <button className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AddNewInternModal;
