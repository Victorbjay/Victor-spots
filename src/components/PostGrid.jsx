// src/components/PostGrid.jsx
import React from "react";
import PostCard from "./PostCard"; // Import the new component

// onPostClick is for opening preview, onLikePost is for liking
function PostGrid({ posts, onPostClick, onLikePost, likedPosts }) {
  return (
    <div className="post-grid" role="region" aria-label="Post gallery">
      {posts && posts.length > 0 ? (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onImageClick={onPostClick} // Pass the handler down
            onLikeClick={onLikePost} // Pass the like handler
            isLiked={likedPosts.has(post.id)} // Check if the post ID is in the set of liked posts
          />
        ))
      ) : (
        <p>No posts yet. Create one!</p>
      )}
    </div>
  );
}

export default PostGrid;
