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
          groupCount,
          userGroups,
          setUserGroups,
          setGroupAndSubgroupsPopUp,
          groupPopup,
          setGroupPopup,
          token
        } = useStateContext();

  const userId = localStorage.getItem('user_id') || '';
  const urlUserGroups = api.userGroups(userId);

  useEffect(() => {

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


  fetchUserGroups();
  }, [ token, groupCount, urlUserGroups, setUserGroups, setLoggedIn])

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