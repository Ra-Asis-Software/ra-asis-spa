import { useEffect, useState } from 'react'
import styles from './css/ViewAssignment.module.css'
import Title from './Title'
import { getUserDetails } from '../../services/user'
import RoleRestricted from '../ui/RoleRestricted'

function ViewAssignment({showNav, user}) {
    const[assignments, setAssignments] = useState([])
    const[units, setUnits] = useState([])

    useEffect(() => {
        const fetchData = async() => {
            const myData = await getUserDetails(user.role, user.id)
            
            if(myData.data.message) {
                setAssignments(myData.data.data.assignments)
                setUnits(myData.data.data.units)
            }
        }
        fetchData()
    }, [])
    console.log(assignments)

    return (
        <div className={ `${styles.hero} ${showNav ? '' : styles.marginCollapsed}` }>
            <div className={ styles.assignmentsBox }>
                <h3>Assignments</h3>
                <div className={ styles.assignmentsHeader }>
                    <select>
                        <option value={''}>Filter By Unit</option>
                        {
                            units.map(unit => {
                                //change backend response to populate unit names
                                return <option key={unit.id} value={unit.id}>{unit.name}</option>
                            })
                        }
                    </select>

                    <RoleRestricted allowedRoles={['teacher']}>
                        <button className={ styles.addAssignment }>
                                <i className="fa-solid fa-plus"></i>
                                <p>Create New</p>
                        </button>
                    </RoleRestricted>
                </div>
                <div className={ styles.assignmentsBody }>
                    {
                        assignments.map(assignment => {
                            return <button className={ styles.assignment }>
                                <p>{assignment.title}</p>
                                <p>{assignment.status}</p>
                                <p>Due in 2 days</p>
                            </button>
                        })
                    }
                    {
                        assignments.length === 0 && <p>You have no assignments</p>
                    }
                </div>

            </div>
            <div className={ styles.extras }>

            </div>
        </div>
    )
}

export default ViewAssignment
