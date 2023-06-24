'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/authContext';
import { backendLink } from '../backend/config';
import useStorage from './useStorage';

const UserComponent = () => {
  const { getItem } = useStorage();
  const username = getItem('username')
  const { authenticated } = useAuth()

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get(backendLink + `/api/users/${username}`);
      const userData = response.data;
      setImages(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      console.error('No file selected.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await axios.post(backendLink + `/api/users/${username}`, formData);
      console.log('Image uploaded successfully:', response.data);

      // Fetch user data again to update the images
      fetchUserData();
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  useEffect(() => {
    // Fetch user data only once on component mount
    fetchUserData();
  }, []);

  return (
    <div>
        {authenticated ? (
        <>
          <h1>Welcome, {username}!</h1>
          <input type="file" accept="image/*" onChange={handleFileUpload} />
          <button onClick={handleSubmit}>Upload</button>
          <br />
          {images.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Image ${index}`} />
          ))}
        </>
      ) : (
        <h1>Verification failed. Please log in again.</h1>
      )}
    </div>
  );
};

export default UserComponent;
