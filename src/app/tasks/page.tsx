'use client'

import styles from './tasks.module.css'
import StatusColumn from '@/components/StatusColumn'
import TaskPopup from '@/components/TaskPopup'
import { useStateContext } from '@/context/StateContext'
import { useState, useEffect } from 'react'
import api from '@/utils/common'
import { usePathname } from 'next/navigation'

const Tasks = () => {
  const { showPopup, setTasks,subgroupSelect, setLoggedIn, taskCounter, token, groups, filteredSubgroup, setSubgroupSelect, setFilteredSubgroup } = useStateContext();
  const [status, setStatus] = useState('' as string)
  const pathname = usePathname()
  const [groupSelect, setGroupSelect] = useState('')
 

  let user = localStorage.getItem('user_id')
  if (user == null) user = ''
  const url = api.Tasks(user)

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
        if(data.error == 'Unauthorized'){
          localStorage.removeItem('token');
          setLoggedIn(false);
        }
        setTasks(data)
      }
      catch(error) {
        console.log('hello error')
        localStorage.removeItem('token');
        setLoggedIn(false);
      }
    }
    fetchData()
  },[taskCounter, pathname, setLoggedIn, setTasks, url, token])


  const handleGroupSelect = (e:React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setGroupSelect(e.target.value)
  }

  const handleSubgroupSelect = (e:React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setSubgroupSelect(e.target.value)
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
  

  const statuses = ['To Do', 'In Progress','Under review', 'Done']
    return (
        <div className={styles.container}>
          <div className={styles.options}>
            <h2>You are seeing the tasks for the subgroup: {filteredSubgroup}</h2>
            <div>
              <select name='groups' onChange={handleGroupSelect}>
              <option value=''>Select the group</option>
                {groups.map((group:any) => (
                  <option key={group.group.id} value={group.group.id}>{group.group.title}</option>
                  ))}
              </select>
              <select name='subgroup' onChange={handleSubgroupSelect}>
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