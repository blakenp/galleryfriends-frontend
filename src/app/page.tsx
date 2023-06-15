'use client';

import axios from 'axios';
import { backendLink } from './backend/config';

export default function Home() {

  const getData = async () => {
    try {
      const response = await axios.get('/api/mongodb')
      const data = response.data
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  const submitToDB = async () => {
    try {
      const response = await axios.post(backendLink + '/api/users/create', {

      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = response.data
      console.log(data)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <button onClick={()=> submitToDB()}>submitToDB</button>
    </div>
  )
}
