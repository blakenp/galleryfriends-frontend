import { useAuth } from '../contexts/authContext';
import { useImage } from '../contexts/imageContext';
import { useEffect, useState } from 'react';
import useStorage from './useStorage';
import Image from 'next/image';
import CommunityPageModal from './communityPageModal';
import SearchBar from './searchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

export default function CommunityPage() {
  const {
    images,
    likesMap,
    likesCheckerMap,
    fetchImages,
    loadComments,
    getLikes,
    likePost,
    unLikePost,
    closeModal,
  } = useImage();

  const { getItem } = useStorage();
  const username = getItem('username');
  const { authenticated } = useAuth();
  const [isLikesUpdated, setIsLikesUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);

  // Function to check if the current user has already liked an image
  const hasUserLikedImage = (imageUrl: string) => {
    if (likesCheckerMap !== null && likesCheckerMap.hasOwnProperty(imageUrl)) {
      const usernamesSet = new Set(likesCheckerMap[imageUrl]);
      return usernamesSet.has(username);
    }
    return false;
  };

  useEffect(() => {
    fetchImages();
    setIsImagesLoaded(true);
  }, []);

  useEffect(() => {
    if (images.length !== 0) {
      getLikes(images);
      console.log('LikesMaps in community page: ', likesMap);
    }
  }, [images]);

  useEffect(() => {
    getLikes(images);
    setIsLikesUpdated(false);
  }, [isLikesUpdated]);

  useEffect(() => {
    // Fetch the authenticated state or do any other asynchronous operations here
    // Once the authenticated state is loaded, set isLoading to false
    const loadAuthenticatedState = async () => {
      // Fetch authenticated state or do any asynchronous operations here
      // For example, you can use an API call or a local storage check
      // For the sake of example, we're using a simple setTimeout to simulate loading
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a 1-second delay
      setIsLoading(false);
    };

    loadAuthenticatedState();
  }, []);

  const handleLikePost = async (imageUrl: string) => {
    try {
      if (hasUserLikedImage(imageUrl)) {
        await unLikePost(imageUrl);
      } else {
        await likePost(imageUrl);
      }

      setIsLikesUpdated(true);
    } catch (error) {
      console.log('Error liking post: ', error);
    }
  };

  const handleUserClick = (username: string) => {
    window.location.href = `/community/userpages/${username}`;
  };

  return (
    <div className="min-h-screen">
      {isLoading ? (
        // Render the loading animation or content while waiting for the authenticated state
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
        </div>
      ) : authenticated ? (
        // Render the community page content when authenticated state is loaded and true
        <>
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4 text-white">Welcome, {username}!</h1>
            <SearchBar />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {images.map((image: any, index: number) => (
              <div key={index} className="flex flex-col bg-white rounded-lg shadow-lg pt-4">
                <div className="flex items-center p-4">
                  <button
                    className="flex items-center"
                    onClick={() => handleUserClick(image.username)}
                  >
                    <div className="rounded-full overflow-hidden border border-2 border-blue-500">
                      <Image src={image.profilePic} alt="Profile Pic" width={50} height={50} />
                    </div>
                    <p className="ml-2 font-bold cursor-pointer">{image.username}</p>
                  </button>
                </div>
                <div className="h-64 w-64 relative overflow-hidden mx-auto">
                  <Image src={image.imageUrl} alt="Uploaded Image" layout="fill" objectFit="contain" />
                </div>

                <div className="p-4 flex justify-between items-center">
                  <button
                    className={`flex items-center text-sm font-bold ${
                      hasUserLikedImage(image.imageUrl) ? 'text-red-500' : 'text-gray-600'
                    }`}
                    onClick={() => handleLikePost(image.imageUrl)}
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      style={{
                        fill: hasUserLikedImage(image.imageUrl) ? 'red' : 'none', // Fill with red when liked, no fill when not liked
                        fontSize: hasUserLikedImage(image.imageUrl) ? '22px' : '18px', // Increase the heart icon size here
                      }}
                    />
                    <span className="ml-1">{likesMap !== null ? likesMap[image.imageUrl] || 0 : 0}</span>
                  </button>
                  <button
                    className="px-2 py-1 bg-gray-500 text-white rounded text-sm"
                    onClick={() => loadComments(image.imageUrl, index)}
                  >
                    View Comments
                  </button>
                </div>
              </div>
            ))}
          </div>

          <CommunityPageModal onClose={closeModal} />
        </>
      ) : (
        // Render a message or other content when authenticated state is loaded and false
        <h1 className="text-3xl font-bold text-center text-white">Verification failed. Please log in again.</h1>
      )}
    </div>
  );
}
