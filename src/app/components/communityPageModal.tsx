import { useImage } from "../contexts/imageContext";
import Image from "next/image";
import useStorage from "./useStorage";
import Modal from 'react-modal';
import styles from '../styles/Modals.module.css';

const CommunityPageModal = ({ onClose }: { onClose: () => void }) => {
  const {
    images,
    comments,
    selectedImageIndex,
    comment,
    handleCommentChange,
    handleCommentSubmit,
    handleCommentDelete,
    newComment,
    editingCommentIndex,
    handleNewCommentChange,
    handleEdit,
    handleSubmitEditedComment,
    handleCancelEdit,
    isModalOpen,
    closeModal
  } = useImage();

  const { getItem } = useStorage();
  const username = getItem('username');

  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal} ariaHideApp={false}>
      <div>
        {/* <button onClick={onClose}>Close</button> */}
        {selectedImageIndex !== null && (
          <>
            <Image src={images[selectedImageIndex].imageUrl} alt="Selected Image" width={250} height={250} />
            <h3>Comments for Image:</h3>
            {comments.length > 0 ? (
              comments.map((comment: any, index: number) => (
                <div key={index} className={styles.commentContainer}>
                  {comment.profilePic && (
                    <Image src={comment.profilePic} alt="Profile Pic" width={30} height={30} className={styles.profilePic} />
                  )}
                  <div className={styles.commentContent}>
                    <p className={styles.commentName}>{comment.userName}:</p>
                    <p className={styles.commentText}>{comment.comment}</p>
                    {editingCommentIndex === index && (
                      <div className={styles.editComment}>
                        <input
                          type="text"
                          placeholder="Enter new comment..."
                          value={newComment}
                          onChange={handleNewCommentChange}
                        />
                        <button onClick={handleSubmitEditedComment}>Submit Edit</button>
                        <button onClick={handleCancelEdit}>Cancel</button>
                      </div>
                    )}
                  </div>
                  {comment.userName === username && (
                    <div>
                      <button onClick={() => handleEdit(index)}>Edit Comment</button>
                      <button
                        onClick={() =>
                          handleCommentDelete(images[selectedImageIndex].imageUrl, comment.comment, selectedImageIndex)
                        }
                      >
                        Delete Comment
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}

            <div>
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={handleCommentChange}
              />
              <button
                onClick={() =>
                  handleCommentSubmit(images[selectedImageIndex].imageUrl, comment, selectedImageIndex)
                }
              >
                Post Comment
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CommunityPageModal;
