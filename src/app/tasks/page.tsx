import styles from './tasks.module.css'
import StatusColumn from '@/components/StatusColumn'

const Tasks = () => {
  const statuses = ['To Do', 'In Progress','Under review', 'Done']
    return (
        <div className={styles.container}>
            <div className={styles.tasksContainer}>
              {statuses.map((status, index) => (
                <StatusColumn key={index} title={status} />
              ))}
            </div>
        </div>
    )
}

export default Tasks