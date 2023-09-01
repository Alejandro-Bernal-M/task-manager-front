'use client'

import styles from './navigation.module.css'
import { useStateContext } from '@/context/StateContext'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { usePathname,useRouter } from 'next/navigation'

const Navigation = () => {
const { loggedIn, setLoggedIn } = useStateContext();
const pathname = usePathname();
const route = useRouter()
const handleSignOut = () => {
  route.push('/');
  localStorage.removeItem('token');
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
          <li><Link href='/tasks' className={ pathname == '/tasks' ? styles.active : ''}>Tasks</Link></li>
          <li><Link href='/groups' className= {pathname == '/groups' ? styles.active : ' '}>Groups</Link> </li>
          <li><Link href='/profile' className= {pathname == '/profile' ? styles.active : ' '}>Profile</Link> </li>
          <li><button onClick={handleSignOut}>Sign Out</button></li>
          </ul>
        }
    </nav>
  )
}

export default Navigation