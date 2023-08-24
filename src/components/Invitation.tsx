import styles from './invitation.module.css'

const Invitation = ({send, subgroup, name, email, status}: {send: boolean, subgroup:string, name: string, email:string, status:string}) => {
    return (
        <div className={styles.invitation}>
           <p>Invited to: {subgroup}</p>
            <p>{send ? 'Invited': 'Invited by'}</p>
            <p>Name: {name}</p>
            <p>Email: {email}</p>
            {!send && <div className={styles.buttonsHolder}>
                <button>Accept</button>
                <button>Reject</button>
            </div>}
            {send && <p>Status: {status}</p>}
            {send && <button>Cancel</button>}
        </div>
    )
}

export default Invitation