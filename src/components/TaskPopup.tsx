import styles from './taskPopup.module.css'
import React from 'react'
import { useStateContext } from '@/context/StateContext'
import { toast } from 'react-hot-toast';
import api from '@/utils/common';

type TaskPopupProps = {
  status: string,
  setStatus: (status:string) => void
}

const TaskPopup = ({status, setStatus}: TaskPopupProps) => {
  const { setShowPopup,loggedIn, setLoggedIn, taskCounter, setTaskCounter, filteredSubgroup, subgroupSelect, user  } = useStateContext();

  const handleCreateTask = async(e:React.MouseEvent) => {
    e.preventDefault();
    if(filteredSubgroup == 'No subgroup selected'){
      toast.error('You should select a subgroup first')
      setShowPopup(false)
      return
    }
    const title = (document.getElementById('taskName') as HTMLInputElement).value;
    const description = (document.getElementById('taskDescription') as HTMLInputElement).value;
    if (title === '' || description === '') {
      toast.error('Please fill in all fields');
      return;
    }
    const newTask  = {
      task:{
        title: title,
        description: description,
        status: status,
        author_id: user.id,
        order: 0,
        subgroup_id: subgroupSelect
      }
    }

    const token = JSON.parse(localStorage.getItem('token') || '');
    const url = api.Tasks(user.id);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json',
          'Authorization' : token
        },
        body: JSON.stringify(newTask)
      })
      const data = await response.json();
      setTaskCounter(taskCounter + 1);
      if(data.error){
        toast.error('Your session has expired, please login again');
        localStorage.removeItem('token');
        setLoggedIn(false);
      }else {
        toast.success('Task created successfully');
      }
    } catch (error) {
      console.log(error);
    }

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
          <h2>Add Task for {filteredSubgroup}</h2>
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
