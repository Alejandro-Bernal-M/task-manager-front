import styles from './invitationPopup.module.css'
import { useStateContext } from '@/context/StateContext';

const InvitationPopup = () => {
  const { invitationPopup, setInvitationPopup } = useStateContext();
  return (
    <div className={styles.invitationPopup}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <span onClick={() => setInvitationPopup(false)} className="close">&times;</span>
          <h2>Invitation</h2>
        </div>
        <div className={styles.popupBody}>
          <form>
            <button>Send</button>
          </form>
        </div>

      </div>
    </div>
  )
}

export default InvitationPopup;