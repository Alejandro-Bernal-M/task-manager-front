import { useStateContext } from '@/context/StateContext';

type TaskProps = {
  title: string,
  description: string,
  status: string,
  id: string
}

const Task = ({title, description, status, id}: TaskProps) => {
  const { tasks, setTasks } = useStateContext();

  const handleDeleteTasks = () => {
    const newTasks = tasks.filter(task => task.id !== id);
    setTasks(newTasks);
  }

  return (
    <div  className={title}>
      <h3>{title}</h3>
      <p>{description}</p>
      <p>{status}</p>
      <p>{id}</p>
      <p>test</p>
      <button onClick={handleDeleteTasks}>delete task</button>
    </div>
  )
}

export default Task