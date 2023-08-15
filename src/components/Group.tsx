import styles from './group.module.css';
import api from '@/utils/common';
import { useStateContext } from '@/context/StateContext';
import { toast } from 'react-hot-toast';

const Group = ({title, description, id}:{title:string, description:string, id:string}) => {
  const { setGroupCount, groupCount } = useStateContext();
  const deleteGroup = async() => {
    const token = JSON.parse(localStorage.getItem('token') ||'');
    const user_id = JSON.parse(localStorage.getItem('user_id') ||'');
    const url = api.SpecificGroup(user_id, id);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
      })

      const data = await response.json();
      if(data.status == 'SUCCESS'){
        toast.success('Group Deleted Successfully');
      }
      setGroupCount(groupCount - 1);
    } catch (error) {
      
    }
  }

  return (
      <div className={styles.group}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <button onClick={deleteGroup}>Delete Group</button>
      </div>
  )
}

export default Group;