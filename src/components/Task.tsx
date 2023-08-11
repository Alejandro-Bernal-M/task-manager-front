import { useStateContext } from '@/context/StateContext';
import styles from './task.module.css'
import { PiDotsSixVerticalBold } from 'react-icons/pi';
import React, { useEffect, useState } from 'react';
import api from '@/utils/common';
import { toast } from 'react-hot-toast';


type TaskProps = {
  title: string,
  description: string,
  status: string,
  id: string
}

const Task = ({title, description, status, id}: TaskProps) => {
  const { tasks,
          taskCounter,
          setLoggedIn,
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
          idToChange,
          setIdToChange,
          Node,
          setNode
        } = useStateContext();

  const handleDeleteTasks = async() => {
    const tokenString = localStorage.getItem('token');
    if (!tokenString) {
      toast.error('Your session has expired, please login again');
      setLoggedIn(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user_id');
      return;
    }
    let token = JSON.parse(tokenString);
    
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
        console.log('changing' , previousSiblingNode.id)
        setIdToChange(previousSiblingNode.id);
        console.log('idToChange', idToChange)
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
    </div>
  )
}

export default Task