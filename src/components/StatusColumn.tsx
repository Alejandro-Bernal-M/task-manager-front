import { type } from 'os';
import styles from './statusColumns.module.css'
import { useStateContext } from '@/context/StateContext'

type StatusColumnProps = {
  title: string,
  status: string,
  setStatus: (status:string) => void
}

const StatusColumn = ({ title, status, setStatus }: StatusColumnProps) => {
  const { setShowPopup } = useStateContext();

  const handleAddTask = () => {
    setStatus(title);
    setShowPopup(true);
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