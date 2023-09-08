import styles from './subgroup.module.css'
import api from '@/utils/common';
import { toast } from 'react-hot-toast';
import { useStateContext } from '@/context/StateContext';
import { useState } from 'react';
import {RiSave3Fill} from 'react-icons/ri'
import { AiFillEdit } from 'react-icons/ai';

const Subgroup = ({id, title, description, groupId, subGroupColumn, assignationId}:{id: number, title: string, description:string, groupId: string, subGroupColumn: boolean, assignationId: number}) => {
  const { setGroupCount,
          groupCount,
          token,
          user } = useStateContext();

          const [edit, setEdit] = useState(false);
          const[newTitle, setNewTitle] = useState(title);
          const[newDescription, setNewDescription] = useState(description);

  const deleteSubGroup = async (subid:number) => {
    const urlSpecificSubgroup = api.specificSubgroup(user.id, groupId,subid.toString());
      try {
        const response = await fetch(urlSpecificSubgroup, {
          method: 'DELETE',
          headers: {
            'Authorization': token
          }
        })
        const data = await response.json();
        if(data.status == 'SUCCESS'){
          toast.success('Subgroup Deleted Successfully');
          setGroupCount(groupCount + 1);
        }
      } catch (error) {
     
      }
    }

    const handleDeleteAssignation = async(id : number) => {
      try {
        const response = await fetch(api.specificUserGroups(user.id, id ), {
          method: 'DELETE',
          headers: {
            'Authorization': token
          }
        })
        if(response.status == 401){
          localStorage.removeItem('token')
        }
        const data = await response.json()
        if(data.status == 'SUCCESS') toast.success(data.message)
        if(data.status == 'ERROR') toast.error(data.message)
        setGroupCount(groupCount + 1)
      } catch (error) {
        return
      }
    }

    const handleEdit = async(subid:number) => {
      const urlSpecificSubgroup = api.specificSubgroup(user.id, groupId,subid.toString());
      if(newTitle == ''){
        toast.error('Please fill all the fields')
        return
      }
      const body = {
        subgroup: {
          title: newTitle,
          description: newDescription
        }
      }
      try {
        const response = await fetch(urlSpecificSubgroup, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify(body)
        });
        
        if (response.status == 200){
          toast.success('Subgroup updated')
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
    <div  className={styles.subgroup} >
           {subGroupColumn && !edit &&
          <AiFillEdit className={styles.editIcon} onClick={() => {
            setEdit(!edit)
            setNewTitle(title)
            }}
          />
        }
        {subGroupColumn && edit &&
          <RiSave3Fill className={styles.editIcon}
            onClick={() => {handleEdit(id)}}
          />
        }
        {!edit && <h4>{title}</h4>}
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
      
      { subGroupColumn && <button onClick={() => {deleteSubGroup(id)}} className={styles.subGroupBtn}>Delete sub-group</button>}
      {!subGroupColumn && <button onClick={() => {handleDeleteAssignation(assignationId)}} className={styles.deleteAssignation}>Exit the subgroup</button>}
    </div>
  )
};

export default Subgroup;