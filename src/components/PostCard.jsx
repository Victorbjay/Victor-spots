// src/components/PostCard.jsx
import React from "react";

// Path to your like icon
const likeIconSrc = "/assets/icons/like.svg"; // As per your script

function PostCard({ post, onImageClick, onLikeClick, isLiked }) {
  if (!post) return null;

  const handleLikeButtonClick = (e) => {
    e.stopPropagation(); // Prevent click from bubbling to onImageClick if like is on image
    onLikeClick(post.id);
  };

  const handleLikeButtonKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      onLikeClick(post.id);
    }
  };

  return (
    <div className="post-card">
      <div
        className="post-img"
        onClick={() => onImageClick(post)}
        role="button"
        tabIndex="0"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onImageClick(post);
        }}
        aria-label={`View post titled ${post.title}`}
      >
        <img src={post.imageUrl} alt={post.title} />
      </div>
      <div className="post-card-description">
        <h2>{post.title}</h2>
        <button
          className={`like-btn ${isLiked ? "liked" : ""}`}
          onClick={handleLikeButtonClick}
          onKeyDown={handleLikeButtonKeyDown}
          aria-pressed={isLiked}
          aria-label={
            isLiked
              ? `Unlike post titled ${post.title}`
              : `Like post titled ${post.title}`
          }
        >
          <img src={likeIconSrc} alt="" />{" "}
          {/* Alt is empty as button has aria-label */}
        </button>
      </div>
    </div>
  );
}

export default PostCard;
