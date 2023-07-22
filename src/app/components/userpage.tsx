import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import Image from 'next/image';
import useStorage from './useStorage';
import { useImage } from '../contexts/imageContext';
import UserPageModal from './userPageModal';
import EditProfileModal from './editProfileModal';
import FollowerDataModal from './followerDataModal';
import styles from '../styles/Image.module.css';

const UserComponent: React.FC = () => {
  const {
    openEditProfileModal,
    closeEditProfileModal,
    profilePic,
    images,
    showUploadInput,
    handleFileUpload,
    fetchUserData,
    fetchFollowerData,
    loadComments,
    deleteImage,
    handleSubmit,
    handleToggleUploadInput,
    closeModal,
    followerData, // Added to access the fetched follower data
    followeeData
  } = useImage();

  const { getItem } = useStorage();
  const username = getItem('username');
  const { authenticated } = useAuth();

  // State to toggle the follower modal
  const [isFollowerDataModalOpen, setIsFollowerDataModalOpen] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);  

  // Function to fetch follower data and open the follower modal
  const handleOpenFollowerModal = async () => {
    try {
      await fetchFollowerData(); // Fetch follower data from the backend and set it in the state
      setIsFollowerDataModalOpen(true); // Open the follower modal
    } catch (error) {
      console.error('Error fetching follower data:', error);
    }
  };

  // Function to close the follower modal
  const handleCloseFollowerModal = () => {
    setIsFollowerDataModalOpen(false);
  };

  return (
    <div>
      {authenticated ? (
        <>
          <h1>Welcome, {username}!</h1>
          <button onClick={openEditProfileModal}>
            <Image src={profilePic} alt="User's Profile Pic" width={50} height={50} className={styles.profilePic} />
          </button>
          <button onClick={handleToggleUploadInput}>Upload Image</button>

          <button onClick={handleOpenFollowerModal}>View Followers/Followees</button>

          {showUploadInput && (
            <div>
              <input type="file" accept="image/*" onChange={handleFileUpload} />
              <button onClick={handleSubmit}>Upload</button>
            </div>
          )}

          <div className={styles.container}>
            {images.map((image: any) => (
              <div className={styles.imageContainer} key={image.imageUrl}>
                <Image src={image.imageUrl} alt="Uploaded Image" width={250} height={250} />

                <button onClick={() => loadComments(image.imageUrl)}>View Comments</button>
                <br />
                <button onClick={() => deleteImage(image.imageUrl)}>Delete Image</button>
              </div>
            ))}
          </div>

          <EditProfileModal onClose={closeEditProfileModal} />
          <UserPageModal onClose={closeModal} />
          <FollowerDataModal
            isFollowerDataModalOpen={isFollowerDataModalOpen}
            closeFollowerDataModal={handleCloseFollowerModal}
            followerData={followerData}
            followeeData={followeeData}
          />
        </>
      ) : (
        <h1>Verification failed. Please log in again.</h1>
      )}
    </div>
  );
};

export default UserComponent;
