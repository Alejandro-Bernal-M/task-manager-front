'use client'

import styles from './profile.module.css'
import { toast } from 'react-hot-toast';
import api from '@/utils/common';
import { useStateContext } from '@/context/StateContext';
import { useEffect, useState } from 'react';
import Invitation from '@/components/Invitation';
import InvitationPopup from '@/components/InvitationPopup';

const Profile = () =>{
  const { setLoggedIn, invitationPopup, setInvitationPopup,user, setAllUsers, token, invitations } = useStateContext();
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

useEffect(() => {
  setName(user.name);
  setEmail(user.email);
}, [user])
    

  const handleEdit = () => {
    const token = JSON.parse(localStorage.getItem('token') || '');
    const userId = user.id;
    const url = api.user(userId);
    if(password !== confirm){
      toast.error('Passwords do not match');
      return;
    }
    const body = {
      user: {
        name: name,
        email: email,
        password: password,
        password_confirmation: confirm
      }
    }
    const editUser = async () => {
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify(body)
        })
        const data = await response.json();
        if (response.status == 422){
          toast.error('Email already in use');
          setEmail(user.email);
          setEdit(!edit);
          return;
        }
        if(data.status === 'SUCCESS'){
          toast.success('User updated successfully');
          setName(data.data.name);
          setEmail(data.data.email);
          setEdit(!edit);
          setPassword('');
          setConfirm('');
        }
        if(data.error == 'Unauthorized'){
          setEdit(!edit);
          toast.error('Your session has expired, please login again');
          localStorage.removeItem('token');
          localStorage.removeItem('user_id');
          setLoggedIn(false);
          return;
        }
      } catch (error) {
        console.log('error', error);
      }
    }
    editUser();
  }

  const handleNewInvitation = () => {
    setInvitationPopup(!invitationPopup);
  }

  return(
    <div className={styles.container}>
      {invitationPopup && <InvitationPopup />}
      <h1>Your Profile</h1>
      <div className={styles.userContainer}>
          <p>Name:</p>
          {!edit &&  <p>{name}</p>}
          {edit &&  <input  defaultValue={name} onChange={(e) => setName(e.target.value)}></input>}
          <p>Email:</p>
          {!edit && <p>{email}</p>}
          {edit &&  <input defaultValue={email} onChange={(e) => setEmail(e.target.value)}></input>}
          {edit && <p>Password: <i>Leave it blank if you don&apos;t want to chage it.</i></p>}
          {edit && <input type="password" placeholder='New password' onChange={(e) => setPassword(e.target.value)}/>}
          {edit && <input type="password" placeholder='Confirm your new password' onChange={(e) => setConfirm(e.target.value)} />}
          {!edit && <button onClick={() => {setEdit(!edit)}}>Edit</button>}
          {edit && <button onClick={handleEdit}>Save</button>}
      </div>
      <div className={styles.mainHolder}>
        <div className={styles.invitationsContainer}>
          <h2>Your Pendings Invitations</h2>
          <hr />
          <div className={styles.invitationsHolder}>
            {invitations.received.filter((inv:any) => inv.status == 'Pending').length > 0 ? invitations.received.filter((inv:any) => inv.status == 'Pending').map((invitation: any) => (  
              <Invitation key={invitation.id} send={false} subgroup={invitation.subgroup} subgroupId={invitation.subgroup_id} name={invitation.invited_by.name} email={invitation.invited_by.email} status={invitation.status} id={invitation.id} />
              )) : <p className={styles.noInvitation}>No Invitations</p>}
          </div>
        </div>
        <div className={styles.invitationsContainer}>
          <h2>Your Sent Invitations</h2>
          <hr />
          <button className={styles.newInvitation} onClick={handleNewInvitation}>New invitation +</button>
          <div className={styles.invitationsHolder}>
            {invitations.send.length > 0 ? invitations.send.map((invitation: any) => (
              <Invitation key={invitation.id} send={true} subgroup={invitation.subgroup} subgroupId={invitation.subgroup_id}  name={invitation.invited.name} email={invitation.invited.email} status={invitation.status} id={invitation.id} />
                )) : <p className={styles.noInvitation}>No Invitations</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;