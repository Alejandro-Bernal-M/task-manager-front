'use client'

import styles from './navigation.module.css'
import { useStateContext } from '@/context/StateContext'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { usePathname,useRouter } from 'next/navigation'
import { Turn as Hamburger } from 'hamburger-react'
import { useWindowDimentions } from '@/utils/useWindowDimentionsHook'
import { useState } from 'react'

const Navigation = () => {
const { loggedIn } = useStateContext();
const { width } = useWindowDimentions();
const [isOpen, setOpen] = useState(false)
const pathname = usePathname();
const route = useRouter()
const handleSignOut = () => {
  route.push('/');
  localStorage.removeItem('token');
  toast.success('Logged out successfully');
};

  return (
    <nav className={styles.navbar}>
      <p onClick={() => setOpen(false)} ><Link href='/'>Task Manager</Link></p>
      {width < 762 && <Hamburger toggled={isOpen} toggle={setOpen} />} 
      {!loggedIn &&  width > 762 &&
          <ul>
            <li ><Link  href='/registration'>Sign In</Link></li>
          </ul>
          }
        {loggedIn && width > 762 &&
          <ul>
            <li><Link href='/tasks' className={ pathname == '/tasks' ? styles.active : ''}>Tasks</Link></li>
            <li><Link href='/groups' className= {pathname == '/groups' ? styles.active : ' '}>Groups</Link> </li>
            <li><Link href='/profile' className= {pathname == '/profile' ? styles.active : ' '}>Profile</Link> </li>
            <li><button onClick={handleSignOut}>Sign Out</button></li>
          </ul>
        }
        {isOpen && 
          <div className={styles.mobileMenu}>
            {!loggedIn &&
              <ul>
                <li onClick={() => setOpen(false)}><Link href='/registration'>Sign In</Link></li>
              </ul>
            }
            {loggedIn  &&
              <ul>
                <li onClick={() => setOpen(false)}><Link href='/tasks' className={ pathname == '/tasks' ? styles.active : ''}>Tasks</Link></li>
                <li onClick={() => setOpen(false)}><Link href='/groups' className= {pathname == '/groups' ? styles.active : ' '}>Groups</Link> </li>
                <li onClick={() => setOpen(false)}><Link href='/profile' className= {pathname == '/profile' ? styles.active : ' '}>Profile</Link> </li>
                <li onClick={() => setOpen(false)}><button onClick={handleSignOut}>Sign Out</button></li>
              </ul>
            }
          </div>
        }
    </nav>
  )
}

export default Navigation