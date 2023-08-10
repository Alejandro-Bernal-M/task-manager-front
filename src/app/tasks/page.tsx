'use client'

import styles from './tasks.module.css'
import StatusColumn from '@/components/StatusColumn'
import TaskPopup from '@/components/TaskPopup'
import { useStateContext } from '@/context/StateContext'
import { useState, useEffect } from 'react'
import api from '@/utils/common'
import { toast } from 'react-hot-toast'

const Tasks = () => {
  const { showPopup, setTasks, setLoggedIn } = useStateContext();
  const [status, setStatus] = useState('' as string)

  let user = localStorage.getItem('user_id')
  if (user == null) user = ''
  const url = api.Tasks(user)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': JSON.parse(localStorage.getItem('token') || '')
          }
        })
        const data = await response.json()
        setTasks(data)
        console.log(data)
      }
      catch(error) {
        toast.error('Your session has expired, please login again');
        setLoggedIn(false);
      }
    }
    fetchData()
  },[])

  const statuses = ['To Do', 'In Progress','Under review', 'Done']
    return (
        <div className={styles.container}>
          {showPopup && <TaskPopup status={status} setStatus={setStatus}/>}
            <div className={styles.tasksContainer}>
              {statuses.map((title, index) => (
                <StatusColumn key={index} title={title} status={status} setStatus={setStatus} />
              ))}
            </div>
        </div>
    )
}

export default Tasks