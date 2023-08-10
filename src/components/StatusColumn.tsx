import styles from './statusColumns.module.css'
import { useStateContext } from '@/context/StateContext'
import Task from './Task'
import api from '@/utils/common'
import { toast } from 'react-hot-toast'

type StatusColumnProps = {
  title: string,
  status: string,
  setStatus: (status:string) => void
}

const StatusColumn = ({ title, status, setStatus }: StatusColumnProps) => {
  const { setShowPopup, tasks, setTasks, draggedTask, idToChange, setIdToChange, setNode, setLoggedIn } = useStateContext();

  const handleAddTask = () => {
    setStatus(title);
    setShowPopup(true);
  }

  const handleDrop = async(ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
    const tokenString = localStorage.getItem('token');
    if (!tokenString) {
      toast.error('Your session has expired, please login again');
      setLoggedIn(false);
      return;
    }
    let token = JSON.parse(tokenString);
    
    const userId = localStorage.getItem('user_id') || '';
    if (!draggedTask) return;
    const url = api.Task(userId, draggedTask?.id);

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          task: {
            status: title
          }
        })
      })

      const data = await response.json();
      if(data.errors) {
        toast.error(data.errors)
      }
      
    } catch (error) {
      console.log(error);
    }
    setNode(null);
  }
  
  const changeDraggedTaskStatus = () => {
    let newTasks = tasks.map((task) => {
      if (task.id === draggedTask?.id) {
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
    setIdToChange('')
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