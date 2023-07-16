'use client';

import { useRouter } from 'next/navigation';
import { useUser } from "../contexts/userContext";
import { backendLink } from "../backend/config";
import axios from "axios";

export default function SignUpForm() {
  const { username, setUsername, password, setPassword, email, setEmail } = useUser();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const user = {
        username,
        email,
        password,
      };

      const response = await axios.post(backendLink + '/api/users/create', user);
      console.log(response.data);

      setUsername('');
      setPassword('');
      setEmail('');
      router.push('/login');
    } catch (error: any) {
        console.log(error)
        if (error.response && error.response.status === 400) {
            window.alert('That username already exists in our system!');
        }
        else if (error.response.status === 402) {
            window.alert('That email already exists in our system!')
        }
        else {
            console.log('Error creating user account: ', error);
            window.alert('Sorry, an error occurred. Try again!');
        }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input type='text' value={username} onChange={(event) => setUsername(event.target.value)}></input>
      </label>
      <br />
      <label>
        Email:
        <input type='text' value={email} onChange={(event) => setEmail(event.target.value)}></input>
      </label>
      <br />
      <label>
        Password:
        <input type='password' value={password} onChange={(event) => setPassword(event.target.value)}></input>
      </label>
      <br />
      <button type="submit">Signup</button>
    </form>
  );
}
