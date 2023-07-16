import Image from 'next/image';
import { useState } from 'react';
import { useUser } from '../contexts/userContext';
import { useImage } from '../contexts/imageContext';
import useStorage from './useStorage';
import axios from 'axios';
import { backendLink } from '../backend/config';

const EditProfileModal = ({ onClose }: { onClose: () => void }) => {
  const { username, setUsername, email, setEmail } = useUser();
  const { getItem, setItem, removeItem } = useStorage();
  const {
    profilePic,
    showUploadProfilePicInput,
    handleToggleUploadProfilePicInput,
    handleFileUpload,
    handleProfilePicUpload,
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
    console.log('handleProfileEditSubmit'); // Add this line
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
      console.log('User Data: ', userData);
      const newUsername = userData.updatedUsername ?? '';
      const newEmail = userData.updatedEmail ?? '';

      setUsername(newUsername);
      setEmail(newEmail);

      if (newUsername !== '' && newUsername !== currentUsername) {
        console.log('replacing current username');
        removeItem('username');
        setItem('username', newUsername);
      }

      if (newEmail !== '' && newEmail !== currentEmail) {
        console.log('replacing current email');
        removeItem('email');
        setItem('email', newEmail);
      }

      setUsername('');
      setEmail('');
    } catch (error: any) {
      console.log('error message: ', error.message);
      if (error.response.status === 400) {
        window.alert('Username is already taken!');
      }
      else if (error.response.status === 402) {
        window.alert('Email is already taken!');
      }
      else {
        console.log('Error editing profile info:', error);
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
      // Handle the response as needed
    } catch (error) {
      console.log('Error deleting account:', error);
    }
  };

  const confirmDeleteUser = () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your user?');
    if (confirmDelete) {
      handleDeleteUser();
    }
  };

  return (
    <div>
      <h1>Current Profile Pic:</h1>
      <br />
      <Image src={profilePic} alt="User's Profile Pic" width={50} height={50} />
      <button onClick={handleToggleUploadProfilePicInput}>Upload New Profile Pic</button>

      {showUploadProfilePicInput && (
        <div>
          <input type="file" accept="image/*" onChange={handleFileUpload} />
          <button onClick={handleProfilePicSubmit}>Submit</button>
        </div>
      )}

      <form onSubmit={handleProfileEditSubmit}>
        <br />
        <h1>Edit Profile Information:</h1>
        <p>Current Username: {currentUsername}</p>
        <label>
          Username:
          <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <br />

        <p>Current Email: {currentEmail}</p>
        <label>
          Email:
          <input type="text" value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <br />

        <button type="submit">Save Changes</button>
        <button type="button" onClick={onClose}>
          Cancel/Close
        </button>
      </form>

      <div>
        <br />
        <button onClick={confirmDeleteUser}>Delete User</button>
      </div>
    </div>
  );
};

export default EditProfileModal;
