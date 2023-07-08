import { useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import Image from 'next/image';
import useStorage from './useStorage';
import Modal from 'react-modal';
import { useImage } from '../contexts/imageContext';

const UserComponent = () => {
  const {
    isModalOpen,
    images,
    comments,
    showUploadInput,
    selectedImageIndex,
    comment,
    handleFileUpload,
    fetchUserData,
    loadComments,
    deleteImage,
    handleSubmit,
    handleToggleUploadInput,
    handleCommentChange,
    handleCommentSubmit,
    closeModal,
    handleCommentDelete,
    newComment,
    editingCommentIndex,
    handleNewCommentChange,
    handleEdit,
    handleSubmitEditedComment,
    handleCancelEdit
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
          <button onClick={handleToggleUploadInput}>Upload Image</button>

          {showUploadInput && (
            <div>
              <input type="file" accept="image/*" onChange={handleFileUpload} />
              <button onClick={handleSubmit}>Upload</button>
            </div>
          )}

          {images.map((image: any, index: any) => (
            <div key={index}>
              <Image src={image.imageUrl} alt="Uploaded Image" width={250} height={250} />

              <button onClick={() => loadComments(image.imageUrl, index)}>View Comments</button>
              <br />
              <button onClick={() => deleteImage(image.imageUrl)}>Delete Image</button>
            </div>
          ))}

<Modal isOpen={isModalOpen} onRequestClose={closeModal} ariaHideApp={false}>
            <button onClick={closeModal}>Close</button>
            <div>
              {selectedImageIndex !== null && (
                <>
                  <Image src={images[selectedImageIndex].imageUrl} alt="Selected Image" width={250} height={250} />
                  <h3>Comments for Image:</h3>
                  {comments.length > 0 ? (
                    comments.map((comment: any, index: any) => (
                      <div key={index}>
                        {comment.userName}: 
                        {editingCommentIndex === index ? (
                          <div>
                            <input
                              type="text"
                              placeholder="Enter new comment..."
                              value={newComment}
                              onChange={handleNewCommentChange}
                            />
                            <button onClick={handleSubmitEditedComment}>
                              Submit Edit
                            </button>
                            <button onClick={handleCancelEdit}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <>
                            {comment.comment}
                            {comment.userName === `${username}` && (
                              <div>
                                <button onClick={() => handleCommentDelete(images[selectedImageIndex].imageUrl, comment.comment, selectedImageIndex)}>
                                  Delete Comment
                                </button>
                                <button onClick={() => handleEdit(index)}>
                                  Edit Comment
                                </button>
                              </div>
                            )}
                          </>
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
                    <button onClick={() => handleCommentSubmit(images[selectedImageIndex].imageUrl, comment, selectedImageIndex)}>
                      Post Comment
                    </button>
                  </div>
                </>
              )}
            </div>
          </Modal>
        </>
      ) : (
        <h1>Verification failed. Please log in again.</h1>
      )}
    </div>
  );
};

export default UserComponent;
