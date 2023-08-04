import styles from './taskPopup.module.css'
import { useStateContext } from '@/context/StateContext'

const TaskPopup = ({status}: {status:string}) => {
  const { setShowPopup } = useStateContext();
  return (
    <div className={styles.popup}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <span onClick={() => setShowPopup(false)} className="close">&times;</span>
          <h2>Add Task</h2>
        </div>
        <div className={styles.popupBody}>
          <form>
            <input type="text" placeholder="Task Name" required/>
            <input type="text" placeholder="Task Description" required />
            <select name="status" id="status">
              <option value='To Do'selected={status == 'To Do'? true : false}>To Do</option>
              <option value='In Progress' selected={status == 'In Progress'? true : false}>In Progress</option>
              <option value="Under review" selected={status == "Under review"? true : false}>Under review</option>
              <option value="Done" selected={status == "Done"? true : false}>Done</option>
          </select>
            <button>Add Task</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskPopup;
