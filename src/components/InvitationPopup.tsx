import styles from './invitationPopup.module.css'
import { useStateContext } from '@/context/StateContext';
import React from 'react';
import api from '@/utils/common';
import { toast } from 'react-hot-toast';

const InvitationPopup = () => {
  const { setInvitationPopup,
          allUsers,
          groups,
          setGroupCount,
          groupCount,
          userInvitation,
          setUserInvitation,
          subgroupInvitation,
          setSubgroupInvitation,
          token,
          user
        } = useStateContext();

  const subgroups : any = []
  
  groups.forEach(group => {group.subgroups.forEach(subgroup => subgroups.push(subgroup))})

  const handleEmailChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setUserInvitation(e.target.value);
  }

  const handleSubgroupChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setSubgroupInvitation(e.target.value)
  }

  const handleSend = async(e: React.MouseEvent) => {
    e.preventDefault();
    if(userInvitation == '' || subgroupInvitation == ''){
      toast.error('Please select all the information');
      return;
    }
    let dataToSend = {
      invitation: {
        user_id: userInvitation,
        subgroup_id: subgroupInvitation,
        author_id: user.id ,
        status: 'Pending'
      }
    };

    try {
      const response = await fetch(api.invitations(user.id), {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(dataToSend)
      })
      const data = await response.json();

      if ( data.status == 'ERROR') toast.error(data.message)
      if ( data.status == 'SUCCESS') toast.success(data.message)
      setInvitationPopup(false);
      setGroupCount(groupCount + 1)
    } catch (error) {
      console.log(error)
    }
    setUserInvitation('');
    setSubgroupInvitation('');
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
              <option value=''>Email</option>
              {allUsers.map((userToMap:any) => {
                if(userToMap.id != user.id){
                  return <option key={userToMap.id} value={userToMap.id} >{userToMap.email}</option>
                }
              }
              )}
            </select>
            <p>Select the Subgroup: </p>
            <select id='subgroupOption' name='subgroup' onChange={handleSubgroupChange}>
            <option value=''>Subgroup</option>
              {subgroups.length > 0  ? subgroups.map((subgroup:any) => (
                <option key={subgroup.id} value={subgroup.id} >{subgroup.title}</option>
              )) :<option >You don&apos;t have any subgroups yet</option>}
            </select>
            <button onClick={handleSend}>Send</button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default InvitationPopup;