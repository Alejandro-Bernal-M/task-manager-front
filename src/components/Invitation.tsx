import styles from './invitation.module.css'
import api from '@/utils/common'
import { toast } from 'react-hot-toast'
import { useStateContext } from '@/context/StateContext'


const Invitation = ({send, subgroup, subgroupId, name, email, status, id}: {send: boolean, subgroup:string, subgroupId:string, name: string, email:string, status:string, id:string}) => {
    const {setGroupCount, groupCount, setLoggedIn, token, userInvitation, subgroupInvitation} = useStateContext();
    const userId = localStorage.getItem('user_id') || '';
    const urlSpecificInvitation = api.specificInvitation(userId, id);
    const handleCancel = async() => {

        try {
            const response = await fetch(urlSpecificInvitation, {
                method: 'DELETE',
                headers: {
                    'Authorization': token
                }
            })
            const data = await response.json();
            if(data.status == 'SUCCESS') toast.success(data.message)
            if(data.error == 'Unauthorized'){
                toast.error('Your session has expired, please login again');
                localStorage.removeItem('token');
                localStorage.removeItem('user_id');
                setLoggedIn(false);
                }
                setGroupCount(groupCount + 1)
            } catch (error) {
                
            }
            }

    const handleReject = async() => {
        const dataToChange = {
            invitation: {
                status: 'Rejected'
            }
        }
        try {const response = await fetch(urlSpecificInvitation, {
            method: 'PATCH',
            headers: {
                'Content-Type':'application/json',
                'Authorization': token
            },
            body: JSON.stringify(dataToChange)
        })
        const data = await response.json()
        if (data.status == 'SUCCESS') toast.success(data.message)
        if (data.status == 'ERROR') toast.error(data.message)
        if(data.error == 'Unauthorized'){
            toast.error('Your session has expired, please login again');
            localStorage.removeItem('token');
            localStorage.removeItem('user_id');
            setLoggedIn(false);
        }
        setGroupCount(groupCount - 1)
        } catch(error){
            console.log(error)
        } 
    }

    const handleAccept = async() => {
        try {
            const response = await fetch(api.userGroups(userId), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    usergroup: {
                        user_id: userId,
                        subgroup_id : subgroupId
                    }
                })
            })
            const data = await response.json()
            if (data.status == 'SUCCESS'){
                toast.success(data.message)
                const dataToChange = {
                    invitation: {
                        status: 'Accepted'
                    }
                }
                try {const response = await fetch(urlSpecificInvitation, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type':'application/json',
                        'Authorization': token
                    },
                    body: JSON.stringify(dataToChange)
                })
                } catch(error) {
                    console.log(error)
                }
            }   
            if (data.status == 'ERROR') toast.error(data.message)
            setGroupCount(groupCount - 1)
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
                <button onClick={handleAccept}>Accept</button>
                <button onClick={handleReject}>Reject</button>
            </div>}
            {send && <p>Status: {status}</p>}
            {send && <button onClick={handleCancel}>{status =='Pending' ? 'Cancel' : 'Delete'}</button>}
        </div>
    )
}

export default Invitation