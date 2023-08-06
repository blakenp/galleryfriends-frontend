import { useState, useEffect } from 'react';
import { backendLink } from '../backend/config';
import axios from 'axios';
import Image from 'next/image';

interface UserSuggestion {
  username: string;
  profilePic: string;
}

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);

  useEffect(() => {
    async function fetchSuggestions() {
      if (query.length > 0) {
        try {
          const response = await axios.get(backendLink + '/api/users/search', {
            params: { query },
          });
          const data = response.data;
          const userSuggestions: UserSuggestion[] = data.map((user: any) => ({
            username: user.username,
            profilePic: user.profilePic,
          }));
          setSuggestions(userSuggestions);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    }

    fetchSuggestions();
  }, [query]);

  const handleUserClick = (username: string) => {
    window.location.href = `/community/userpages/${username}`;
  };

  return (
    <div className="relative inline-block">
      <input
        type="text"
        placeholder="Search for users here..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border-2 border-black rounded px-3 py-2 w-60 text-sm focus:outline-none"
      />
      {suggestions.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded mt-1 shadow-md">
          {suggestions.map((user) => (
            <li
              key={user.username}
              onClick={() => handleUserClick(user.username)}
              className="px-4 py-2 cursor-pointer flex items-center border-b border-gray-200 last:border-b-0"
            >
              <div className="rounded-full overflow-hidden border border-2 border-blue-500">
                <div className="flex items-center h-full">
                  <Image
                    src={user.profilePic}
                    alt="Profile Pic"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </div>
              </div>
              <span className="ml-2 text-sm">{user.username}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
