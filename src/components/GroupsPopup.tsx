import styles from './groupsPopup.module.css'
import api from '@/utils/common'
import { toast } from 'react-hot-toast'
import { useStateContext } from '@/context/StateContext'

const GroupsPopup = ({setPopup} : { setPopup:(popup:boolean)=> void}) => {
  const { setLoggedIn, groupCount, setGroupCount } = useStateContext()

  const handleClose = () => {
    setPopup(false)
  } 

  const handleCreateTask = async (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const groupName = (document.getElementById('groupName') as HTMLInputElement).value
    const groupDescription = (document.getElementById('groupDescription') as HTMLInputElement).value
    if(!groupName || !groupDescription) {
      toast.error('Please fill all fields')
      return
    }

    if(groupName.length < 3 || groupName.length > 50) {
      toast.error('Group name must be between 3 and 50 characters')
      return
    }

    if(groupDescription.length < 3 || groupDescription.length > 500) {
      toast.error('Group description must be between 3 and 500 characters')
      return
    }

    const author_id = JSON.parse(localStorage.getItem('user_id') || '')
    const groupData = {
      title: groupName,
      description: groupDescription,
      author_id: author_id
    }
    const url = api.groups(localStorage.getItem('user_id') || '')
    const token = JSON.parse(localStorage.getItem('token') || '')

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(groupData)
      })
      const data = await response.json()
      console.log(data)
      if(data.status == 'SUCCESS') {
        toast.success('Group created successfully')
        setGroupCount(groupCount + 1)
        
      }
      if(data.error){
        toast.error('Your session has expired, please login again');
        localStorage.removeItem('token');
        setLoggedIn(false);
      }
    } catch (error) {
      console.log(error)
    }
    setPopup(false)
  }


   return(
    <div className={styles.popup}>
    <div className={styles.popupContent}>
      <div className={styles.popupHeader}>
        <span onClick={handleClose} className="close">&times;</span>
        <h2>Add Group</h2>
      </div>
      <div className={styles.popupBody}>
        <form>
          <input id='groupName' type="text" placeholder="Group Name" required/>
          <textarea id='groupDescription' placeholder="Group Description" cols={5} required />
          <button onClick={handleCreateTask}>Add Group</button>
        </form>
      </div>
    </div>
  </div>
  )
}

export default GroupsPopup