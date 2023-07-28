import styles from './navigation.module.css'

const Navigation = () => {
  return (
    <header className={styles.header}>
      <nav className={styles.navbar}>
        <p>Task Manager</p>
        <ul>
          <li>Task</li>
          <li>Groups</li>
          <li>Profile</li>
        </ul>
      </nav>
    </header>
  )
}

export default Navigation