import { useStateContext } from '@/context/StateContext';
import styles from './task.module.css'
import { PiDotsSixVerticalBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import api from '@/utils/common';
import { toast } from 'react-hot-toast';
import {TiDelete} from 'react-icons/ti'

type TaskProps = {
  title: string,
  description: string,
  status: string,
  id: string,
  authorId: string,
  assigneds: []
}

const Task = ({title, description, status, id, authorId, assigneds}: TaskProps) => {
  const { tasks,
          taskCounter,
          setTaskCounter,
          setDraggedTask,
          mousePosition,
          setMousePosition,
          previousSiblingNode,
          nextSiblingNode,
          setPreviousSiblingNode,
          setNextSiblingNode,
          previousSiblingPosition,
          nextSiblingPosition,
          setPreviousSiblingPosition,
          setNextSiblingPosition,
          setIdToChange,
          Node,
          setNode,
          user,
          token,
          subgroupUsers,
          allUsers
        } = useStateContext();
  const[showSubgroupUsers, setShowSubgroupUsers] = useState(false);
  const[assignedUser, setAssignedUser] = useState('');

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

  useEffect(() => {
    const handleSiblingsPositions = (mainNode: HTMLElement): void => {
      setPreviousSiblingNode(mainNode.previousElementSibling as HTMLDivElement);
      setNextSiblingNode(mainNode.nextElementSibling as HTMLDivElement);
      if( previousSiblingNode){
        setPreviousSiblingPosition(previousSiblingNode.getBoundingClientRect().top);
      }
  
      if (nextSiblingNode) {
        setNextSiblingPosition(nextSiblingNode.getBoundingClientRect().top);
      }
    }
    
    if (Node) {
      handleSiblingsPositions(Node);
    }
  }, [Node, mousePosition, previousSiblingNode, nextSiblingNode,setNextSiblingNode, setPreviousSiblingNode, setPreviousSiblingPosition, setNextSiblingPosition])



  const handleDrag = (ev: React.DragEvent<HTMLDivElement>): void => {
    ev.preventDefault();
    if (!previousSiblingNode && !nextSiblingNode){
      setIdToChange(id);
      return;
    }

    setMousePosition(ev.clientY);

    if (previousSiblingPosition != undefined && mousePosition < previousSiblingPosition) {
      if (previousSiblingNode) {
        setIdToChange(previousSiblingNode.id);
        const [prevNode, currentNode] = [Node, previousSiblingNode];
        setPreviousSiblingNode(prevNode);
        setNode(currentNode);

      }}

    if (nextSiblingPosition != undefined  && mousePosition > nextSiblingPosition) {
      if (nextSiblingNode) {
        setIdToChange(nextSiblingNode.id);
        const [nextNode, currentNode] = [Node, nextSiblingNode];
        setNextSiblingNode(nextNode);
        setNode(currentNode);
      }
    } 
  }

  const handleDragStart = (ev: React.DragEvent<HTMLDivElement>): void => {
    let taskToDrag = tasks.filter(task => task.id === id);
    setDraggedTask(taskToDrag[0]);
  }

  const handleDragEnd = (ev: React.DragEvent<HTMLDivElement>): void => {
    (ev.target as HTMLDivElement).setAttribute('draggable', 'false');
    setDraggedTask(null);
  }
  
  const handleDragIconClick = (ev: React.MouseEvent<SVGSVGElement>): void => {
    // Prevent drag from the parent div when clicking on the dragIcon
    (ev.target as SVGSVGElement).parentElement!.setAttribute('draggable', 'true');
    ev.stopPropagation();
    setNode((ev.target as SVGSVGElement).parentElement);
  };

  const handleAssignedUser = (e:React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setAssignedUser(e.target.value)
    console.log(assignedUser)
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
  
  console.log(allUsers)
  return (
    <div className={styles.taskCard}
      id= {id}
      draggable={false}
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd} 
      onDrag={handleDrag}
    >
      <PiDotsSixVerticalBold
        className={styles.dragIcon}
        onMouseDown={handleDragIconClick}
      />
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={handleDeleteTasks}>Delete</button>
      <div className={styles.assignDiv}>
        {authorId == user.id && <button onClick={() => setShowSubgroupUsers(!showSubgroupUsers)}>Assign task</button>}
        <div>
          <p>assigneds: </p>
          {assigneds.map((assigned:any) => {
              let user = allUsers.filter((user) => user.id == assigned.user_id)[0]
              console.log('uuu', user)
              return <p key={user.id}>{user.email} <TiDelete/></p>
            })}
        </div>
      </div>
      {showSubgroupUsers &&
        <div>
          {subgroupUsers.users.length == 0 ? <p>You must invited to someone to this subgroup first</p>:  <p>Select the user:</p>}
          {subgroupUsers.users.length > 0  &&
            <select onChange={handleAssignedUser}>
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
  )
}

export default Task