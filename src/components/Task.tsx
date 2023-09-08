import { useStateContext } from '@/context/StateContext';
import styles from './task.module.css'
import { AiFillEdit } from 'react-icons/ai';
import React, { useEffect, useState } from 'react';
import api from '@/utils/common';
import { toast } from 'react-hot-toast';
import {TiDelete} from 'react-icons/ti'
import {RiSave3Fill} from 'react-icons/ri'
import { Draggable } from 'react-beautiful-dnd';

type TaskProps = {
  title: string,
  description: string,
  status: string,
  id: string,
  index: number,
  authorId: string,
  assigneds: []
}

const Task = ({title, description, status, id, authorId, assigneds, index}: TaskProps) => {
  const {
          taskCounter,
          setTaskCounter,
          tasks,
          setTasks,
          user,
          token,
          subgroupUsers,
          allUsers,
          author,
        } = useStateContext();
  const[showSubgroupUsers, setShowSubgroupUsers] = useState(false);
  const[assignedUser, setAssignedUser] = useState('');
  const[edit, setEdit] = useState(false);
  const[newTitle, setNewTitle] = useState(title);
  const[newDescription, setNewDescription] = useState(description);

  const handleDeleteTasks = async() => {
    
    const userId = localStorage.getItem('user_id') || '';
    const url = api.Task(userId, id);

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
      })
      const data = await response.json();
      setTaskCounter(taskCounter - 1);
      if(data.error) {
        toast.error(data.error);
        return;
      }
      toast.success('Task deleted successfully');
    } catch (error) {
      console.log(error);
    }
  }

  const handleAssignedUser = (e:React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setAssignedUser(e.target.value)
  }

  const handleAssignation = async() => {
    if(assignedUser == '') return
    try {
      const response = await fetch (api.assignments(assignedUser), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          assignment: {
            user_id: assignedUser,
            task_id: id
          }
        })
      })
      const data = await response.json()
      if(data.status == 'SUCCESS') toast.success(data.message)
      if(data.status == 'ERROR') toast.error(data.message)
      setTaskCounter(taskCounter + 1)
    } catch (error) {
      console.log(error)
    }
  }
  
  const handleDeleteAssignation = async(assigned_id: number) => {
    try {
      const response = await fetch(api.specificAssignment(user.id, assigned_id), {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
      });

      const data = await response.json();
      if(data.status == 'SUCCESS') toast.success(data.message)
      if(data.status == 'ERROR') toast.error(data.message)
      setTaskCounter(taskCounter + 1)

    } catch (error) {
      console.log(error)
    }
  }
  
  const handleEdit = async() => {

    if(newTitle == '' || newDescription == ''){
      toast.error('Please fill all the fields')
      return
    }
    const body = {
      task: {
        title: newTitle,
        description: newDescription
      }
    }
    try {
      const response = await fetch(api.Task(user.id, id), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();

      const task = await data;
      const newTasks = [...tasks]
      newTasks[task.order] = task;
      setTasks(newTasks);
      if (response.status == 200){
        toast.success('Task updated')
      }
      if (response.status == 401 ){
        localStorage.removeItem('token')
      }
    } catch (error) {
      return
    }
    setEdit(!edit)

  }
    return (
    <Draggable draggableId={id.toString()} index={index}>
      {(provided) =>(

      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={styles.taskCard}
        id= {id}
        >
        {author && !edit &&
          <AiFillEdit className={styles.editIcon} onClick={() => {setEdit(!edit)}} />
        }
        {author && edit &&
          <RiSave3Fill className={styles.editIcon}
            onClick={handleEdit}
          />
        }
        {!edit && <h3>{title}</h3>}
        {!edit && <p>{description}</p>}
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
        <button onClick={handleDeleteTasks}>Delete</button>
        <div className={styles.assignDiv}>
          {authorId == user.id && <button onClick={() => setShowSubgroupUsers(!showSubgroupUsers)}>Assign menu</button>}
          <div>
            <p>assigned: </p>
            {assigneds.map((assigned:any) => {
              let user = allUsers.filter((user) => user.id == assigned.user_id)[0]
              return <p key={user.id} className={styles.assingn}> {user.email} {author && <TiDelete onClick={() => handleDeleteAssignation(assigned.id)} className={styles.deleteAssing} />}</p>
            })}
          </div>
        </div>
        {showSubgroupUsers &&
          <div className={styles.assignMenu}>
            {subgroupUsers.users.length == 0 ? <h4>You must invite someone to this subgroup first</h4>:  <h4>Select the user:</h4>}
            {subgroupUsers.users.length > 0  &&
              <select className={styles.assingSelect} onChange={handleAssignedUser}>
                <option value=''>User&apos;s emails</option>
              {subgroupUsers.users.map((user) => (
                <option key={user.id} value={user.id}>{user.email}</option>
                ))}
            </select>}
            {assignedUser != '' && 
              <button onClick={handleAssignation}>
                Assign {subgroupUsers.users.map(user => {
                  if(user.id == assignedUser){
                    return user.email
                  }
                })}
              </button>}
          </div>
        }
      </div>
      )}
    </Draggable>
  )
}

export default Task