import styles from './subgroup.module.css'
import api from '@/utils/common';
import { toast } from 'react-hot-toast';
import { useStateContext } from '@/context/StateContext';

const Subgroup = ({id, title, groupId, subGroupColumn}:{id: number, title: string, groupId: string, subGroupColumn: boolean}) => {
  const { setGroupCount, groupCount } = useStateContext();

  const token = JSON.parse(localStorage.getItem('token') ||'');
  const user_id = JSON.parse(localStorage.getItem('user_id') ||'');

  const deleteSubGroup = async (subid:number) => {
    const urlSpecificSubgroup = api.specificSubgroup(user_id, groupId,subid.toString());
      try {
        const response = await fetch(urlSpecificSubgroup, {
          method: 'DELETE',
          headers: {
            'Authorization': token
          }
        })
        const data = await response.json();
        console.log('deleted', data)
        if(data.status == 'SUCCESS'){
          toast.success('Subgroup Deleted Successfully');
          setGroupCount(groupCount + 1);
        }
      } catch (error) {
     
      }
    }
  return (
    <div  className={styles.subgroup} >
      <p>{title}</p>
      { subGroupColumn && <button onClick={() => {deleteSubGroup(id)}} className={styles.subGroupBtn}>Delete sub-group</button>}
    </div>
  )
};

export default Subgroup;