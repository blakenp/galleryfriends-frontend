// FollowerDataModal.tsx
import React from 'react';
import Image from 'next/image';
import Modal from 'react-modal';
import { FollowerData, FolloweeData } from '../contexts/imageContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

type FollowerDataModalProps = {
  isFollowerDataModalOpen: boolean;
  closeFollowerDataModal: () => void;
  followerData: FollowerData[];
  followeeData: FolloweeData[];
};

const handleFollowDataRedirect = (username: string) => {
  window.location.href = `/community/userpages/${username}`;
};

const FollowerDataModal: React.FC<FollowerDataModalProps> = ({
  isFollowerDataModalOpen,
  closeFollowerDataModal,
  followerData,
  followeeData,
}) => {
  return (
    <Modal
      isOpen={isFollowerDataModalOpen}
      onRequestClose={closeFollowerDataModal}
      contentLabel="Followers and Followees"
      ariaHideApp={false}
    >
      <button
        className="absolute top-4 right-4"
        onClick={closeFollowerDataModal}
      >
        <FontAwesomeIcon icon={faTimes} size="2x" />
      </button>
      <h2 className="text-center text-2xl font-bold mb-4">Followers and Followees</h2>
      <div className="mb-4">
        <h3 className="text-lg font-bold mb-2">Followers Count: {followerData.length}</h3>
        {followerData.length > 0 ? (
          <div>
            <h3 className="text-lg font-bold mb-2">Followers:</h3>
            <ul>
              {followerData.map((follower: FollowerData) => (
                <li
                  key={follower.followerName}
                  className="border-b border-gray-300 p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleFollowDataRedirect(follower.followerName)}
                >
                  <div className="rounded-full overflow-hidden border border-2 border-blue-500">
                    <Image
                      src={follower.followerProfilePic}
                      alt={`${follower.followerName}'s Profile Pic`}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </div>
                  <span className="text-lg font-medium">{follower.followerName}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No followers found.</p>
        )}
      </div>
      <div>
        <h3 className="text-lg font-bold mb-2">Following Count: {followeeData.length}</h3>
        {followeeData.length > 0 ? (
          <div>
            <h3 className="text-lg font-bold mb-2">Following:</h3>
            <ul>
              {followeeData.map((followee: FolloweeData) => (
                <li
                  key={followee.followeeName}
                  className="border-b border-gray-300 p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleFollowDataRedirect(followee.followeeName)}
                >
                  <div className="rounded-full overflow-hidden border border-2 border-blue-500">
                    <Image
                      src={followee.followeeProfilePic}
                      alt={`${followee.followeeName}'s Profile Pic`}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                  </div>
                  <span className="text-lg font-medium">{followee.followeeName}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>You aren't following anyone.</p>
        )}
      </div>
    </Modal>
  );
};

export default FollowerDataModal;
