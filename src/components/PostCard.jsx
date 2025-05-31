// src/components/PostCard.jsx
import React from "react";

// Path to your existing "unliked" SVG icon
const unlikedIconSvgSrc = "/assets/icons/like.svg"; // This is your current SVG

// Emoji for the "liked" state
const likedHeartEmoji = "❤️";

function PostCard({ post, onImageClick, onLikeClick, isLiked }) {
  if (!post) return null;

  const handleLikeButtonClick = (e) => {
    e.stopPropagation();
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
          // Optional: Adjust font size if the emoji appears too small/large
          // style={isLiked ? { fontSize: '1.5rem' } : {}}
        >
          {isLiked ? (
            // If liked, show the red heart emoji
            <span style={{ fontSize: "1.5rem" }}>{likedHeartEmoji}</span> // Wrap in span for potential styling
          ) : (
            // If not liked, show the SVG image
            <img
              src={unlikedIconSvgSrc}
              alt="" // Alt is empty as button has aria-label
            />
          )}
        </button>
      </div>
    </div>
  );
}

export default PostCard;
