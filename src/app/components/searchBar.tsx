import { useState, useEffect } from 'react';
import { backendLink } from '../backend/config';
import axios from 'axios';
import styles from '../styles/SearchBar.module.css';
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
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search for users here..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul className={styles.suggestionsList}>
        {suggestions.map((user) => (
          <li key={user.username} onClick={() => handleUserClick(user.username)}>
            <div className={styles.suggestionItem}>
              <Image src={user.profilePic} alt="Profile Pic" width={30} height={30} className={styles.profilePic} />
              <span>{user.username}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchBar;
