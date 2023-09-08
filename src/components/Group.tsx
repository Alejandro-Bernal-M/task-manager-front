import styles from './group.module.css';
import api from '@/utils/common';
import { useStateContext } from '@/context/StateContext';
import { toast } from 'react-hot-toast';
import { Subgroups } from '@/context/StateContext';
import  Subgroup  from '@/components/Subgroup';
import {RiSave3Fill} from 'react-icons/ri'
import { AiFillEdit } from 'react-icons/ai';
import { useState } from 'react';

const Group = ({title, description, id, subGroups}:{title:string, description:string, id:string, subGroups:Subgroups[]}) => {
  const { setGroupCount,
          groupCount,
          setGroupAndSubgroupsPopUp,
          setGroupPopup,
          setGroupId,
          token,
          user
        } = useStateContext();
  const [edit, setEdit] = useState(false);
  const[newTitle, setNewTitle] = useState(title);
  const[newDescription, setNewDescription] = useState(description);
  const user_id = user.id
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

  const handleEdit = async() => {
    if(newTitle == '' || newDescription == ''){
      toast.error('Please fill all the fields')
      return
    }
    const body = {
      group: {
        title: newTitle,
        description: newDescription
      }
    }
    try {
      const response = await fetch(api.specificGroup(user.id, id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(body)
      });
      
      if (response.status == 200){
        toast.success('Group updated')
      }
      if (response.status == 401 ){
        localStorage.removeItem('token')
      }
      setGroupCount(groupCount + 1);
    } catch (error) {
      return
    }

    setEdit(!edit)
  }
  
  
  return (
      <div className={styles.group}>
        {!edit &&
          <AiFillEdit className={styles.editIcon} onClick={() => {
            setEdit(!edit)
            setNewTitle(title)
            setNewDescription(description)
          }} />
        }
        { edit &&
          <RiSave3Fill className={styles.editIcon}
            onClick={handleEdit}
          />
        }
        {!edit && <h3 className={styles.title}>{title}</h3>}
        {!edit && <p className={styles.description}>{description}</p>}
        {edit &&
          <input
            defaultValue={title}
            className={styles.editTitle}
            onChange={(e) => {
              e.preventDefault();
              setNewTitle(e.target.value)
            }} 
          />
        }
        {edit &&
          <textarea
            defaultValue={description}
              className={styles.editDescription}
              onChange={(e) => {
                e.preventDefault();
                setNewDescription(e.target.value)
              }} 
          />
        }
          
          <button onClick={deleteGroup} className={styles.groupBtn}>Delete Group</button>
          <button onClick={createSubGroup} className={styles.groupBtn}>Create Subroup</button>
          <div className={styles.subGroupsHolder}>
            <h4>Subgroups</h4>
            {subGroups.length == 0 && <p>No Subgroups</p>}
            {subGroups.map((subgroup) => (
              <Subgroup key={subgroup.id} id={subgroup.id} title={subgroup.title} description={subgroup.description} groupId={id}  subGroupColumn={true} assignationId={0} />
            ))}
          </div>
      </div>
  )
}

export default Group;