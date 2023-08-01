'use client'
import { useContext, createContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname  } from 'next/navigation'

const context = createContext<ContextType>({} as ContextType);

interface User {
  name: string;
  email: string;
}

type ContextType = {
  user: User;
  setUser: (user: User) => void;
  tasks: string[]
  setTasks: (tasks: string[]) => void; 
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  token: string;
  setToken: (token: string) => void;
};

export const StateContext = ({ children }: { children: ReactNode }  ) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User>({
    name: 'John Doe',
    email: 'test@test.com'
  });
  const [tasks, setTasks] = useState<string[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setToken(token);
      setLoggedIn(true);
    }
  }, [loggedIn]);

  useEffect(() => {
    if (!loggedIn) {
      if (pathname !== '/registration' && pathname !== '/') {
        router.push('/');
      }
    }
  }, [loggedIn, pathname, router]);

  return (
    <context.Provider
      value={{
        user,
        setUser,
        tasks,
        setTasks,
        loggedIn,
        setLoggedIn,
        token,
        setToken
        }}>
        {children}
    </context.Provider>
  )
}

export const useStateContext = () => useContext(context);