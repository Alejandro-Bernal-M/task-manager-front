'use client'

import styles from './profile.module.css'
import { toast } from 'react-hot-toast';
import api from '@/utils/common';
import { useStateContext } from '@/context/StateContext';
import { useEffect, useState } from 'react';

const Profile = () =>{
    const { setLoggedIn } = useStateContext();
    const [user, setUser] = useState({} as any);
    let tokenString = localStorage.getItem('token') || '';
    if (!tokenString) {
      toast.error('Your session has expired, please login again');
      setLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      tokenString = '';
    }
    const token = JSON.parse(tokenString);
    const userId = localStorage.getItem('user_id') || '';
    const urlUser = api.user(userId);
    useEffect(() => {
        const fetchUser = async () => {
          try{
            const response = await fetch(urlUser, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              }
            });
            const data = await response.json();

            if(data.status === 'SUCCESS'){
              setUser(data.data);
            }
            if(data.error == 'Unauthorized'){
              toast.error('Your session has expired, please login again');
              localStorage.removeItem('token');
              localStorage.removeItem('user_id');
              setLoggedIn(false);
            }
        }
        catch(error){
          toast.error('Your session has expired, please login again');
          localStorage.removeItem('token');
          localStorage.removeItem('user_id');
          setLoggedIn(false);
        }
      }
      fetchUser();
    }, [setLoggedIn, token, urlUser]);


    return(
        <div className={styles.container}>
            <h1>Your Profile</h1>
            <div className={styles.userContainer}>
                <p>Name: {user.name}</p>
                <p>Email: {user.email}</p>
                <button>Edit</button>
            </div>
        </div>
    )
}

export default Profile;