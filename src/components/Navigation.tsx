'use client'

import styles from './navigation.module.css'
import { useStateContext } from '@/context/StateContext'
import Link from 'next/link'

const Navigation = () => {
const { loggedIn, setLoggedIn } = useStateContext();
const handleSignOut = () => {
  localStorage.removeItem('token');
  setLoggedIn(false);
};
  return (
    <nav className={styles.navbar}>
      <p>Task Manager</p>
      {!loggedIn && 
        <ul>
          <li><Link href='/registration'>Sign In</Link></li>
        </ul>
          }
        {loggedIn &&
        <ul>
          <li>Task</li>
          <li>Groups</li>
          <li>Profile</li>
          <li><button onClick={handleSignOut}>Sign Out</button></li>
          </ul>
        }
    </nav>
  )
}

export default Navigation