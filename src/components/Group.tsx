import styles from './group.module.css';
import api from '@/utils/common';
import { useStateContext } from '@/context/StateContext';
import { toast } from 'react-hot-toast';
import { Subgroup } from '@/context/StateContext';

const Group = ({title, description, id, subGroups}:{title:string, description:string, id:string, subGroups:Subgroup[]}) => {
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

  console.log(subGroups)
  return (
      <div className={styles.group}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <button onClick={deleteGroup}>Delete Group</button>
          <div>
            <h4>Subgroups</h4>
            {subGroups.length == 0 && <p>No Subgroups</p>}
            {subGroups.map((subgroup) => (
              <div key={subgroup.id}>
                <p>{subgroup.title}</p>
              </div>
            ))}
          </div>
      </div>
  )
}

export default Group;