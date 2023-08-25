import styles from './invitationPopup.module.css'
import { useStateContext } from '@/context/StateContext';
import { useState } from 'react';
import React from 'react';

const InvitationPopup = () => {
  const { setInvitationPopup, allUsers, groups } = useStateContext();
  console.log(allUsers)
  console.log(groups)

  const subgroups : any = []

  groups.forEach(group => {group.subgroups.forEach(subgroup => subgroups.push(subgroup))})
  console.log('subs', subgroups)
  const [user, setUser] = useState({} as any)

  const handleEmailChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setUser(e.target.value);
    console.log(e.target.value);
  }

  const handleSend = async(e: React.MouseEvent) => {
    e.preventDefault();
    console.log(user)
  }
  return (
    <div className={styles.invitationPopup}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <span onClick={() => setInvitationPopup(false)} className="close">&times;</span>
          <h2>Invitation</h2>
        </div>
        <div className={styles.popupBody}>
          <form>
            <p>Select the user:</p>
            <select id='emailOption' name='email' onChange={handleEmailChange}>
              {allUsers.map((user:any) => (
                <option key={user.id} value={user.id} >{user.email}</option>
              ))}
            </select>
            <p>Select the Subgroup: </p>
            <select id='subgroupOption' name='subgroup'>
              {subgroups.map((subgroup:any) => (
                <option key={subgroup.id} value={subgroup.id} >{subgroup.title}</option>
              ))}
            </select>
            <button onClick={handleSend}>Send</button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default InvitationPopup;