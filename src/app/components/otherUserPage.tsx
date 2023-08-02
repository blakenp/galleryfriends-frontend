import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import Image from 'next/image';
import axios from 'axios';
import { backendLink } from '../backend/config';
import { useImage } from '../contexts/imageContext';
import OtherUserPageModal from './otherUserPageModal';
import styles from '../styles/Image.module.css';
import { usePathname } from 'next/navigation';
import useStorage from './useStorage';

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
    closeModal 
  } = useImage();

  const pathname = usePathname();
  const { getItem } = useStorage();
  const username = getItem('username');
  const otherUsername = pathname.split('/').pop();
  const { authenticated } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isLikesUpdated, setIsLikesUpdated] = useState(false);

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
    <div>
      {authenticated ? (
        <>
          <Image src={profilePic} alt="User's Profile Pic" width={50} height={50} className={styles.profilePic} />
          <h1>{otherUsername}</h1>
          {/* Render follow/unfollow button only if the user is not viewing their own profile */}
          {!isOwnProfile && (
            <>
              {isFollowing ? (
                <button onClick={handleUnfollow}>Unfollow User</button>
              ) : (
                <button onClick={handleFollow}>Follow User</button>
              )}
            </>
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
              </div>
            ))}
          </div>

          <OtherUserPageModal onClose={closeModal} />
        </>
      ) : (
        <h1>Verification failed. Please log in again.</h1>
      )}
    </div>
  );
};

export default OtherUserComponent;
