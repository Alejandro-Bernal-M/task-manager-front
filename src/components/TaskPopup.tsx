import styles from './taskPopup.module.css'
import React from 'react'
import { useStateContext } from '@/context/StateContext'
import { TaskType } from '@/context/StateContext'
import { v4 as uuidv4 } from 'uuid';

type TaskPopupProps = {
  status: string,
  setStatus: (status:string) => void
}

const TaskPopup = ({status, setStatus}: TaskPopupProps) => {
  const { setShowPopup, setTasks, tasks } = useStateContext();
  const handleCreateTask = (e:React.MouseEvent) => {
    e.preventDefault();
    let myuuid = uuidv4();
    console.log(myuuid)
    const newTask: TaskType  = {
      title: (document.getElementById('taskName') as HTMLInputElement).value,
      description: (document.getElementById('taskDescription') as HTMLInputElement).value,
      status: status,
      id: myuuid
    }
    console.log(newTask)
    setTasks(tasks.concat(newTask));
    setShowPopup(false);
  }


  const handleChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value);
  }

  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <span onClick={() => setShowPopup(false)} className="close">&times;</span>
          <h2>Add Task</h2>
        </div>
        <div className={styles.popupBody}>
          <form>
            <input id='taskName' type="text" placeholder="Task Name" required/>
            <input id='taskDescription' type="text" placeholder="Task Description" required />
            <select name="status" id="status" defaultValue={status} onChange={handleChange}>
              <option value='To Do'>To Do</option>
              <option value='In Progress'>In Progress</option>
              <option value="Under review">Under review</option>
              <option value="Done">Done</option>
          </select>
            <button onClick={handleCreateTask}>Add Task</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskPopup;
