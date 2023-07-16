import { useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import Image from 'next/image';
import useStorage from './useStorage';
import Modal from 'react-modal';
import { useImage } from '../contexts/imageContext';
import OtherUserPageModal from './otherUserPageModal';
import styles from '../styles/comunity.module.css';
import { usePathname } from 'next/navigation';

const OtherUserComponent = () => {
  const {
    isModalOpen,
    comments,
    profilePic,
    images,
    selectedImageIndex,
    comment,
    fetchOtherUserData,
    loadComments,
    handleCommentChange,
    handleCommentSubmit,
    closeModal,
    handleCommentDelete,
    newComment,
    editingCommentIndex,
    handleNewCommentChange,
    handleEdit,
    handleSubmitEditedComment,
    handleCancelEdit,
  } = useImage();  
  
  const pathname = usePathname();
  const { getItem } = useStorage();
  const username = getItem('username');
  const otherUsername = pathname.split('/').pop();
  const { authenticated } = useAuth();
  
  useEffect(() => {
    fetchOtherUserData(otherUsername);
  }, []);

  return (
    <div>
      {authenticated ? (
        <>
          <Image src={profilePic} alt="User's Profile Pic" width={50} height={50} />
          <div className={styles.container}>
            {images.map((image: any, index: any) => (
              <div className={styles.imageContainer} key={index}>
                <Image src={image.imageUrl} alt="Uploaded Image" width={250} height={250} />

                <button onClick={() => loadComments(image.imageUrl, index)}>View Comments</button>
              </div>
            ))}
          </div>

          <Modal isOpen={isModalOpen} onRequestClose={closeModal} ariaHideApp={false}>
            <OtherUserPageModal onClose={closeModal} />
          </Modal>
        </>
      ) : (
        <h1>Verification failed. Please log in again.</h1>
      )}
    </div>
  );
};

export default OtherUserComponent;
