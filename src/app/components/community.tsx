import { useAuth } from '../contexts/authContext';
import { useImage } from '../contexts/imageContext';
import { useEffect, useState } from 'react';
import useStorage from './useStorage';
import Image from 'next/image';
import CommunityPageModal from './communityPageModal';
import SearchBar from './searchBar';
import styles from '../styles/Image.module.css';

export default function CommunityPage() {
  const {
    images,
    likesMap,
    likesCheckerMap,
    fetchImages,
    loadComments,
    getLikes,
    likePost,
    unLikePost,
    closeModal,
  } = useImage();

  const { getItem } = useStorage();
  const username = getItem('username');
  const { authenticated } = useAuth();
  const [isLikesUpdated, setIsLikesUpdated] = useState(false);

  // Function to check if the current user has already liked an image
  const hasUserLikedImage = (imageUrl: string) => {
    if (likesCheckerMap !== null && likesCheckerMap.hasOwnProperty(imageUrl)) {
      const usernamesSet = new Set(likesCheckerMap[imageUrl]);
      return usernamesSet.has(username);
    }
    return false;
  };

  useEffect(() => {
    fetchImages();
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

  const handleUserClick = (username: string) => {
    window.location.href = `/community/userpages/${username}`;
  };

  return (
    <div>
      {authenticated ? (
        <>
          <h1>Welcome, {username}!</h1>
          <SearchBar />

          <div className={styles.container}>
            {images.map((image: any, index: number) => (
              <div className={styles.imageContainer} key={index}>
                <div className={styles.profileContainer}>
                  <a
                    href={`/community/userpages/${image.username}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleUserClick(image.username);
                    }}
                  >
                    <Image src={image.profilePic} alt="Profile Pic" width={50} height={50} className={styles.profilePic} />
                  </a>
                  <p>
                    <a
                      href={`/community/userpages/${image.username}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleUserClick(image.username);
                      }}
                    >
                      {image.username}
                    </a>
                  </p>
                </div>
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

          <CommunityPageModal onClose={closeModal} />
        </>
      ) : (
        <h1>Verification failed. Please log in again.</h1>
      )}
    </div>
  );
}
