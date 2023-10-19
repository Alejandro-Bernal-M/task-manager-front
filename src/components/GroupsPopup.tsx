import styles from './groupsPopup.module.css'
import api from '@/utils/common'
import { toast } from 'react-hot-toast'
import { useStateContext } from '@/context/StateContext'

const GroupsPopup = () => {
  const { setLoggedIn, groupCount, setGroupCount, groupAndSubgroupsPopUp, setGroupPopup, groupId, user } = useStateContext()

  const handleClose = () => {
    setGroupPopup(false)
  } 

  const handleCreateTask = async (e:React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const groupName = (document.getElementById('groupName') as HTMLInputElement).value
    const groupDescription = (document.getElementById('groupDescription') as HTMLInputElement).value
    if(!groupName || !groupDescription) {
      toast.error('Please fill all fields')
      return
    }
    let groupOrSubgroup = groupAndSubgroupsPopUp?.title.split(' ')[0]

    if(groupName.length < 3 || groupName.length > 50) {
      toast.error( `${groupOrSubgroup} name must be between 3 and 50 characters`)
      return
    }

    if(groupDescription.length < 3 || groupDescription.length > 500) {
      toast.error(`${groupOrSubgroup} description must be between 3 and 500 characters`)
      return
    }
    const author_id = user.id;
    const groupData = {
      title: groupName,
      description: groupDescription,
      author_id: author_id
    }
    const token = JSON.parse(localStorage.getItem('token') || '')
    
    if(groupOrSubgroup == 'Group') {
    const url = api.groups(user.id)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(groupData)
      })
      const data = await response.json();
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
  }else {
    const urlSubgroups = api.subGroups(author_id, groupId);
    try {
      const response = await fetch(urlSubgroups, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          subgroup: {
            title: groupName,
            description: groupDescription,
            group_id: groupId,
          }
        })
      })
      const data = await response.json();
      if(data.status == 'SUCCESS'){
        toast.success('Subgroup Created Successfully');
        setGroupCount(groupCount + 1);
      }
      if(data.error){
        toast.error('Your session has expired, please login again');
        localStorage.removeItem('token');
        setLoggedIn(false);
      }
    } catch (error) {
      console.log(error)
    }
  }
  setGroupPopup(false)
  }


   return(
    <div className={styles.popup}>
    <div className={styles.popupContent}>
      <div className={styles.popupHeader}>
        <span onClick={handleClose} className="close">&times;</span>
        <h2>{groupAndSubgroupsPopUp?.popupTitle}</h2>
      </div>
      <div className={styles.popupBody}>
        <form>
          <input id='groupName' type="text" placeholder={groupAndSubgroupsPopUp?.title} required/>
          <textarea id='groupDescription' placeholder={groupAndSubgroupsPopUp?.description} cols={5} required />
          <button onClick={handleCreateTask}>{groupAndSubgroupsPopUp?.button}</button>
        </form>
      </div>
    </div>
  </div>
  )
}

export default GroupsPopup