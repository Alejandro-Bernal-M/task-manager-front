import { useStateContext } from '@/context/StateContext';
import styles from './task.module.css'
import { PiDotsSixVerticalBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import api from '@/utils/common';
import { toast } from 'react-hot-toast';
import {TiDelete} from 'react-icons/ti'
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
  const { tasks,
          assignedTasks,
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
          allUsers,
          author,
          draggedTask
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

  // useEffect(() => {
  //   const handleSiblingsPositions = (mainNode: HTMLElement): void => {
  //     setPreviousSiblingNode(mainNode.previousElementSibling as HTMLDivElement);
  //     setNextSiblingNode(mainNode.nextElementSibling as HTMLDivElement);
  //     if( previousSiblingNode){
  //       setPreviousSiblingPosition(previousSiblingNode.getBoundingClientRect().top);
  //     }
  
  //     if (nextSiblingNode) {
  //       setNextSiblingPosition(nextSiblingNode.getBoundingClientRect().top);
  //     }
  //   }
    
  //   if (Node) {
  //     handleSiblingsPositions(Node);
  //   }
  // }, [Node, mousePosition, previousSiblingNode, nextSiblingNode,setNextSiblingNode, setPreviousSiblingNode, setPreviousSiblingPosition, setNextSiblingPosition])



  // const handleDrag = (ev: React.DragEvent<HTMLDivElement>): void => {
  //   ev.preventDefault();
  //   if (!previousSiblingNode && !nextSiblingNode){
  //     setIdToChange(id);
  //     return;
  //   }

  //   setMousePosition(ev.clientY);

  //   if (previousSiblingPosition != undefined && mousePosition < previousSiblingPosition) {
  //     if (previousSiblingNode) {
  //       setIdToChange(previousSiblingNode.id);
  //       const [prevNode, currentNode] = [Node, previousSiblingNode];
  //       setPreviousSiblingNode(prevNode);
  //       setNode(currentNode);

  //     }}

  //   if (nextSiblingPosition != undefined  && mousePosition > nextSiblingPosition) {
  //     if (nextSiblingNode) {
  //       setIdToChange(nextSiblingNode.id);
  //       const [nextNode, currentNode] = [Node, nextSiblingNode];
  //       setNextSiblingNode(nextNode);
  //       setNode(currentNode);
  //     }
  //   } 
  // }

  const handleDragStart = (ev: React.DragEvent<HTMLDivElement>): void => {
    console.log('start')
    if(author){ 
      let taskToDrag = tasks.filter(task => task.id === id);
      setDraggedTask(taskToDrag[0]);
      console.log('1')
    }else {
      let taskToDrag = assignedTasks.filter(task => task.id === id);
      setDraggedTask(taskToDrag[0]);
    }
  }

  // const handleDragEnd = (ev: React.DragEvent<HTMLDivElement>): void => {
  //   // (ev.target as HTMLDivElement).setAttribute('draggable', 'false');
  //   setDraggedTask(null);
  // }
  
  // const handleClick = (ev: React.MouseEvent<HTMLDivElement>): void => {
  //   // Prevent drag from the parent div when clicking on the dragIcon
  //   ev.stopPropagation();
  //   setNode((ev.target as HTMLElement));
  // };

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


  // const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
  //   e.stopPropagation();
  //   setNode((e.target as HTMLElement));
  //   console.log(Node)
  //   if(author){ 
  //     let taskToDrag = tasks.filter(task => task.id === id);
  //     setDraggedTask(taskToDrag[0]);
  //   }else {
  //     let taskToDrag = assignedTasks.filter(task => task.id === id);
  //     setDraggedTask(taskToDrag[0]);
  //   }
  //   if(Node) {
  //     console.log()
  //     let heigth = Node.clientHeight.toString()
  //     let width = Node.clientWidth.toString()
  //     Node.style.height = heigth+"px";
  //     Node.style.width = width+"px";
  //     Node.style.position = 'fixed'
  //   }
  // }
  
  // const handleTouchMove = (e:React.TouchEvent) => {
  //   if(Node) {
  //      Node.style.left = (e.changedTouches[0].clientX - Node.clientWidth/2).toString()+"px";
  //      Node.style.top = (e.changedTouches[0].clientY - Node.clientHeight/2).toString()+"px";
  //   }
  // }

  // const handleTouchEnd = () => {
  //   console.log('end')
  //   if(Node){
  //     Node.style.left = '';
  //     Node.style.top = '';
  //     Node.style.height = '';
  //     Node.style.width = '';
  //     Node.style.position = '';
  //     // setNode(null)
  //   }
  // }
    return (
    <Draggable draggableId={id.toString()} index={index}>
      {(provided) =>(

      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={styles.taskCard}
        id= {id}
   
        onDragStart={handleDragStart} 
        // onDragEnd={handleDragEnd} 
        // onDrag={handleDrag}
        // onTouchStart={handleTouchStart}
        // onMouseDown={handleClick}
        // onTouchMove={handleTouchMove}
        // onTouchEnd={handleTouchEnd}
        >
        
        <h3>{title}</h3>
        <p>{description}</p>
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