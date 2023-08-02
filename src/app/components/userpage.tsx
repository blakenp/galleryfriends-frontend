import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import Image from 'next/image';
import useStorage from './useStorage';
import { useImage } from '../contexts/imageContext';
import UserPageModal from './userPageModal';
import EditProfileModal from './editProfileModal';
import FollowerDataModal from './followerDataModal';
import styles from '../styles/Image.module.css';

export default function UserComponent () {
  const {
    openEditProfileModal,
    closeEditProfileModal,
    profilePic,
    images,
    likesMap,
    likesCheckerMap,
    showUploadInput,
    handleFileUpload,
    fetchUserData,
    getLikes,
    likePost,
    unLikePost,
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
  const [isLikesUpdated, setIsLikesUpdated] = useState(false);

  // State to toggle the follower modal
  const [isFollowerDataModalOpen, setIsFollowerDataModalOpen] = useState(false);

  const hasUserLikedImage = (imageUrl: string) => {
    if (likesCheckerMap !== null && likesCheckerMap.hasOwnProperty(imageUrl)) {
      const usernamesSet = new Set(likesCheckerMap[imageUrl]);
      return usernamesSet.has(username);
    }
    return false;
  };

  useEffect(() => {
    fetchUserData();
  }, []);  

  useEffect(() => {
    if (images.length !== 0) {
      getLikes(images);
      console.log('LikesMaps in community page: ', likesMap);
    }
  }, [images]);

  useEffect(() => {
    getLikes(images);
    setIsLikesUpdated(false);
  }, [isLikesUpdated]);

  const handleLikePost = async (imageUrl: string) => {
    try {
      if (hasUserLikedImage(imageUrl)) {
        await unLikePost(imageUrl);
      } else {
        await likePost(imageUrl);
      }

      setIsLikesUpdated(true);
    } catch (error) {
      console.log('Error liking post: ', error);
    }
  };

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
            {images.map((image: any, index: any) => (
              <div className={styles.imageContainer} key={index}>
                <Image src={image.imageUrl} alt="Uploaded Image" width={250} height={250} />

                {hasUserLikedImage(image.imageUrl) ? (
                  <button onClick={() => handleLikePost(image.imageUrl)}>Unlike</button>
                ) : (
                  <button onClick={() => handleLikePost(image.imageUrl)}>Like</button>
                )}

                <p>{likesMap !== null ? likesMap[image.imageUrl] || 0 : 0} Like{likesMap !== null && likesMap[image.imageUrl] !== 1 ? 's' : ''}</p>

                <button onClick={() => loadComments(image.imageUrl, index)}>View Comments</button>
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
