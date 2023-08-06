import React, { useState } from 'react';
import Image from 'next/image';
import { useUser } from '../contexts/userContext';
import { useImage } from '../contexts/imageContext';
import useStorage from './useStorage';
import axios from 'axios';
import { backendLink } from '../backend/config';
import styles from '../styles/Modals.module.css';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const EditProfileModal = ({ onClose }: { onClose: () => void }) => {
  const { username, setUsername, email, setEmail } = useUser();
  const { getItem, setItem, removeItem } = useStorage();
  const {
    profilePic,
    showUploadProfilePicInput,
    handleToggleUploadProfilePicInput,
    handleFileUpload,
    handleProfilePicUpload,
    isEditProfileModalOpen
  } = useImage();

  let currentUsername = getItem('username');
  let currentEmail = getItem('email');

  const handleProfilePicSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await handleProfilePicUpload();
  };

  const handleProfileEditSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    await handleProfileEdit();
  };

  const handleProfileEdit = async () => {
    try {
      const userEdits = {
        username,
        email,
      };

      const response = await axios.put(
        backendLink + `/api/users/settings/${currentUsername}`,
        userEdits
      );
      const userData = response.data;
      const newUsername = userData.updatedUsername ?? '';
      const newEmail = userData.updatedEmail ?? '';

      setUsername(newUsername);
      setEmail(newEmail);

      if (newUsername !== '' && newUsername !== currentUsername) {
        removeItem('username');
        setItem('username', newUsername);
      }

      if (newEmail !== '' && newEmail !== currentEmail) {
        removeItem('email');
        setItem('email', newEmail);
      }

      setUsername('');
      setEmail('');
    } catch (error: any) {
      if (error.response.status === 400) {
        window.alert('Username is already taken!');
      }
      else if (error.response.status === 402) {
        window.alert('Email is already taken!');
      }
      else {
        window.alert('Sorry, some error occurred. Please try again!');
      }
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await axios.delete(backendLink + `/api/users/settings/${currentUsername}`);
      const data = response.data;
      console.log(data);
      window.location.href = '/';
    } catch (error) {
      console.log('Error deleting account:', error);
    }
  };

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleShowDeleteConfirmation = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setShowDeleteConfirmation(false);
  };

  const handleConfirmDeleteUser = async () => {
    handleCloseDeleteConfirmation();
    handleDeleteUser();
  };

  return (
    <Modal isOpen={isEditProfileModalOpen} onRequestClose={onClose} ariaHideApp={false}>
      <div className="p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-red-600"
        >
          <FontAwesomeIcon icon={faTimes} size="2x" />
        </button>

        <h1 className="text-2xl font-bold mb-4">Current Profile Pic:</h1>
        <div className="flex items-center">
          <Image src={profilePic} alt="User's Profile Pic" width={70} height={70} className="rounded-full border-2 border-blue-500" />
          <button
            onClick={handleToggleUploadProfilePicInput}
            className="bg-blue-500 text-white py-2 px-4 rounded ml-4"
          >
            Upload New Profile Pic
          </button>
        </div>

        {showUploadProfilePicInput && (
          <div className="mt-4">
            <input type="file" accept="image/*" onChange={handleFileUpload} />
            <button
              onClick={handleProfilePicSubmit}
              className="bg-blue-500 text-white py-2 px-4 rounded mt-2"
            >
              Submit
            </button>
          </div>
        )}

        <form onSubmit={handleProfileEditSubmit} className="mt-6">
          <h1 className="text-2xl font-bold mb-4">Edit Profile Information:</h1>
          <p className="text-lg">Current Username: {currentUsername}</p>
          <label className="block mt-2">
            Username:
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-64 mt-2"
            />
          </label>

          <p className="text-lg mt-4">Current Email: {currentEmail}</p>
          <label className="block mt-2">
            Email:
            <input
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="border border-gray-300 rounded px-2 py-1 w-64 mt-2"
            />
          </label>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
          >
            Save Changes
          </button>
        </form>

        <div className="mt-6">
          <button
            onClick={handleShowDeleteConfirmation}
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            Delete User
          </button>
        </div>

        <Modal isOpen={showDeleteConfirmation} onRequestClose={handleCloseDeleteConfirmation} ariaHideApp={false}>
          <div className="p-4 bg-white rounded">
            <h2 className="text-2xl font-bold mb-4">Confirm Delete User</h2>
            <p className="text-lg">Are you sure you want to delete your user?</p>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleConfirmDeleteUser}
                className="bg-red-500 text-white py-2 px-4 rounded mr-4"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCloseDeleteConfirmation}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>

        <br />
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded mt-4"
        >
          Cancel/Close
        </button>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
