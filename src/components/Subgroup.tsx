import styles from './subgroup.module.css'
import api from '@/utils/common';
import { toast } from 'react-hot-toast';
import { useStateContext } from '@/context/StateContext';

const Subgroup = ({id, title, groupId, subGroupColumn, assignationId}:{id: number, title: string, groupId: string, subGroupColumn: boolean, assignationId: number}) => {
  const { setGroupCount,
          groupCount,
          token,
          user } = useStateContext();


  const deleteSubGroup = async (subid:number) => {
    const urlSpecificSubgroup = api.specificSubgroup(user.id, groupId,subid.toString());
      try {
        const response = await fetch(urlSpecificSubgroup, {
          method: 'DELETE',
          headers: {
            'Authorization': token
          }
        })
        const data = await response.json();
        if(data.status == 'SUCCESS'){
          toast.success('Subgroup Deleted Successfully');
          setGroupCount(groupCount + 1);
        }
      } catch (error) {
     
      }
    }

    const handleDeleteAssignation = async(id : number) => {
      try {
        const response = await fetch(api.specificUserGroups(user.id, id ), {
          method: 'DELETE',
          headers: {
            'Authorization': token
          }
        })
        if(response.status == 401){
          localStorage.removeItem('token')
        }
        const data = await response.json()
        if(data.status == 'SUCCESS') toast.success(data.message)
        if(data.status == 'ERROR') toast.error(data.message)
        setGroupCount(groupCount + 1)
      } catch (error) {
        return
      }
    }
  return (
    <div  className={styles.subgroup} >
      <p>{title}</p>
      { subGroupColumn && <button onClick={() => {deleteSubGroup(id)}} className={styles.subGroupBtn}>Delete sub-group</button>}
      {!subGroupColumn && <button onClick={() => {handleDeleteAssignation(assignationId)}} className={styles.deleteAssignation}>Exit the subgroup</button>}
    </div>
  )
};

export default Subgroup;