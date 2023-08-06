import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import Image from 'next/image';
import useStorage from './useStorage';
import { useImage } from '../contexts/imageContext';
import UserPageModal from './userPageModal';
import EditProfileModal from './editProfileModal';
import FollowerDataModal from './followerDataModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export default function UserComponent() {
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
    followeeData,
  } = useImage();

  const { getItem } = useStorage();
  const username = getItem('username');
  const { authenticated } = useAuth();
  const [isLikesUpdated, setIsLikesUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    // Fetch the authenticated state or do any other asynchronous operations here
    // Once the authenticated state is loaded, set isLoading to false
    const loadAuthenticatedState = async () => {
      // Fetch authenticated state or do any asynchronous operations here
      // For example, you can use an API call or a local storage check
      // For the sake of example, we're using a simple setTimeout to simulate loading
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a 1-second delay
      setIsLoading(false);
    };

    loadAuthenticatedState();
  }, []);

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
    <div className=" min-h-screen">
      {isLoading ? (
        // Render the loading animation or content while waiting for the user data
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
      ) : authenticated ? (
        // Render the user page content when authenticated state is true
        <>
          <h1 className="text-3xl font-bold mb-4 text-center text-white">Welcome, {username}!</h1>
          <button className="flex items-center justify-center mx-auto" onClick={openEditProfileModal}>
            <div className="rounded-full overflow-hidden border border-2 border-blue-500">
              <Image src={profilePic} alt="User's Profile Pic" width={50} height={50} className="profilePic" />
            </div>
          </button>
          <button className="block mx-auto mt-2 mb-4 px-4 py-2 rounded bg-cyan-500 text-white border border-2 border-white" onClick={handleToggleUploadInput}>
            Upload Image
          </button>

          <button className="block mx-auto mb-4 px-4 py-2 rounded bg-cyan-500 text-white border border-2 border-white" onClick={handleOpenFollowerModal}>
            View Followers/Followees
          </button>

          {showUploadInput && (
            <div className="text-center">
              <input type="file" accept="image/*" onChange={handleFileUpload} />
              <button className="mt-2 px-4 py-2 rounded bg-blue-500 text-white" onClick={handleSubmit}>
                Upload
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {images.map((image: any, index: any) => (
              <div className="flex flex-col bg-white rounded-lg shadow-lg pt-4" key={index}>
                <div className="flex items-center p-4">
                  <div className="rounded-full overflow-hidden border border-2 border-blue-500">
                    <Image src={profilePic} alt="Profile Pic" width={50} height={50} />
                  </div>
                  <p className="ml-2 font-bold">{image.username}</p>
                </div>
                <div className="h-64 w-64 relative overflow-hidden mx-auto">
                  <Image
                    src={image.imageUrl}
                    alt="Uploaded Image"
                    layout="fill"
                    objectFit="contain"
                    // Removed hover scaling here
                  />
                </div>

                <div className="p-4 flex justify-between items-center">
                  <button
                    className={`px-4 py-2 text-xl rounded-full ${
                      hasUserLikedImage(image.imageUrl) ? 'text-red-500' : 'text-black'
                    }`}
                    onClick={() => handleLikePost(image.imageUrl)}
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{
                        fill: hasUserLikedImage(image.imageUrl) ? 'red' : 'none', // Fill with red when liked, no fill when not liked
                        fontSize: hasUserLikedImage(image.imageUrl) ? '22px' : '18px', // Increase the heart icon size here
                      }}
                    />
                    <span className="ml-1">{likesMap !== null ? likesMap[image.imageUrl] || 0 : 0}</span>
                    </button>
                    <button
                      className="px-2 py-1 bg-gray-500 text-white rounded text-sm"
                      onClick={() => loadComments(image.imageUrl, index)}
                    >
                    View Comments
                  </button>
                </div>
                <br />
                <button className="px-2 py-1 bg-red-500 text-white rounded text-sm" onClick={() => deleteImage(image.imageUrl)}>
                  Delete Image
                </button>
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
        // Render a message or other content when authenticated state is false
        <h1 className="text-3xl font-bold text-center text-white">Verification failed. Please log in again.</h1>
      )}
    </div>
  );
}
