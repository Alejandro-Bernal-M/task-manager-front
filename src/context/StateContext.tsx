'use client'
import { useContext, createContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname  } from 'next/navigation'
import api from "@/utils/common";

const context = createContext<ContextType>({} as ContextType);

interface User {
  name: string;
  email: string;
  id: string;
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
  invitationPopup: boolean;
  setInvitationPopup: (invitationPopup: boolean) => void;
  allUsers: User[];
  setAllUsers: (allUsers: User[]) => void;
  invitations: any;
  setInvitations: (invitations: any) => void;
  userInvitation: string;
  setUserInvitation: (userInvitation: string) => void;
  subgroupInvitation: string;
  setSubgroupInvitation: (subgroupInvitation: string) => void;
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
    email: 'test@test.com',
    id: '1'
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
  const [invitationPopup, setInvitationPopup] = useState<boolean>(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [invitations, setInvitations] = useState({received: [], send: []} as any);
  const [userInvitation, setUserInvitation] = useState('');
  const [subgroupInvitation, setSubgroupInvitation] = useState('');

  useEffect(() => {
    const getToken = localStorage.getItem('token');
    if (getToken) {
      setToken(JSON.parse(getToken));
      setLoggedIn(true);
    }
  }, [loggedIn, token]);
  
  useEffect(() => {
    if (!loggedIn) {
      if (pathname !== '/registration' && pathname !== '/') {
        router.push('/');
      }
    }
  }, [loggedIn, pathname, router]);
  
  useEffect(() => {

    const userId = localStorage.getItem('user_id') || '';
    const urlGroups = api.groups(userId);
    const urlUserGroups = api.userGroups(userId);
    const fetchGroups = async () => {
      try{
        const response = await fetch(urlGroups, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        });
        const data = await response.json();
        if(data.status === 'SUCCESS'){
          setGroups(data.data);
        }
    }
    catch(error){
      console.log(error);
    }
  }
  fetchGroups();
  const fetchInvitations = async () => {
    try {
      const response = await fetch(api.invitations(userId), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      const data = await response.json();

      if(data.status === 'SUCCESS'){
        setInvitations(data.data);
      }

    } catch (error) {
      console.log(error)
    }
  }
  fetchInvitations();
  }, [groupCount, token])

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
        setGroupId,
        invitationPopup,
        setInvitationPopup,
        allUsers,
        setAllUsers,
        invitations,
        setInvitations,
        userInvitation,
        setUserInvitation,
        subgroupInvitation,
        setSubgroupInvitation
        }}>
        {children}
    </context.Provider>
  )
}

export const useStateContext = () => useContext(context);