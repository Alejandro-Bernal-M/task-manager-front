import { useStateContext } from '@/context/StateContext';
import styles from './task.module.css'
import { PiDotsSixVerticalBold } from 'react-icons/pi';
import React from 'react';

type TaskProps = {
  title: string,
  description: string,
  status: string,
  id: string
}

const Task = ({title, description, status, id}: TaskProps) => {
  const { tasks, setTasks } = useStateContext();

  const handleDeleteTasks = () => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
  }

  const handleDragStart = (ev: React.DragEvent<HTMLDivElement>): void => {
    const id = (ev.target as HTMLDivElement).id;
    ev.dataTransfer.setData("text/plain", status);
    console.log('dragging', status);
    (ev.target as HTMLDivElement).classList.add('dragging');
  }

  const handleDragEnd = (ev: React.DragEvent<HTMLDivElement>): void => {
    console.log('drag end');
    (ev.target as HTMLDivElement).setAttribute('draggable', 'false');
    (ev.target as HTMLDivElement).classList.remove('dragging');
  }

  const handleDragIconClick = (ev: React.MouseEvent<SVGSVGElement>): void => {
    // Prevent drag from the parent div when clicking on the dragIcon
    (ev.target as SVGSVGElement).parentElement!.setAttribute('draggable', 'true');
    ev.stopPropagation();
  };



  return (
    <div className={styles.taskCard}
      id= {id}
      draggable={false}
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd} 
    >
      <PiDotsSixVerticalBold className={styles.dragIcon} onMouseDown={handleDragIconClick} />
      <h3>{title}</h3>
      <p>{description}</p>
      {/* <p>{status}</p> */}
      <button onClick={handleDeleteTasks}>Delete</button>
    </div>
  )
}

export default Task