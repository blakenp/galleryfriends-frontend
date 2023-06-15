'use client';

import { useState } from "react";
import Image, { StaticImageData } from "next/image";
import defaultProfilePic from '/public/images/default_profile_pic.png';
import { useRouter } from 'next/navigation';
import { backendLink } from "../backend/config";
import axios from "axios";

export default function SignUpForm() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [profilePic, setProfilePic] = useState<StaticImageData | string>(defaultProfilePic)

    const router = useRouter()

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        try {

            const user = {
                username,
                email,
                password,
                profilePic
            }
    
            const response = await axios.post(backendLink + '/api/users/create', user)
            console.log(response.data)

            setUsername('')
            setEmail('')
            setPassword('')
            setProfilePic(defaultProfilePic)
            router.push('/login')
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <form onSubmit={handleSubmit}>
            <br />
            <Image src={profilePic} alt="Profile Picture"  />
            <br />
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
                <input type='text' value={password} onChange={(event) => setPassword(event.target.value)}></input>
            </label>
            <br />
            <button type="submit">Signup</button>
        </form>
    )
}