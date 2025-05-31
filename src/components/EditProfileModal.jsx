// src/components/EditProfileModal.jsx
import React, { useState, useEffect, useRef } from "react";

// Utility validation function (can be moved to a separate utils.js file if you prefer)
function validateInput(value, minLength, maxLength, fieldName) {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    return `${fieldName} is required.`;
  }
  if (trimmedValue.length < minLength) {
    return `Minimum ${minLength} characters required for ${fieldName.toLowerCase()}.`;
  }
  if (trimmedValue.length > maxLength) {
    return `Maximum ${maxLength} characters allowed for ${fieldName.toLowerCase()}.`;
  }
  return ""; // No error
}

function EditProfileModal({ isOpen, onClose, onSave, initialData }) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [pictureFile, setPictureFile] = useState(null);
  const [nameError, setNameError] = useState("");
  const [bioError, setBioError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  // --- REF FOR AUTOFOCUS ---
  const nameInputRef = useRef(null); // Create a ref for the name input
  // --- END REF FOR AUTOFOCUS ---

  const modalContentRef = useRef(null); // For click outside logic

  useEffect(() => {
    if (isOpen) {
      setName(initialData.name || "");
      setBio(initialData.bio || "");
      setPictureFile(null);
      setNameError("");
      setBioError("");
      // --- AUTOFOCUS LOGIC ---
      // Focus the name input when modal opens
      // Timeout helps ensure the element is fully rendered and visible
      // before trying to focus, especially with CSS transitions.
      const timer = setTimeout(() => {
        if (nameInputRef.current) {
          nameInputRef.current.focus();
        }
      }, 0); // A 0ms timeout pushes it to the end of the current execution queue
      return () => clearTimeout(timer); // Cleanup the timer
      // --- END AUTOFOCUS LOGIC ---
    }
  }, [isOpen, initialData]); // Rerun when isOpen or initialData changes

  useEffect(() => {
    // Validate on name or bio change
    const currentNameError = validateInput(name, 2, 50, "Name");
    const currentBioError = validateInput(bio, 10, 150, "Bio");

    setNameError(currentNameError);
    setBioError(currentBioError);
    setIsFormValid(!currentNameError && !currentBioError);
  }, [name, bio]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    onSave({ name, bio, pictureFile });
  };

  const handlePictureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPictureFile(e.target.files[0]);
    } else {
      setPictureFile(null);
    }
  };

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target) &&
        event.target.classList.contains("modal")
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div
      className={isOpen ? "modal open" : "modal"}
      role="dialog"
      aria-labelledby="editProfileTitle"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      <div className="modal-content" ref={modalContentRef}>
        <h2 id="editProfileTitle">Edit Profile</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="profileNameInput">Name (2-50 characters):</label>
          <input
            // --- ATTACH THE REF ---
            ref={nameInputRef}
            // --- END ATTACH THE REF ---
            type="text"
            id="profileNameInput"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-describedby={nameError ? "profileNameError" : undefined}
            aria-invalid={!!nameError}
          />
          {nameError && (
            <div className="error" id="profileNameError">
              {nameError}
            </div>
          )}

          <label htmlFor="profileBioInput">Bio (10-150 characters):</label>
          <textarea
            id="profileBioInput"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            aria-describedby={bioError ? "profileBioError" : undefined}
            aria-invalid={!!bioError}
          ></textarea>
          {bioError && (
            <div className="error" id="profileBioError">
              {bioError}
            </div>
          )}

          <label htmlFor="profilePictureInput">Profile Picture:</label>
          <input
            type="file"
            id="profilePictureInput"
            accept="image/*"
            onChange={handlePictureChange}
          />

          <div className="modal-buttons">
            <button
              type="submit"
              className="primary-btn"
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
