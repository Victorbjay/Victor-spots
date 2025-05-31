// src/components/UserProfile.jsx
import React from "react";

function UserProfile({
  profileName,
  profileBio,
  profilePictureUrl,
  onEditProfileClick,
  onNewPostClick,
}) {
  return (
    <div className="container">
      {" "}
      {/* We might move this 'container' class to App.jsx or a Layout component */}
      <div className="avatar-section">
        <div className="avatar">
          <img
            id="profilePicture" // IDs might not be needed as much, or can be kept for specific targeting if necessary
            src={profilePictureUrl}
            alt="User avatar"
          />
        </div>
        <div className="description">
          <div className="avatar-name">
            <h1 id="profileName">{profileName}</h1>
            <p id="profileBio">{profileBio}</p>
            <button
              className="text-btn"
              id="editProfileBtn" // onClick will replace this direct ID usage for JS
              aria-label="Edit profile"
              onClick={onEditProfileClick} // Event handler
            >
              <img src="/assets/icons/pencil.svg" alt="Edit icon" />
              Edit Profile
            </button>
          </div>
          <button
            className="primary-btn"
            id="newPostBtn" // onClick will replace this
            aria-label="Create new post"
            onClick={onNewPostClick} // Event handler
          >
            <img src="/assets/icons/plus.svg" alt="Plus icon" />
            New Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
