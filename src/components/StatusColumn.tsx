import styles from './statusColumns.module.css'
import { useStateContext } from '@/context/StateContext'
import Task from './Task'

type StatusColumnProps = {
  title: string,
  status: string,
  setStatus: (status:string) => void
}

const StatusColumn = ({ title, status, setStatus }: StatusColumnProps) => {
  const { setShowPopup, tasks, setTasks, draggedTask, idToChange } = useStateContext();

  const handleAddTask = () => {
    setStatus(title);
    setShowPopup(true);
  }

  const handleDrop = (ev: React.DragEvent<HTMLDivElement>): void => {
    ev.preventDefault();
  }
  
  const changeDraggedTaskStatus = () => {
    let newTasks = tasks.map((task, index) => {
      if (task.id === draggedTask?.id) {
        const index = tasks.indexOf(task);
        const indexToChange = tasks.findIndex(task => task.id === idToChange);
        console.log('to change', indexToChange);
        task.status = title;
      }
      return task;
    })
    setTasks(newTasks);
  }

  const swapTasksPositions = () => {
    let newTasks = [...tasks];
    let draggedTaskIndex = newTasks.findIndex(task => task.id === draggedTask?.id);
    let taskToChangeIndex = newTasks.findIndex(task => task.id === idToChange);
    if(draggedTaskIndex === -1 || taskToChangeIndex === -1) return;
    [newTasks[draggedTaskIndex], newTasks[taskToChangeIndex]] = [newTasks[taskToChangeIndex], newTasks[draggedTaskIndex]];
    setTasks(newTasks);
  }


  const handleDragOver = (ev: React.DragEvent<HTMLDivElement>): void => {
    ev.preventDefault();
    changeDraggedTaskStatus();
    swapTasksPositions();
  }

  return (
    <div className={styles.column}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <h2>{title}</h2>
      <button className={styles.addTask} onClick={handleAddTask}>Add Task +</button>
      <div className={styles.tasksColumn} id={title}>
        { tasks.length > 0 && tasks.map((task, index) => (
          task.status == title && <Task key={index} title={task.title} description={task.description} status={task.status} id={task.id}/>
        ))}
      </div>
    </div>
  )
}

export default StatusColumn