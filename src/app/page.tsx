import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faUsers, faImages } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-500 to-purple-500">
      <div className="flex flex-col items-center text-center text-white z-10">
        <h1 className="text-5xl font-bold mb-8">Welcome to Gallery Friends!!!!</h1>
        <p className="text-lg mb-6">Enjoy time with friends and family by sharing your favorite images!</p>
        <p className="text-lg mb-10">Login or sign up for an account to get started!</p>

        <div className="flex space-x-12">
          <div className="flex flex-col items-center">
            <FontAwesomeIcon icon={faCamera} className="text-6xl" />
            <p className="mt-4">Capture Moments</p>
          </div>
          <div className="flex flex-col items-center">
            <FontAwesomeIcon icon={faUsers} className="text-6xl" />
            <p className="mt-4">Connect with Friends</p>
          </div>
          <div className="flex flex-col items-center mt-4"> {/* Corrected class name here */}
            <FontAwesomeIcon icon={faImages} className="text-6xl" />
            <p className="mt-4">Share Memories</p>
          </div>
        </div>
      </div>
    </div>
  );
}
