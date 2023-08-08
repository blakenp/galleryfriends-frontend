import { useImage } from "../contexts/imageContext";
import Image from "next/image";
import useStorage from "./useStorage";
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const OtherUserPageModal = ({ onClose }: { onClose: () => void }) => {
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
      <div className="bg-white p-4">
        <button onClick={onClose} className="absolute top-4 right-4">
          <FontAwesomeIcon icon={faTimes} size="2x" />
        </button>
        {selectedImageIndex !== null && (
          <>
            <div className="flex justify-center">
              <Image src={images[selectedImageIndex].imageUrl} alt="Selected Image" width={250} height={250} />
            </div>
            <h3 className="text-center mt-4">Comments for Image:</h3>
            {comments.length > 0 ? (
              comments.map((comment: any, index: number) => (
                <div key={index} className="flex items-start space-x-4 p-2 border-b border-gray-300">
                  {comment.profilePic && (
                    <Image src={comment.profilePic} alt="Profile Pic" width={30} height={30} className="rounded-full" />
                  )}
                  <div className="flex flex-col">
                    <p className="text-sm font-bold">{comment.userName}:</p>
                    <p className="text-sm">{comment.comment}</p>
                    {editingCommentIndex === index && (
                      <div className="flex space-x-2 mt-2">
                        <input
                          type="text"
                          placeholder="Enter new comment..."
                          value={newComment}
                          onChange={handleNewCommentChange}
                          className="border border-gray-300 rounded px-2 py-1 w-64"
                        />
                        <button
                          onClick={handleSubmitEditedComment}
                          className="bg-blue-500 text-white rounded px-2 py-1"
                        >
                          Submit Edit
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-red-500 text-white rounded px-2 py-1"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                  {comment.userName === username && (
                    <div className="ml-auto space-x-2">
                      <button
                        onClick={() => handleEdit(index)}
                        className="bg-green-500 text-white rounded px-2 py-1"
                      >
                        Edit Comment
                      </button>
                      <button
                        onClick={() =>
                          handleCommentDelete(images[selectedImageIndex].imageUrl, comment.comment, selectedImageIndex)
                        }
                        className="bg-red-500 text-white rounded px-2 py-1"
                      >
                        Delete Comment
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center mt-4">No comments yet.</p>
            )}

            <div className="flex justify-center items-center space-x-2 mt-4">
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={handleCommentChange}
                className="border border-gray-300 rounded px-2 py-1 w-full md:w-1/2" // Adjust the width class here
              />
              <button
                onClick={() =>
                  handleCommentSubmit(images[selectedImageIndex].imageUrl, comment, selectedImageIndex)
                }
                className="bg-blue-500 text-white rounded px-2 py-1"
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

export default OtherUserPageModal;
