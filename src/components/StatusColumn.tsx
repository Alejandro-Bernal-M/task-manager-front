import styles from './statusColumns.module.css'


const StatusColumn = ({ title }: {title:string}) => {
  return (
    <div className={styles.column}>
      <h2>{title}</h2>
      <div className={styles.tasksColumn}></div>
    </div>
  )
}

export default StatusColumn