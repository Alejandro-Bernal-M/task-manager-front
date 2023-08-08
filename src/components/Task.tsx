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
  const { tasks, setTasks, setDraggedTask, mousePosition, setMousePosition, previousSiblingPosition,nextSiblingPosition, setPreviousSiblingPosition, setNextSiblingPosition, setIdToChange } = useStateContext();

  const handleDeleteTasks = () => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
  }

  const handleDrag = (ev: React.DragEvent<HTMLDivElement>): void => {
    setMousePosition(ev.clientY);
    let previousSiblingNode = (ev.target as HTMLDivElement).previousSibling as HTMLDivElement | null;;
    let nextSiblingNode = (ev.target as HTMLDivElement).nextSibling as HTMLDivElement | null;;

    setPreviousSiblingPosition(previousSiblingNode?.getBoundingClientRect().top);
    setNextSiblingPosition(nextSiblingNode?.getBoundingClientRect().top);
    if (previousSiblingPosition && mousePosition < previousSiblingPosition) {
      console.log('mouse is above previous sibling');
      if (previousSiblingNode) {
        setIdToChange(previousSiblingNode?.id);
      }
    } else if (nextSiblingPosition && mousePosition > nextSiblingPosition) {
      console.log('mouse is below next sibling');
      if (nextSiblingNode) {
        setIdToChange(nextSiblingNode?.id);
      }
    } else {
      console.log('mouse is between siblings');
    }
    console.log('prev', previousSiblingPosition);
    console.log('mouse', mousePosition);
    console.log('next', nextSiblingPosition);
    console.log('prev node', previousSiblingNode);
    console.log('next node', nextSiblingNode);
  }

  const handleDragStart = (ev: React.DragEvent<HTMLDivElement>): void => {
    (ev.target as HTMLDivElement).classList.add('dragging')
    let taskToDrag = tasks.filter(task => task.id === id);
    setDraggedTask(taskToDrag[0]);
  }

  const handleDragEnd = (ev: React.DragEvent<HTMLDivElement>): void => {
    (ev.target as HTMLDivElement).setAttribute('draggable', 'false');
    (ev.target as HTMLDivElement).classList.remove('dragging');
    setDraggedTask(null);
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
      onDrag={handleDrag}
    >
      <PiDotsSixVerticalBold className={styles.dragIcon} onMouseDown={handleDragIconClick} />
      <h3>{title}</h3>
      <p>{description}</p>
      <button onClick={handleDeleteTasks}>Delete</button>
    </div>
  )
}

export default Task