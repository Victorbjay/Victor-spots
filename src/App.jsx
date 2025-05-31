// src/App.jsx
import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import Header from "./components/Header";
import UserProfile from "./components/UserProfile";
import PostGrid from "./components/PostGrid";
import Footer from "./components/Footer";
import EditProfileModal from "./components/EditProfileModal";
import NewPostModal from "./components/NewPostModal";
import ImagePreviewModal from "./components/ImagePreviewModal";
import "./index.css"; // Assuming your global CSS is here

// Initial card data from your script
const initialCardsData = [
  {
    id: 1,
    image: "/assets/images/bg_1.png",
    title: "Val Thorens",
    liked: false,
  },
  {
    id: 2,
    image: "/assets/images/bg_2.png",
    title: "Restaurant terrace",
    liked: false,
  },
  {
    id: 3,
    image: "/assets/images/bg_3.png",
    title: "An outdoor cafe",
    liked: false,
  },
  {
    id: 4,
    image: "/assets/images/bg_4.png",
    title: "A very long bridge over the forest",
    liked: false,
  },
  {
    id: 5,
    image: "/assets/images/bg_5.png",
    title: "Tunnel with morning light",
    liked: false,
  },
  {
    id: 6,
    image: "/assets/images/bg_6.png",
    title: "Mountain house",
    liked: false,
  },
].map((card) => ({ ...card, imageUrl: card.image })); // Map 'image' to 'imageUrl' for consistency

// Function to load profile from localStorage or use defaults
const loadProfileData = () => {
  const storedProfile = localStorage.getItem("profile");
  if (storedProfile) {
    const parsed = JSON.parse(storedProfile);
    return {
      name: parsed.name,
      bio: parsed.bio,
      pictureUrl: parsed.picture, // Map 'picture' to 'pictureUrl'
    };
  }
  return {
    name: "Aliaune Damala",
    bio: "Known mononymously as Akon, is a Senegalese-American singer, record producer, and entrepreneur.",
    pictureUrl: "/assets/images/avatar.png",
  };
};

function App() {
  // State for Modals
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedPostForPreview, setSelectedPostForPreview] = useState(null);

  // State for Data
  const [profileData, setProfileData] = useState(loadProfileData());
  const [posts, setPosts] = useState(initialCardsData);
  const [likedPostIds, setLikedPostIds] = useState(
    new Set(
      initialCardsData.filter((card) => card.liked).map((card) => card.id)
    )
  );

  // --- Save Profile to localStorage whenever it changes ---
  useEffect(() => {
    // Map back to the structure your localStorage expects
    const profileToStore = {
      name: profileData.name,
      bio: profileData.bio,
      picture: profileData.pictureUrl,
    };
    localStorage.setItem("profile", JSON.stringify(profileToStore));
  }, [profileData]);

  // --- Modal Handlers (using useCallback for functions passed as props) ---
  const handleOpenEditProfile = useCallback(
    () => setIsEditProfileModalOpen(true),
    []
  );
  const handleCloseEditProfile = useCallback(
    () => setIsEditProfileModalOpen(false),
    []
  );

  const handleOpenNewPost = useCallback(() => setIsNewPostModalOpen(true), []);
  const handleCloseNewPost = useCallback(
    () => setIsNewPostModalOpen(false),
    []
  );

  const handleOpenPreview = useCallback((post) => {
    setSelectedPostForPreview(post);
    setIsPreviewModalOpen(true);
  }, []);
  const handleClosePreview = useCallback(() => {
    setIsPreviewModalOpen(false);
    setSelectedPostForPreview(null);
  }, []);

  // --- Data Handlers ---
  const handleSaveProfile = useCallback(
    ({ name, bio, pictureFile }) => {
      if (pictureFile) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileData({ name, bio, pictureUrl: reader.result });
        };
        reader.readAsDataURL(pictureFile);
      } else {
        setProfileData((prevData) => ({ ...prevData, name, bio }));
      }
      handleCloseEditProfile();
    },
    [handleCloseEditProfile]
  );

  const handleCreatePost = useCallback(
    ({ title, imageFile }) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPost = {
          id: Date.now(), // Using timestamp for simplicity, ensure it's treated as number or string consistently
          title,
          imageUrl: reader.result, // This is a data URL
          liked: false,
        };
        setPosts((prevPosts) => [newPost, ...prevPosts]);
      };
      reader.readAsDataURL(imageFile);
      handleCloseNewPost();
    },
    [handleCloseNewPost]
  );

  const handleLikePost = useCallback((postId) => {
    setLikedPostIds((prevLikedIds) => {
      const newLikedIds = new Set(prevLikedIds);
      if (newLikedIds.has(postId)) {
        newLikedIds.delete(postId);
      } else {
        newLikedIds.add(postId);
      }
      return newLikedIds;
    });
    // Optional: update the 'liked' status within the main 'posts' array if needed elsewhere
    // setPosts(prevPosts => prevPosts.map(p => p.id === postId ? {...p, liked: !p.liked} : p));
  }, []);

  // --- Effect for closing modals with Escape key ---
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        if (isEditProfileModalOpen) handleCloseEditProfile();
        if (isNewPostModalOpen) handleCloseNewPost();
        if (isPreviewModalOpen) handleClosePreview();
      }
    };
    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [
    isEditProfileModalOpen,
    isNewPostModalOpen,
    isPreviewModalOpen,
    handleCloseEditProfile,
    handleCloseNewPost,
    handleClosePreview,
  ]);

  return (
    <>
      <Header />
      <div className="container">
        <UserProfile
          profileName={profileData.name}
          profileBio={profileData.bio}
          profilePictureUrl={profileData.pictureUrl}
          onEditProfileClick={handleOpenEditProfile}
          onNewPostClick={handleOpenNewPost}
        />
        <PostGrid
          posts={posts}
          onPostClick={handleOpenPreview}
          onLikePost={handleLikePost}
          likedPosts={likedPostIds}
        />
      </div>
      <Footer />

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={handleCloseEditProfile}
        onSave={handleSaveProfile}
        initialData={{ name: profileData.name, bio: profileData.bio }} // Pass current data
      />
      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={handleCloseNewPost}
        onCreatePost={handleCreatePost}
      />
      <ImagePreviewModal
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreview}
        post={selectedPostForPreview}
        // Optional: Click outside to close can be implemented inside ImagePreviewModal or via a HOC
      />
    </>
  );
}

export default App;
