import styles from './group.module.css';
import api from '@/utils/common';
import { useStateContext } from '@/context/StateContext';
import { toast } from 'react-hot-toast';
import { Subgroup } from '@/context/StateContext';

const Group = ({title, description, id, subGroups}:{title:string, description:string, id:string, subGroups:Subgroup[]}) => {
  const { setGroupCount, groupCount } = useStateContext();
  const token = JSON.parse(localStorage.getItem('token') ||'');
  const user_id = JSON.parse(localStorage.getItem('user_id') ||'');
  const urlSpecificGroup = api.specificGroup(user_id, id);
  const urlSubgroups = api.subGroups(user_id, id);
  const deleteGroup = async() => {
    try {
      const response = await fetch(urlSpecificGroup, {
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
  
  const createSubGroup = async() => {
    try {
      const response = await fetch(urlSubgroups, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          title: 'New Subgroup',
          description: 'New Subgroup Description',
          group_id: id,
        })
      })
      const data = await response.json();
      if(data.status == 'SUCCESS'){
        toast.success('Subgroup Created Successfully');
        setGroupCount(groupCount + 1);
      }
    } catch (error) {
      
    }
  }

  const deleteSubGroup = async (subid:number) => {
  const urlSpecificSubgroup = api.specificSubgroup(user_id, id,subid.toString());
    try {
      const response = await fetch(urlSpecificSubgroup, {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
      })
      const data = await response.json();
      console.log('deleted', data)
      if(data.status == 'SUCCESS'){
        toast.success('Subgroup Deleted Successfully');
        setGroupCount(groupCount + 1);
      }
    } catch (error) {
   
    }
  }
  
  return (
      <div className={styles.group}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <button onClick={deleteGroup} className={styles.groupBtn}>Delete Group</button>
          <button onClick={createSubGroup} className={styles.groupBtn}>Create Subroup</button>
          <div className={styles.subGroupsHolder}>
            <h4>Subgroups</h4>
            {subGroups.length == 0 && <p>No Subgroups</p>}
            {subGroups.map((subgroup) => (
              <div key={subgroup.id} className={styles.subgroup} >
                <p>{subgroup.title}</p>
                <button onClick={() => {deleteSubGroup(subgroup.id)}} className={styles.subGroupBtn}>Delete sub-group</button>
              </div>
            ))}
          </div>
      </div>
  )
}

export default Group;