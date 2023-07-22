import { useAuth } from '../contexts/authContext';
import { useImage, ImageData } from '../contexts/imageContext';
import { useEffect, useState } from 'react';
import useStorage from './useStorage';
import Image from 'next/image';
import Modal from 'react-modal';
import CommunityPageModal from './communityPageModal';
import SearchBar from './searchBar';
import styles from '../styles/Image.module.css';

export default function CommunityPage() {
  const {
    isModalOpen,
    images,
    fetchImages,
    loadComments,
    closeModal,
  } = useImage();

  const { getItem } = useStorage();
  const username = getItem('username');
  const { authenticated } = useAuth();

  useEffect(() => {
    fetchImages();
  }, []);

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
            {images.map((image: ImageData, index: number) => (
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
