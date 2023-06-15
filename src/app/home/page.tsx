'use client'

import { useState } from 'react';
import axios from 'axios';
import { backendLink } from '../backend/config';

const MyComponent = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setSelectedFile(file || null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      console.error('No file selected.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await axios.post(backendLink + '/api/users/upload', formData);
      console.log('Image uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      <button onClick={handleSubmit}>Upload</button>
    </div>
  );
};

export default MyComponent;
