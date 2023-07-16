import { useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import Image from 'next/image';
import useStorage from './useStorage';
import Modal from 'react-modal';
import { useImage } from '../contexts/imageContext';
import UserPageModal from './userPageModal';
import EditProfileModal from './editProfileModal';
import styles from '../styles/comunity.module.css';

const UserComponent = () => {
  const {
    isModalOpen,
    isEditProfileModalOpen,
    openEditProfileModal,
    closeEditProfileModal,
    profilePic,
    images,
    showUploadInput,
    handleFileUpload,
    fetchUserData,
    loadComments,
    deleteImage,
    handleSubmit,
    handleToggleUploadInput,
    closeModal,
  } = useImage();  
  
  const { getItem } = useStorage();
  const username = getItem('username');
  const { authenticated } = useAuth();
  
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div>
      {authenticated ? (
        <>
          <h1>Welcome, {username}!</h1>
          <button onClick={openEditProfileModal}>
            <Image src={profilePic} alt="User's Profile Pic" width={50} height={50} />
          </button>
          <button onClick={handleToggleUploadInput}>Upload Image</button>

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

                <button onClick={() => loadComments(image.imageUrl, index)}>View Comments</button>
                <br />
                <button onClick={() => deleteImage(image.imageUrl)}>Delete Image</button>
              </div>
            ))}
          </div>

          <Modal isOpen={isEditProfileModalOpen} onRequestClose={closeEditProfileModal} ariaHideApp={false}>
            <EditProfileModal onClose={closeEditProfileModal} />
          </Modal>

          <Modal isOpen={isModalOpen} onRequestClose={closeModal} ariaHideApp={false}>
            <UserPageModal onClose={closeModal} />
          </Modal>
        </>
      ) : (
        <h1>Verification failed. Please log in again.</h1>
      )}
    </div>
  );
};

export default UserComponent;
