'use client'

import styles from './tasks.module.css'
import StatusColumn from '@/components/StatusColumn'
import TaskPopup from '@/components/TaskPopup'
import { useStateContext } from '@/context/StateContext'
import { useState } from 'react'

const Tasks = () => {
  const { showPopup } = useStateContext();
  const [status, setStatus] = useState('' as string)

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