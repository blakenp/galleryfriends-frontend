import { useImage } from "../contexts/imageContext"
import Image from "next/image";
import useStorage from "./useStorage";

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
        handleCancelEdit
      } = useImage();

    const { getItem } = useStorage();
    const username = getItem('username');
    
    return (
        <div>
            <button onClick={onClose}>Close</button>
            {selectedImageIndex !== null && (
                <>
                  <Image src={images[selectedImageIndex].imageUrl} alt="Selected Image" width={250} height={250} />
                  <h3>Comments for Image:</h3>
                  {comments.length > 0 ? (
                    comments.map((comment: any, index: number) => (
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
                            <button onClick={handleSubmitEditedComment}>Submit Edit</button>
                            <button onClick={handleCancelEdit}>Cancel</button>
                          </div>
                        ) : (
                          <>
                            {comment.comment}
                            {comment.userName === username && (
                              <div>
                                <button
                                  onClick={() =>
                                    handleCommentDelete(images[selectedImageIndex].imageUrl, comment.comment, selectedImageIndex)
                                  }
                                >
                                  Delete Comment
                                </button>
                                <button onClick={() => handleEdit(index)}>Edit Comment</button>
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
    );
};

export default CommunityPageModal;