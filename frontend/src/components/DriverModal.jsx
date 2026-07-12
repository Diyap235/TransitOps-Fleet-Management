import React from "react";

const DriverModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Register Driver</h2>

        <p>Driver Registration Form</p>

        <button onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default DriverModal;