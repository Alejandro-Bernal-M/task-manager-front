'use client'
import { useContext, createContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname  } from 'next/navigation'
import api from "@/utils/common";
import { toast } from "react-hot-toast";

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
  assignedTasks: TaskType[];
  setAssignedTasks: (tasks: TaskType[]) => void; 
  loggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
  token: string;
  setToken: (token: string) => void;
  showPopup: boolean;
  setShowPopup: (showPopup: boolean) => void;
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
  subgroupSelect: string;
  setSubgroupSelect: (subgroupSelect: string) => void;
  filteredSubgroup: string;
  setFilteredSubgroup: (filteredSubgroup: string) => void;
  subgroupUsers: {subgroup: {}, users: any[]};
  setSubgroupUsers: (subgroupUsers: {subgroup: {}, users: []}) => void;
  author: boolean;
  setAuthor: (author:boolean) => void;
};

export type TaskType = {
  title: string;
  description: string;
  status: string;
  id: string;
  order: number;
  subgroup_id: string;
  author_id: string;
  assigneds: [];
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
  subgroup:{
    user_id: string;
    subgroup_id: string;
    title: string;
    id: string;
  },
  assignation_id: number
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
  const [assignedTasks, setAssignedTasks] = useState<TaskType[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [token, setToken] = useState<string>('');
  const [showPopup, setShowPopup] = useState<boolean>(false);
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
  const [subgroupSelect, setSubgroupSelect] = useState('')
  const [filteredSubgroup, setFilteredSubgroup] = useState('');
  const [subgroupUsers, setSubgroupUsers] = useState({subgroup: {}, users: []});
  const [author, setAuthor] = useState(true);

  useEffect(() => {
    const getToken = localStorage.getItem('token');
    if (getToken) {
      setToken(JSON.parse(getToken));
      setLoggedIn(true);
    }else {
      setLoggedIn(false);
      setToken('')
    }
  }, [loggedIn, token, pathname]);
  
  useEffect(() => {
    if(token != ''){
      if (!loggedIn) {
        if (pathname !== '/registration' && pathname !== '/') {

          router.push('/');
          toast.error('Your session has expired, please login again');
          console.log('here')
        }
      }
    }
  }, [loggedIn, pathname, router]);
  
  useEffect(() => {

    const urlGroups = api.groups(user.id);
    const fetchGroups = async () => {
      try{
        const response = await fetch(urlGroups, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        });
        if (response.status == 401){
          localStorage.removeItem('token')
          setLoggedIn(false)
          toast.error('Your session has expired, please log in again')
          return
        }
        const data = await response.json();
        if(data.status === 'SUCCESS'){
          setGroups(data.data);
        }
    }
    catch(error){
      console.log(error);
    }
  }
  
  const fetchUserGroups = async () => {
    const urlUserGroups = api.userGroups(user.id);
    try {
      const response = await fetch(urlUserGroups, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        }
      });
      const data = await response.json();
      if (response.status == 401){
        return
      }
      if(data.status === 'SUCCESS'){
        setUserGroups(data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  
  
  const fetchInvitations = async () => {
    try {
      const response = await fetch(api.invitations(user.id), {
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
      
      if (response.status == 401){
        localStorage.removeItem('token')
        return
      }
    } catch (error) {
      console.log(error)
    }
  }
  if(token != ''){
    fetchUserGroups();
    fetchGroups();
    fetchInvitations();
  }

  }, [groupCount, token, user])

  useEffect(()=> {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch(api.users, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        })
        const data = await response.json();

        if(data.status === 'SUCCESS'){
          setAllUsers(data.data);
        }

      } catch (error) {
        console.log(error)
      }
    }
    if(token != ''){
      fetchAllUsers();
    }

  },[setAllUsers, token])

  useEffect(() => {
    const userId = user.id;
    const urlUser = api.user(userId);
      const fetchUser = async () => {
        try{
          const response = await fetch(urlUser, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            }
          });
          const data = await response.json();
  
          if(data.status === 'SUCCESS'){
            setUser(data.data);
          }
        }
        catch(error){
          console.log(error)
        }
      }
      if(token != ''){
        fetchUser();
      }
      
    }, [ token]);

  return (
    <context.Provider
      value={{
        user,
        setUser,
        tasks,
        setTasks,
        assignedTasks,
        setAssignedTasks,
        loggedIn,
        setLoggedIn,
        token,
        setToken,
        showPopup,
        setShowPopup,
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
        setSubgroupInvitation,
        subgroupSelect,
        setSubgroupSelect,
        filteredSubgroup,
        setFilteredSubgroup,
        subgroupUsers,
        setSubgroupUsers,
        author,
        setAuthor
        }}>
        {children}
    </context.Provider>
  )
}

export const useStateContext = () => useContext(context);