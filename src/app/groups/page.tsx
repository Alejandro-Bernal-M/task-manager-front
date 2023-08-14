'use client'

import styles from './groups.module.css';
import { toast } from 'react-hot-toast';

const handleAddGroup = () => {
  toast.success('Group added successfully');
}

const Groups = () => {
  return (
    <div className={styles.container}>
      <div className={styles.mainHolder}>
        <div className={styles.groupHolder}>
          <h2>Groups Created by you</h2>
          <hr />
          <button className={styles.addGroup} onClick={handleAddGroup}>Add Group +</button>
        </div>
        <div className={styles.groupHolder}>
          <h2>Sub-groups where you are in</h2>
          <hr />
        </div>
      </div>
    </div>
  );
};

export default Groups;