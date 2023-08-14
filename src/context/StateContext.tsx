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
  tasks: TaskType[];
  setTasks: (tasks: TaskType[]) => void; 
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  token: string;
  setToken: (token: string) => void;
  showPopup: boolean;
  setShowPopup: (showPopup: boolean) => void;
  draggedTask: TaskType | null;
  setDraggedTask: (draggedTask: TaskType | null) => void;
  mousePosition: number;
  setMousePosition: (mousePosition: number) => void;
  previousSiblingNode: HTMLElement | null;
  setPreviousSiblingNode: (previousSiblingNode: HTMLElement | null) => void;
  nextSiblingNode: HTMLElement | null;
  setNextSiblingNode: (nextSiblingNode: HTMLElement | null) => void;
  previousSiblingPosition: number | undefined;
  setPreviousSiblingPosition: (previousSiblingPosition: number | undefined) => void;
  nextSiblingPosition: number | undefined;
  setNextSiblingPosition: (nextSiblingPosition: number | undefined) => void;
  idToChange: string;
  setIdToChange: (idToChange: string) => void;
  Node: HTMLElement | null;
  setNode: (Node: HTMLElement | null) => void;
  taskCounter: number;
  setTaskCounter: (taskCounter: number) => void;
  groups: GroupType[];
  setGroups: (groups: GroupType[]) => void;
};

export type TaskType = {
  title: string;
  description: string;
  status: string;
  id: string;
  order: number;
};

type GroupType = {
  title: string;
  author_id: string;
  description: string;
  id: string;
}

export const StateContext = ({ children }: { children: ReactNode }  ) => {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User>({
    name: 'John Doe',
    email: 'test@test.com'
  });
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [draggedTask, setDraggedTask] = useState<TaskType | null>(null);
  const [mousePosition, setMousePosition] = useState<number>(0);
  const [previousSiblingNode, setPreviousSiblingNode] = useState<HTMLElement | null>(null);
  const [nextSiblingNode, setNextSiblingNode] = useState<HTMLElement | null>(null);
  const [previousSiblingPosition, setPreviousSiblingPosition] = useState<number | undefined>(0);
  const [nextSiblingPosition, setNextSiblingPosition] = useState<number | undefined>(0);
  const [idToChange, setIdToChange] = useState<string>('');
  const [Node, setNode] = useState<HTMLElement | null>(null);
  const [taskCounter, setTaskCounter] = useState<number>(0);
  const [groups, setGroups] = useState<GroupType[]>([]);

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
        setToken,
        showPopup,
        setShowPopup,
        draggedTask,
        setDraggedTask,
        mousePosition,
        setMousePosition,
        previousSiblingNode,
        setPreviousSiblingNode,
        nextSiblingNode,
        setNextSiblingNode,
        previousSiblingPosition,
        setPreviousSiblingPosition,
        nextSiblingPosition,
        setNextSiblingPosition,
        idToChange,
        setIdToChange,
        Node,
        setNode,
        taskCounter,
        setTaskCounter,
        groups,
        setGroups
        }}>
        {children}
    </context.Provider>
  )
}

export const useStateContext = () => useContext(context);