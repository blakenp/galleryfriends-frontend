'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { backendLink } from '../backend/config';
import useStorage from '../components/useStorage';
import { useAuth } from './authContext';
import axios from 'axios';


export const ImageContext = createContext<any | null>(null);

export function useImage() {
  return useContext(ImageContext);
}

interface Comment {
    userName: string;
    comment: string;
}
  
interface ImageData {
    imageUrl: string;
    showCommentInput: boolean;
    comment: string;
}

export const ImageProvider = ({ children }: any) => {
    const { getItem } = useStorage();
    const username = getItem('username');
    const { authenticated } = useAuth();
  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [images, setImages] = useState<ImageData[]>([]);
    const [comments, setComments] = useState<Comment[]>([]);
    const [showUploadInput, setShowUploadInput] = useState<boolean>(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [newComment, setNewComment] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editingCommentIndex, setEditingCommentIndex] = useState<number>(-1);
    const [comment, setComment] = useState('');
  
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      setSelectedFile(file || null);
    };

    const fetchImages = async () => {
        try {
            const response = await axios.get(backendLink + `/api/users/community`);
            const data = response.data;
            const imageData = data.map((imageUrl: string) => ({
                imageUrl,
                showCommentInput: false,
                comment: '',
            }));
            setImages(imageData);
        } catch (error) {
            console.log(error);
        }
    };
  
    const fetchUserData = async () => {
      try {
        const response = await axios.get(backendLink + `/api/users/userpage/${username}`);
        const userData = response.data;
        const imageData = userData.map((imageUrl: string) => ({
          imageUrl,
          showCommentInput: false,
          comment: '',
        }));
        setImages(imageData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    const loadComments = async (imageUrl: string, index: number) => {
      try {
        const response = await axios.get(backendLink + `/api/users/comments/${username}`, {
          params: { imageUrl },
        });
  
        const commentArray = response.data.map((comment: Comment) => comment);
        setComments(commentArray);
        setSelectedImageIndex(index);
        openModal();
      } catch (error) {
        console.log('Error getting comments: ', error);
      }
    };
  
    const postComment = async (imageUrl: string, comment: string) => {
      try {
        const response = await axios.post(
          backendLink + `/api/users/comments/${username}`,
          {
            comment: comment,
            imageUrl: imageUrl,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        const message = response.data;
        console.log(message);
      } catch (error) {
        console.log('Error posting comment: ', error);
      }
    };

    const editComment = async (oldComment: string, newComment: string) => {
      try {
        const response = await axios.put(
          backendLink + `/api/users/comments/${username}`,
          {
            oldComment: oldComment,
            newComment: newComment,
          }
        );
        const data = response.data;
        console.log(data);
      } catch (error) {
        console.log('Error editing comment: ', error);
      }
    };    
  
    const deleteImage = async (imageUrl: string) => {
      try {
        const response = await axios.delete(backendLink + `/api/users/userpage/${username}`, {
          params: { imageUrl },
        });
        const message = response.data;
        console.log(message);
  
        fetchUserData();
      } catch (error) {
        console.log('Error deleting image: ', error);
      }
    };

    const deleteComment = async (comment: string) => {
      try {
        const response = await axios.delete(backendLink + `/api/users/comments/${username}`, {
          params: { comment },
        });
        const data = response.data;
        console.log(data);
      } catch (error) {
        console.log('Error deleting comment: ', error);
      }
    }
  
    const handleSubmit = async () => {
      if (!selectedFile) {
        console.error('No file selected.');
        return;
      }
  
      try {
        const formData = new FormData();
        formData.append('image', selectedFile);
  
        const response = await axios.post(backendLink + `/api/users/userpage/${username}`, formData);
        console.log('Image uploaded successfully:', response.data);
  
        // Fetch user data again to update the images
        fetchUserData();
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };
  
    const handleToggleUploadInput = () => {
      setShowUploadInput((prevState) => !prevState);
    };

    const handleNewCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setNewComment(event.target.value);
    };
  
    const handleEdit = (index: number) => {
      setIsEditing(true);
      setEditingCommentIndex(index);
    };
  
    const handleSubmitEditedComment = () => {
      if (selectedImageIndex !== null) {
        handleCommentEdit(
          images[selectedImageIndex].imageUrl,
          comments[editingCommentIndex].comment,
          newComment,
          selectedImageIndex
        );
      }
      setIsEditing(false);
      setNewComment('');
      setEditingCommentIndex(-1);
    };    
  
    const handleCancelEdit = () => {
      setIsEditing(false);
      setEditingCommentIndex(-1);
    };
  
    const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setComment(value);
    };
  
    const handleCommentSubmit = async (imageUrl: string, comment: string, index: number) => {
      await postComment(imageUrl, comment);
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[index].comment = '';
        return updatedImages;
      });
  
      // Reset the comment input
      setComment('');
    
      // Fetch the updated comments for the selected image
      await loadComments(imageUrl, index);
    };  

    const handleCommentEdit = async (imageUrl: string, oldComment: string, newComment: string, index: number) => {
      await editComment(oldComment, newComment);
      setImages((prevImages) => {
        const updatedImages = [...prevImages];
        updatedImages[index].comment = '';
        return updatedImages;
      });
  
      // Reset the comment input
      setComment('');
    
      // Fetch the updated comments for the selected image
      await loadComments(imageUrl, index);
    };

    const handleCommentDelete = async (imageUrl: string, comment: string, index: number) => {
      try {
        await deleteComment(comment);
        setImages((prevImages) => {
          const updatedImages = [...prevImages];
          updatedImages[index];
          return updatedImages;
        });

        loadComments(imageUrl, index);
      } catch (error) {
        console.log('Error deleting comment: ', error);
      }
    };
    
  
    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      setComments([]);
      setSelectedImageIndex(null);
    };

    const providerValues = {
      isModalOpen,
      selectedFile,
      images,
      comments,
      showUploadInput,
      selectedImageIndex,
      newComment,
      isEditing,
      editingCommentIndex,
      comment,
      handleFileUpload,
      fetchImages,
      fetchUserData,
      loadComments,
      postComment,
      deleteImage,
      handleSubmit,
      handleToggleUploadInput,
      handleNewCommentChange,
      handleEdit,
      handleSubmitEditedComment,
      handleCancelEdit,
      handleCommentChange,
      handleCommentSubmit,
      openModal,
      closeModal,
      deleteComment,
      handleCommentDelete,
      handleCommentEdit,
    };    
      
    return (
        <ImageContext.Provider value={providerValues}>
          {children}
        </ImageContext.Provider>
    );
};
