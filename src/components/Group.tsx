import styles from './group.module.css';
import api from '@/utils/common';
import { useStateContext } from '@/context/StateContext';
import { toast } from 'react-hot-toast';
import { Subgroups } from '@/context/StateContext';
import  Subgroup  from '@/components/Subgroup';

const Group = ({title, description, id, subGroups}:{title:string, description:string, id:string, subGroups:Subgroups[]}) => {
  const { setGroupCount, groupCount, setGroupAndSubgroupsPopUp, setGroupPopup, setGroupId, token } = useStateContext();
  const user_id = JSON.parse(localStorage.getItem('user_id') ||'');
  const urlSpecificGroup = api.specificGroup(user_id, id);

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
  
  const createSubGroup = () => {
    setGroupAndSubgroupsPopUp({
      popupTitle: 'Add Subgroup',
      title: 'Subgroup Name',
      description: 'Subgroup Description',
      button: 'Add Subgroup'
    })
    setGroupId(id);
    setGroupPopup(true);
    
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
              <Subgroup key={subgroup.id} id={subgroup.id} title={subgroup.title} groupId={id}  subGroupColumn={true} />
            ))}
          </div>
      </div>
  )
}

export default Group;