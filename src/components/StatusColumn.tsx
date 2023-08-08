import styles from './statusColumns.module.css'
import { useStateContext } from '@/context/StateContext'
import Task from './Task'

type StatusColumnProps = {
  title: string,
  status: string,
  setStatus: (status:string) => void
}

const StatusColumn = ({ title, status, setStatus }: StatusColumnProps) => {
  const { setShowPopup, tasks, setTasks, draggedTask } = useStateContext();

  const handleAddTask = () => {
    setStatus(title);
    setShowPopup(true);
  }

  const handleDrop = (ev: React.DragEvent<HTMLDivElement>): void => {
    ev.preventDefault();
  }
  
  const changeDraggedTaskStatus = () => {
    let newTasks = tasks.map(task => {
      if (task.id === draggedTask?.id) {
        task.status = title;
      }
      return task;
    })
    setTasks(newTasks);
  }

  const handleDragOver = (ev: React.DragEvent<HTMLDivElement>): void => {
    ev.preventDefault();
    changeDraggedTaskStatus();
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