import styles from './statusColumns.module.css'
import { TaskType, useStateContext } from '@/context/StateContext'
import Task from './Task'
import api from '@/utils/common'
import { toast } from 'react-hot-toast'

type StatusColumnProps = {
  title: string,
  status: string,
  setStatus: (status:string) => void
}

const StatusColumn = ({ title, status, setStatus }: StatusColumnProps) => {
  const { setShowPopup, tasks, setTasks, draggedTask, idToChange, setIdToChange, setNode, setLoggedIn, subgroupSelect, token} = useStateContext();

  const handleAddTask = () => {
    setStatus(title);
    setShowPopup(true);
  }

  const handleDrop = async(ev: React.DragEvent<HTMLDivElement>) => {
    ev.preventDefault();
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

  const swapTasksPositions =async () => {
    if(idToChange === draggedTask?.id) return;
    if (!draggedTask) return;
    let newTasks = [...tasks];
    let draggedTaskIndex = newTasks.findIndex(task => task.id == draggedTask.id);
    let taskToChangeIndex = newTasks.findIndex(task => task.id == idToChange);
    if(draggedTaskIndex === -1 || taskToChangeIndex === -1) return;
    const newFistOrder = newTasks[taskToChangeIndex].order;
    const newSecondOrder = newTasks[draggedTaskIndex].order;
    newTasks[taskToChangeIndex].order = newSecondOrder;
    newTasks[draggedTaskIndex].order = newFistOrder;
    swapTasksPositionsApi({task1: newTasks[draggedTaskIndex], task2: newTasks[taskToChangeIndex]});
    setTasks(newTasks.sort((a, b) => a.order - b.order));
    setIdToChange('')
  }
  
  const swapTasksPositionsApi = async ({task1, task2} :{task1: TaskType, task2: TaskType}) => {
    const userId = localStorage.getItem('user_id') || '';
    const url1 = api.Task(userId, task1.id);
    const url2 = api.Task(userId, task2.id);

    try {
      const response = await fetch(url1, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          task: {
            order: task1.order
          }
        })
      });
      const data = await response.json();

      if(data.errors) {
        toast.error(data.errors)
      }
    } catch (error) {
      console.log(error);
    }
    try {
      const response = await fetch(url2, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify({
          task: {
            order: task2.order
          }
        })
      });
      const data = await response.json();

    } catch (error) {
      
    }
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
          task.status == title && task.subgroup_id == subgroupSelect && <Task key={index} title={task.title} description={task.description} status={task.status} id={task.id}/>
        ))}
      </div>
    </div>
  )
}

export default StatusColumn