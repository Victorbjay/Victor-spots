// src/components/ImagePreviewModal.jsx
import React, { useEffect, useRef } from "react";

function ImagePreviewModal({ isOpen, onClose, post }) {
  const closeButtonRef = useRef(null);
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      // Check if the click is on the modal backdrop itself
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

  if (!isOpen || !post) {
    // Can keep this conditional render or use class toggle
    return null;
  }

  return (
    <div
      className="modal open" // Assuming we keep conditional rendering in App for this one, or use: className={isOpen ? "modal open" : "modal"}
      role="dialog"
      aria-labelledby="previewTitle"
      aria-modal="true"
      aria-hidden={!isOpen}
    >
      <div className="modal-content preview-content" ref={modalContentRef}>
        <h2 id="previewTitle" className="preview-title">
          {post.title}
        </h2>
        <img
          id="previewImage"
          src={post.imageUrl}
          alt={`Preview of ${post.title}`}
        />
        <button
          ref={closeButtonRef}
          type="button"
          className="text-btn close-btn"
          aria-label="Close modal"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ImagePreviewModal;
