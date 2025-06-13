import styles from './css/ViewAssignment.module.css'

function ViewAssignment({showNav}) {
    return (
        <div className={ `${styles.hero} ${showNav ? '' : styles.marginCollapsed}` }>
            Jimmmy
        </div>
    )
}

export default ViewAssignment
