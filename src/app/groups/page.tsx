'use client'
import { useEffect, useState } from 'react';
import styles from './groups.module.css';
import { toast } from 'react-hot-toast';
import api from '@/utils/common';
import { useStateContext } from '@/context/StateContext';
import GroupsPopup from '@/components/GroupsPopup';
import Group from '@/components/Group';
import Subgroup from '@/components/Subgroup';

const Groups = () => {
  const {
          setLoggedIn,
          groups,
          setGroups,
          groupCount,
          userGroups,
          setUserGroups,
          groupAndSubgroupsPopUp,
          setGroupAndSubgroupsPopUp,
          groupPopup,
          setGroupPopup
        } = useStateContext();
    
  let tokenString = localStorage.getItem('token') || '';
  if (!tokenString) {
    toast.error('Your session has expired, please login again');
    setLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    tokenString = JSON.stringify('');
  }
  const token = JSON.parse(tokenString);

  const userId = localStorage.getItem('user_id') || '';
  const urlGroups = api.groups(userId);
  const urlUserGroups = api.userGroups(userId);

  useEffect(() => {
    const fetchGroups = async () => {
      try{
        const response = await fetch(urlGroups, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        });
        const data = await response.json();
        if(data.status === 'SUCCESS'){
          setGroups(data.data);
        }
        if(data.error == 'Unauthorized'){
          toast.error('Your session has expired, please login again');
          localStorage.removeItem('token');
          localStorage.removeItem('user_id');
          setLoggedIn(false);
        }
    }
    catch(error){
      console.log(error);
    }
  }

  const fetchUserGroups = async () => {
    try {
      const response = await fetch(urlUserGroups, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      const data = await response.json();
      if(data.status === 'SUCCESS'){
        setUserGroups(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  fetchGroups();
  fetchUserGroups();
  }, [setGroups, urlGroups, token, groupCount, urlUserGroups, setUserGroups, setLoggedIn])


  const handleAddGroup = async() => {
    setGroupAndSubgroupsPopUp({
      popupTitle: 'Add Group',
      title: 'Group Name',
      description: 'Group Description',
      button: 'Add Group'
    })

    setGroupPopup(true);
  }

  return (
    <div className={styles.container}>
      {groupPopup && <GroupsPopup />}
        <div className={styles.mainHolder}>
          <div className={styles.groupHolder}>
            <h2>Groups Created by you</h2>
            <hr />
            <button className={styles.addGroup} onClick={handleAddGroup}>Add Group +</button>
            <div className={styles.groupList}>
              {groups.map((group, index) => (
                <Group key={index} title={group.group.title} description={group.group.description} id={group.group.id} subGroups={group.subgroups} />
              ))}
            </ div>
          </div>
          <div className={styles.groupHolder}>
            <h2>Sub-groups where you are in</h2>
            <hr />
            <div className={styles.subGroupHolder}>
              {userGroups.map((group, index) => (
                <Subgroup key={index} title={group.title} groupId={'0'} id={0} subGroupColumn={false} />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
};

export default Groups;