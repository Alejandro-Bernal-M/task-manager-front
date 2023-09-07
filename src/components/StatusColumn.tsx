import styles from './statusColumns.module.css'
import { TaskType, useStateContext } from '@/context/StateContext'
import Task from './Task'
import api from '@/utils/common'
import { toast } from 'react-hot-toast'
import { Droppable } from 'react-beautiful-dnd'
import { useState, useEffect } from 'react'

type StatusColumnProps = {
  title: string,
  status: string,
  id: number
  setStatus: (status:string) => void
}

const StatusColumn = ({ title, status,id, setStatus }: StatusColumnProps) => {
  const { setShowPopup,
          tasks,
          assignedTasks,
          subgroupSelect,
          author
        } = useStateContext();

  const handleAddTask = () => {
    setStatus(title);
    setShowPopup(true);
  }


  return (
        <div className={styles.column}
        >
          <h2>{title}</h2>
          {author && <button className={styles.addTask} onClick={handleAddTask}>Add Task +</button>}
    <Droppable droppableId={title} >
      {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={styles.tasksColumn}
            id={title}
          >
            { author && tasks?.length > 0 && tasks.map((task, index) => (
              task.status == title  && <Task key={task.id} title={task.title} description={task.description} status={task.status} id={task.id} authorId={task.author_id} assigneds={task.assigneds} index={index}/>
            ))}
            { !author && assignedTasks?.length > 0 &&
             assignedTasks.map((task, index) => (
              task.status == title && task.subgroup_id == subgroupSelect &&  <Task key={task.id} title={task.title} description={task.description} status={task.status} id={task.id} authorId={task.author_id} assigneds={task.assigneds} index={index}/>
            ))}
            {provided.placeholder}
          </div>
          )}
          </Droppable>
        </div>
  )
}

export default StatusColumn