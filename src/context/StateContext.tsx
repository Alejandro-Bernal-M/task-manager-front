'use client'
import { useContext, createContext, useState, ReactNode } from "react";

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
};

export const StateContext = ({ children }: { children: ReactNode }  ) => {
  const [user, setUser] = useState<User>({
    name: 'John Doe',
    email: 'test@test.com'
  });
  const [tasks, setTasks] = useState<string[]>([]);

  return (
    <context.Provider
      value={{
        user,
        setUser,
        tasks,
        setTasks
        }}>
        {children}
    </context.Provider>
  )
}

export const useStateContext = () => useContext(context);