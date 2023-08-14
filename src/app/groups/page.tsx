'use client'
import { useEffect } from 'react';
import styles from './groups.module.css';
import { toast } from 'react-hot-toast';
import api from '@/utils/common';
import { useStateContext } from '@/context/StateContext';

const Groups = () => {
const {
        setLoggedIn,
        groups,
        setGroups
      } = useStateContext();
      
const tokenString = localStorage.getItem('token');
if (!tokenString) {
  toast.error('Your session has expired, please login again');
  setLoggedIn(false);
  localStorage.removeItem('token');
  localStorage.removeItem('user_id');
  return;
}
const token = JSON.parse(tokenString) || '';

const userId = localStorage.getItem('user_id') || '';
const url = api.Groups(userId);

useEffect(() => {
  const fetchGroups = async () => {
    try{
      const response = await fetch(url, {
        method: 'Get',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      const data = await response.json();
      console.log(data)
      if(data.status === 'SUCCESS'){
        setGroups(data.data);
      }
  }
  catch(error){
    console.log(error);
  }
}
fetchGroups();
}, [])


const handleAddGroup = async() => {
  
  toast.success('Group added successfully');
}

return (
  <div className={styles.container}>
      <div className={styles.mainHolder}>
        <div className={styles.groupHolder}>
          <h2>Groups Created by you</h2>
          <hr />
          <button className={styles.addGroup} onClick={handleAddGroup}>Add Group +</button>
          <div className={styles.groupList}>
            {groups.map((group, index) => (
              <div className={styles.group} key={index}>
                <p>{group.title}</p>
                <p>{group.description}</p>
              </div>
            ))}
          </ div>
        </div>
        <div className={styles.groupHolder}>
          <h2>Sub-groups where you are in</h2>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Groups;