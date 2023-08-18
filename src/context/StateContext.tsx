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
  groups: GroupWithSubgroups[];
  setGroups: (groups: GroupWithSubgroups[]) => void;
  groupCount: number;
  setGroupCount: (groupCount: number) => void;
  userGroups: UserGroup[];
  setUserGroups: (userGroups: UserGroup[]) => void;
  groupAndSubgroupsPopUp: GroupAndSubgroupsPopUp;
  setGroupAndSubgroupsPopUp: (groupAndSubgroupsPopUp: GroupAndSubgroupsPopUp) => void;
  groupPopup: boolean;
  setGroupPopup: (groupPopup: boolean) => void;
  groupId: string;
  setGroupId: (groupId: string) => void;
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

export interface Subgroups {
  id: number;
  title: string;
}

interface GroupWithSubgroups {
  group: GroupType;
  subgroups: Subgroups[];
}

type UserGroup =  {
  user_id: string;
  subgroup_id: string;
  title: string;
}

type GroupAndSubgroupsPopUp = {
  popupTitle: string;
  title: string;
  description: string;
  button: string;
} | null;

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
  const [groups, setGroups] = useState<GroupWithSubgroups[]>([]);
  const [groupCount, setGroupCount] = useState(0);
  const [userGroups, setUserGroups] = useState<UserGroup[]>([]);
  const [groupAndSubgroupsPopUp, setGroupAndSubgroupsPopUp] = useState<GroupAndSubgroupsPopUp>(null);
  const [groupPopup, setGroupPopup] = useState<boolean>(false);
  const [groupId, setGroupId] = useState<string>('');

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
        setGroups,
        groupCount,
        setGroupCount,
        userGroups,
        setUserGroups,
        groupAndSubgroupsPopUp,
        setGroupAndSubgroupsPopUp,
        groupPopup,
        setGroupPopup,
        groupId,
        setGroupId
        }}>
        {children}
    </context.Provider>
  )
}

export const useStateContext = () => useContext(context);