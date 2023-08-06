import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import Image from 'next/image';
import axios from 'axios';
import { backendLink } from '../backend/config';
import { useImage } from '../contexts/imageContext';
import OtherUserPageModal from './otherUserPageModal';
import { usePathname } from 'next/navigation';
import useStorage from './useStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const OtherUserComponent = () => {
  const {
    profilePic,
    images,
    likesMap,
    likesCheckerMap,
    fetchOtherUserData,
    getLikes,
    likePost,
    unLikePost,
    loadComments,
    followUser,
    unFollowerUser,
    closeModal,
  } = useImage();

  const pathname = usePathname();
  const { getItem } = useStorage();
  const username = getItem('username');
  const otherUsername = pathname.split('/').pop();
  const { authenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isLikesUpdated, setIsLikesUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const checkFollowRelation = async () => {
    try {
      const response = await axios.get(backendLink + `/api/users/followers/${username}`);
      const followerData = response.data;

      const followingUsernames = followerData.following.map((followingItem: any) => followingItem.followee);

      setIsFollowing(followingUsernames.includes(otherUsername));
    } catch (error) {
      console.log('Error fetching followerData:', error);
    }
  };

  const handleFollow = async () => {
    await followUser(otherUsername, username);
    checkFollowRelation();
  };

  const handleUnfollow = async () => {
    await unFollowerUser(otherUsername, username);
    checkFollowRelation();
  };

  const hasUserLikedImage = (imageUrl: string) => {
    if (likesCheckerMap !== null && likesCheckerMap.hasOwnProperty(imageUrl)) {
      const usernamesSet = new Set(likesCheckerMap[imageUrl]);
      return usernamesSet.has(username);
    }
    return false;
  };

  useEffect(() => {
    fetchOtherUserData(otherUsername);
    checkFollowRelation();

    // Check if the current user is viewing their own profile
    setIsOwnProfile(username === otherUsername);
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

  return (
    <div className="min-h-screen">
      {isLoading ? (
        // Render the loading animation or content while waiting for the other user's data
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
      ) : authenticated ? (
        // Render the other user page content when authenticated
        <>
          <div className="flex items-center mb-4 mt-4">
            <div className="rounded-full overflow-hidden border border-2 border-blue-500">
              <Image src={profilePic} alt="Profile Pic" width={50} height={50} />
            </div>
            <h1 className="ml-2 text-xl font-bold text-white">{otherUsername}</h1>
          </div>

          {!isOwnProfile && (
            <>
              {isFollowing ? (
                <button className="px-4 py-2 rounded bg-red-500 text-white border border-2 border-white" onClick={handleUnfollow}>
                  Unfollow User
                </button>
              ) : (
                <button className="px-4 py-2 rounded bg-cyan-500 text-white border border-2 border-white" onClick={handleFollow}>
                  Follow User
                </button>
              )}
            </>
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
              </div>
            ))}
          </div>

          <OtherUserPageModal onClose={closeModal} />
        </>
      ) : (
        // Render a message when not authenticated
        <h1 className="text-3xl font-bold text-center text-white">Verification failed. Please log in again.</h1>
      )}
    </div>
  );
};

export default OtherUserComponent;
