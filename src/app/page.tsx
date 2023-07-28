import styles from './page.module.css'

export default function Home() {
  return (
      <div className={styles.homeDiv}>
          <h1 className={styles.mainTitle}>Welcome to task manager.</h1>
      </div>
  )
}