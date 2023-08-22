import styles from './profile.module.css'
import { toast } from 'react-hot-toast';
import api from '@/utils/common';
import { useStateContext } from '@/context/StateContext';

const Profile = () =>{
    return(
        <div className={styles.container}>
            <h1>Profile</h1>
        </div>
    )
}

export default Profile;