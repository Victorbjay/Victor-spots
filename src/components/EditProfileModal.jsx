// src/components/EditProfileModal.jsx
import React, { useState, useEffect } from "react";

// ... (useState, useEffect, handleSubmit, etc. remain the same) ...

function EditProfileModal({ isOpen, onClose, onSave, initialData = {} }) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [pictureFile, setPictureFile] = useState(null);
  const [error, setError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Only populate/reset when actually opening
      setName(initialData.name || "");
      setBio(initialData.bio || "");
      setPictureFile(null);
      setError("");
    }
  }, [initialData, isOpen]);

  useEffect(() => {
    const nameValid = name.length >= 2 && name.length <= 50;
    const bioValid = bio.length >= 10 && bio.length <= 150;
    setIsFormValid(nameValid && bioValid);
  }, [name, bio]);

  // No need for: if (!isOpen) return null; if we use the class toggle method
  // The component will always be in the DOM, but hidden by CSS.
  // However, for complex modals, conditional rendering (return null) can be better for performance.
  // For now, class toggle is fine.

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setError("Please correct the form errors.");
      return;
    }
    setError("");
    onSave({ name, bio, pictureFile });
  };

  const handlePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPictureFile(e.target.files[0]);
    }
  };

  return (
    <div
      // className={`modal ${isOpen ? 'open' : ''}`} // <--- DYNAMIC CLASS
      className={isOpen ? "modal open" : "modal"} // Or this for clarity
      role="dialog"
      aria-labelledby="editProfileTitle"
      aria-hidden={!isOpen}
    >
      <div className="modal-content">
        {/* ... rest of the modal content ... */}
        <h2 id="editProfileTitle">Edit Profile</h2>
        <form id="editProfileForm" onSubmit={handleSubmit}>
          <label htmlFor="profileNameInput">Name (2-50 characters):</label>
          <input
            type="text"
            id="profileNameInput" // IDs can be kept, but ensure they are unique if multiple instances could exist
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength="2"
            maxLength="50"
          />
          <label htmlFor="profileBioInput">Bio (10-150 characters):</label>
          <textarea
            id="profileBioInput"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            minLength="10"
            maxLength="150"
          ></textarea>
          <label htmlFor="profilePictureInput">Profile Picture:</label>
          <input
            type="file"
            id="profilePictureInput"
            accept="image/*"
            onChange={handlePictureChange}
          />
          {error && (
            <div className="error" id="profileError">
              {error}
            </div>
          )}
          <div className="modal-buttons">
            <button
              type="submit"
              className="primary-btn new-post-btn"
              disabled={!isFormValid}
            >
              Save
            </button>
            <button
              type="button"
              className="text-btn close-btn"
              aria-label="Close modal"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
