'use client'

import styles from './navigation.module.css'
import { useStateContext } from '@/context/StateContext'
import Link from 'next/link'
import toast from 'react-hot-toast'

const Navigation = () => {
const { loggedIn, setLoggedIn } = useStateContext();
const handleSignOut = () => {
  localStorage.removeItem('token');
  setLoggedIn(false);
  toast.success('Logged out successfully');
};
  return (
    <nav className={styles.navbar}>
      <p><Link href='/'>Task Manager</Link></p>
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