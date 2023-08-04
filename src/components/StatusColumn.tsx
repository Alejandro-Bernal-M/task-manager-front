'use client'
import styles from './statusColumns.module.css'

const StatusColumn = ({ title }: {title:string}) => {
  const handleAddTask = () => {
    console.log('add task');
  }
  return (
    <div className={styles.column}>
      <h2>{title}</h2>
      <button className={styles.addTask} onClick={handleAddTask}>Add Task +</button>
      <div className={styles.tasksColumn}></div>
    </div>
  )
}

export default StatusColumn