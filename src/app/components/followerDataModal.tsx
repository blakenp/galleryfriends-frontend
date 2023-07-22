// FollowerDataModal.tsx
import React from 'react';
import Image from 'next/image';
import Modal from 'react-modal';
import { FollowerData, FolloweeData } from '../contexts/imageContext';
import styles from '../styles/Modals.module.css';

type FollowerDataModalProps = {
  isFollowerDataModalOpen: boolean;
  closeFollowerDataModal: () => void;
  followerData: FollowerData[];
  followeeData: FolloweeData[];
};

const handleFollowDataRedirect = (username: string)=> {
  window.location.href = `/community/userpages/${username}`
}

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
      <h2>Followers and Followees</h2>
      <div>
        <h3>Followers Count: {followerData.length}</h3>
        {followerData.length > 0 ? (
          <div>
            <h3>Followers:</h3>
            <ul>
              {followerData.map((follower: FollowerData) => (
                <li key={follower.followerName} className={styles.profileContainer}>
                  <div className={styles.hoverArea} onClick={() => handleFollowDataRedirect(follower.followerName)}>
                    <div className={styles.profileInfo}>
                      <Image
                        src={follower.followerProfilePic}
                        alt={`${follower.followerName}'s Profile Pic`}
                        width={50}
                        height={50}
                        className={styles.profilePic}
                      />
                      <span>{follower.followerName}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No followers found.</p>
        )}
      </div>
      <div>
        <h3>Following Count: {followeeData.length}</h3>
        {followeeData.length > 0 ? (
          <div>
            <h3>Following:</h3>
            <ul>
              {followeeData.map((followee: FolloweeData) => (
                <li key={followee.followeeName} className={styles.profileContainer} onClick={() => handleFollowDataRedirect(followee.followeeName)}>
                  {/* Add a div with hoverArea class to handle the cursor pointer on hover */}
                  <div className={styles.hoverArea}>
                    {/* Wrap the profile picture and name in the profileInfo container */}
                    <div className={styles.profileInfo}>
                      <Image
                        src={followee.followeeProfilePic}
                        alt={`${followee.followeeName}'s Profile Pic`}
                        width={50}
                        height={50}
                        className={styles.profilePic}
                      />
                      <span>{followee.followeeName}</span>
                    </div>
                  </div>
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
