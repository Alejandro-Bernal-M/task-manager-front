'use client'

import styles from './tasks.module.css'
import StatusColumn from '@/components/StatusColumn'
import TaskPopup from '@/components/TaskPopup'
import { useStateContext } from '@/context/StateContext'
import { useState, useEffect } from 'react'
import api from '@/utils/common'
import { usePathname } from 'next/navigation'
import { DragDropContext } from 'react-beautiful-dnd';
import { TaskType } from '@/context/StateContext'
import { toast } from 'react-hot-toast'

const Tasks = () => {
  const { showPopup,
          setTasks,
          setAssignedTasks,
          subgroupSelect,
          setLoggedIn,
          taskCounter,
          setTaskCounter,
          token,
          groups,
          filteredSubgroup,
          setSubgroupSelect,
          setFilteredSubgroup,
          user,
          setSubgroupUsers,
          userGroups,
          author,
          setAuthor,
          tasks,
          assignedTasks
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
        if(response.status == 401){
          localStorage.removeItem('token')
        }
        const data = await response.json()
        setTasks(data.authored.filter((task:any) => task.subgroup_id == subgroupSelect))
        setAssignedTasks(data.assigned.filter((task:any)  => task.subgroup_id == subgroupSelect))
      }
      catch(error) {
        console.log('hello error')
      }
    }
    if(token != ''){
      fetchData()
    }
  
  
  },[taskCounter, pathname, setLoggedIn, setTasks, url, token, setAssignedTasks, subgroupSelect])


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
    let subgroup = userGroups.filter(sub => sub.subgroup.id == e.target.value)
    setAssignedSubgroup(subgroup[0].subgroup.title)
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
        if (groupSelect=='' || subgroupSelect == '' || subgroupSelect == '0') return
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


  const handleDragEnd = (start:any) => {
    if(!start.destination) return


    const changeStatus= () => {
      if(author){
        let newTasks = tasks.map((task) => {
        if (task.id == start.draggableId) {
          task.status = start.destination.droppableId;
        }
        return task;
        })
        setTasks(newTasks);
    }else {
      let newTasks = assignedTasks.map((task) => {
        if (task.id == start.draggableId) {
          task.status = start.destination.droppableId;
        }
        return task;
        })
        setAssignedTasks(newTasks)
    }
    const updateApiStatus = async() => {
      const url = api.Task(user.id, start.draggableId);
  
      try {
        const response = await fetch(url, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            task: {
              status: start.destination.droppableId
            }
          })
        })
  
        const data = await response.json();
        if(data.errors) {
          toast.error(data.errors)
        }
  
      } catch (error) {
        console.log(error);
      }
    }
    updateApiStatus();
    }

    if(start.source.droppableId != start.destination.droppableId){
      changeStatus();
    }
    
    const updateOrder = async ({task} :{task: TaskType}) => {
      let url1= ''
      if(author){
        url1 = api.Task(user.id, task.id);
      }else {
        url1 = api.Task(task.author_id, task.id);
      }
      
      try {
        const response = await fetch(url1, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token
          },
          body: JSON.stringify({
            task: {
              order: task.order
            }
          })
        });
        const data = await response.json();
        if(data.errors) {
          toast.error(data.errors)
        }
      } catch (error) {
        console.log(error);
        return
      }
      setTaskCounter(taskCounter + 1)
    }

    const sourceIndex = start.source.index;
    const destIndex = start.destination.index;
    
    // Create a copy of the tasks array
    let newTasks= author? [...tasks] : [...assignedTasks]
    
    // Swap the order values of the tasks at source and destination indices
    const sourceTask = newTasks[sourceIndex];
    
    // Sort the tasks based on their updated order values
    newTasks.splice(sourceIndex, 1)
    newTasks.splice(destIndex, 0, sourceTask)
    
    
    let order = 0;
    newTasks.map((task : TaskType) => {
      if(task.order != order){
        task.order = order;
        order ++;
        updateOrder({task: task});
      }else {
        order ++;
      }
  
    })

    if (author) {
      setTasks(newTasks);
    } else {
      setAssignedTasks(newTasks);
    }
    
  }
  
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
                {userGroups.map(subgroup => <option key={subgroup.subgroup.id} value={subgroup.subgroup.id}>{subgroup.subgroup.title}</option>)}
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
          <DragDropContext onDragEnd={handleDragEnd} >

            <div className={styles.tasksContainer}>
              {statuses.map((title, index) => (
                        <StatusColumn key={index} id={index} title={title} status={status} setStatus={setStatus} />

                ))}
            </div>
            </DragDropContext>
        </div>
    )
}

export default Tasks