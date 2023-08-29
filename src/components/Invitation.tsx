import styles from './invitation.module.css'
import api from '@/utils/common'
import { toast } from 'react-hot-toast'
import { useStateContext } from '@/context/StateContext'


const Invitation = ({send, subgroup, name, email, status, id}: {send: boolean, subgroup:string, name: string, email:string, status:string, id:string}) => {
    const {setGroupCount, groupCount} = useStateContext();
    const handleCancel = async() => {
        const token = JSON.parse(localStorage.getItem('token')||'');
        const userId = localStorage.getItem('user_id') || '';
        const urlSpecificInvitation = api.specificInvitation(userId, id);

        try {
            const response = await fetch(urlSpecificInvitation, {
                method: 'DELETE',
                headers: {
                    'Authorization': token
                }
            })
            const data = await response.json();
            if(data.status == 'SUCCESS') toast.success(data.message)
            setGroupCount(groupCount + 1)
        } catch (error) {
            
        }
    }
    return (
        <div className={styles.invitation}>
           <p>Invited to: {subgroup}</p>
            <p>{send ? 'Invited': 'Invited by'}</p>
            <p>Name: {name}</p>
            <p>Email: {email}</p>
            {!send && <div className={styles.buttonsHolder}>
                <button>Accept</button>
                <button>Reject</button>
            </div>}
            {send && <p>Status: {status}</p>}
            {send && <button onClick={handleCancel}>Cancel</button>}
        </div>
    )
}

export default Invitation