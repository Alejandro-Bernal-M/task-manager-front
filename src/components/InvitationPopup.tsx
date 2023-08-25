import styles from './invitationPopup.module.css'
import { useStateContext } from '@/context/StateContext';
import { useState } from 'react';
import React from 'react';

const InvitationPopup = () => {
  const { setInvitationPopup, allUsers } = useStateContext();
  console.log(allUsers)
  const [user, setUser] = useState({} as any)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
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
            <select id='emailOption' name='email' onChange={handleChange}>
              <option value=''>Select User</option>
              {allUsers.map((user:any) => (
                <option key={user.id} value={user.id} >{user.email}</option>
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