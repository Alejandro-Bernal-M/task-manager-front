'use client'

import styles from './tasks.module.css'
import StatusColumn from '@/components/StatusColumn'
import TaskPopup from '@/components/TaskPopup'
import { useStateContext } from '@/context/StateContext'
import { useState, useEffect } from 'react'
import api from '@/utils/common'
import { usePathname } from 'next/navigation'

const Tasks = () => {
  const { showPopup,
          setTasks,
          setAssignedTasks,
          subgroupSelect,
          setLoggedIn,
          taskCounter,
          token,
          groups,
          filteredSubgroup,
          setSubgroupSelect,
          setFilteredSubgroup,
          user,
          setSubgroupUsers,
          userGroups,
          author,
          setAuthor
        } = useStateContext();

  const [status, setStatus] = useState('' as string);
  const pathname = usePathname();
  const [groupSelect, setGroupSelect] = useState('');
  const [assignedSubgroup, setAssignedSubgroup] = useState('');
 

  const url = api.Tasks(user.id)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url,{
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        })
        const data = await response.json()
        setTasks(data.authored)
        setAssignedTasks(data.assigned)
      }
      catch(error) {
        console.log('hello error')
      }
    }
    fetchData()
  },[taskCounter, pathname, setLoggedIn, setTasks, url, token, setAssignedTasks])


  const handleGroupSelect = (e:React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setGroupSelect(e.target.value)
  }

  const handleSubgroupSelect = (e:React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setSubgroupSelect(e.target.value)
  }

  const handleAssignedSubgroupSelect = (e:React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setSubgroupSelect(e.target.value)
    if(e.target.value == ''){
      setAssignedSubgroup('No subgroup selected')
      return
    }
    let subgroup = userGroups.filter(sub => sub.id == e.target.value)
    setAssignedSubgroup(subgroup[0].title)
  }

  useEffect(()=>{
    const handleSubgroupName = () => {
      if(+subgroupSelect == 0) setFilteredSubgroup('No subgroup selected')
     groups.forEach(group => group.subgroups.forEach(sub => {
      if(sub.id == +subgroupSelect){
        setFilteredSubgroup(sub.title)
      }
     }))
    }
     handleSubgroupName();
  },[groups, subgroupSelect, setFilteredSubgroup])

  useEffect(() => {
    const fetSubgroup = async() => {
      try {
        if (groupSelect=='' || subgroupSelect == '') return
        const response = await fetch(api.specificSubgroup(user.id, groupSelect, subgroupSelect), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          }
        })
        const data = await response.json();
        setSubgroupUsers(data.data)
      } catch (error) {
        
      }
    }
    fetSubgroup()
  },[groupSelect, subgroupSelect, token, user, setSubgroupUsers])
  

  const statuses = ['To Do', 'In Progress','Under review', 'Done']
    return (
        <div className={styles.container}>
          <div className={styles.authorOrNotDiv}>
            <h3>See the tasks:</h3>
            <div>
              <button className={author ? styles.active : ''} onClick={()=> setAuthor(true)}>Authored by you</button>
              <button className={!author ? styles.active : ''} onClick={()=> setAuthor(false)}>Assigned to you</button>
            </div>
          </div>
          { !author &&
            <div className={styles.options}>
              <h2>You are seeing the tasks assigned to you for the subgroup: {assignedSubgroup}</h2>
              <select className={styles.select} onChange={handleAssignedSubgroupSelect}>
                <option value='' >Select the subgroup</option>
                {userGroups.map(subgroup => <option key={subgroup.id} value={subgroup.id}>{subgroup.title}</option>)}
              </select>
            </div>

          }
          {author &&
          <div className={styles.options}>
            <h2>You are seeing the tasks for the subgroup: {filteredSubgroup}</h2>
             <div>
              <select  className={styles.select} name='groups' onChange={handleGroupSelect}>
              <option value=''>Select the group</option>
                {groups.map((group:any) => (
                  <option key={group.group.id} value={group.group.id}>{group.group.title}</option>
                  ))}
              </select>
              <select className={styles.select} name='subgroup' onChange={handleSubgroupSelect}>
                <option value={0}>Select the subgroup</option>
                  {groups.map((group:any) => {
                    if(group.group.id == groupSelect){
                      return(
                        group.subgroups.length > 0 ? group.subgroups.map((subgroup: any) =><option key={subgroup.id} value={subgroup.id}>{subgroup.title}</option>): <option value={0}>No subgroups</option>
                        )
                      }
                    })}
              </select>
            </div>
          </div>
          }
          {showPopup && <TaskPopup status={status} setStatus={setStatus}/>}
            <div className={styles.tasksContainer}>
              {statuses.map((title, index) => (
                <StatusColumn key={index} title={title} status={status} setStatus={setStatus} />
              ))}
            </div>
        </div>
    )
}

export default Tasks