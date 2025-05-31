// src/components/NewPostModal.jsx
import React, { useState, useEffect, useRef } from "react";

// Reuse the validation function or import it if in a utils file
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
  return "";
}

function NewPostModal({ isOpen, onClose, onCreatePost }) {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [titleError, setTitleError] = useState("");
  const [imageError, setImageError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  const firstInputRef = useRef(null); // For image input

  useEffect(() => {
    if (isOpen) {
      setTitle("");
      setImageFile(null);
      // Important: Reset file input visually if needed, or its internal state.
      // For controlled file inputs, it's tricky. Usually, we just clear our `imageFile` state.
      if (firstInputRef.current) firstInputRef.current.value = null;

      setTitleError("");
      setImageError("");
      // Focus the first input (image input)
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const currentTitleError = validateInput(title, 2, 50, "Title");
    const currentImageError = !imageFile ? "Image is required." : "";

    setTitleError(currentTitleError);
    setImageError(currentImageError);
    setIsFormValid(!currentTitleError && !currentImageError);
  }, [title, imageFile]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    onCreatePost({ title, imageFile });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setImageError(""); // Clear image error if a file is selected
    } else {
      setImageFile(null);
      setImageError("Image is required.");
    }
  };

  // Click outside to close (basic implementation)
  const modalContentRef = useRef();
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
      aria-labelledby="newPostTitle"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      <div className="modal-content" ref={modalContentRef}>
        <h2 id="newPostTitle">Create New Post</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="postImage">Image:</label>
          <input
            ref={firstInputRef}
            type="file"
            id="postImage"
            accept="image/*"
            onChange={handleImageChange}
            aria-describedby={imageError ? "postImageError" : undefined}
            aria-invalid={!!imageError}
          />
          {imageError && (
            <div className="error" id="postImageError">
              {imageError}
            </div>
          )}

          <label htmlFor="postTitleInput">Title (2-50 characters):</label>
          <input
            type="text"
            id="postTitleInput" // Changed from postTitle to avoid clash with h2 id
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            aria-describedby={titleError ? "postTitleError" : undefined}
            aria-invalid={!!titleError}
          />
          {titleError && (
            <div className="error" id="postTitleError">
              {titleError}
            </div>
          )}

          <div className="modal-buttons">
            <button
              type="submit"
              className="primary-btn"
              disabled={!isFormValid}
            >
              Create
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

export default NewPostModal;
