import { useEffect, useState } from 'react'
import styles from './css/Assignments.module.css'
import Title from './Title'
import { getUserDetails } from '../../services/user'
import RoleRestricted from '../ui/RoleRestricted'

function Assignments({showNav, user}) {
    const[assignments, setAssignments] = useState([])
    const[allAssignments, setAllAssignments] = useState([])
    const[units, setUnits] = useState([])
    const[openAssignment, setOpenAssignment] = useState(false)
    const[currentAssignment, setCurrentAssignment] = useState(null)

    useEffect(() => {
        const fetchData = async() => {
            const myData = await getUserDetails(user.role, user.id)
            
            if(myData.data.message) {
                setAssignments(myData.data.data.assignments)
                setAllAssignments(myData.data.data.assignments)
                setUnits(myData.data.data.units)
            }
        }
        fetchData()
    }, [])

    const handleFilterUnit = (e) => {
        const unitId = e.target.value
        // setAssignments(allAssignments)
        if(unitId === '') {
            setAssignments(allAssignments)
        } else {
            setAssignments(() => {
                return allAssignments.filter(assignment => assignment.unit === unitId)
            })
        }
    }
    console.log(currentAssignment)

    return (
        <div className={ `${styles.hero} ${showNav ? '' : styles.marginCollapsed}` }>
        {
            !openAssignment ? 
                <div className={ `${styles.assignmentsBox}` }>
                    <h3>Assignments</h3>
                    <div className={ styles.assignmentsHeader }>
                        <select onChange={(e) => handleFilterUnit(e)}>
                            <option value={''}>All Units</option>
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
                                return <button className={ styles.assignment } onClick={() => {setOpenAssignment(true); setCurrentAssignment(assignment)}}>
                                    <p>{assignment.title}</p>
                                    <p>{assignment.status}</p>
                                    <p>Due in 2 days</p>
                                </button>
                            })
                        }
                        {
                            assignments.length === 0 && <p>You have no assignments for the unit</p>
                        }
                    </div>

                </div>
            :  
                <div className={ styles.assignmentsBox }>
                    <div className={ styles.assignmentsHeader }>
                        <button className={ styles.addAssignment } onClick={() => {setOpenAssignment(false)}}>
                            <i className="fa-solid fa-left-long"></i>
                            <p>all assignments</p>
                        </button>
                    </div>
                    <div className={ styles.assignmentDetails }>
                        <h3>Assignment: {currentAssignment.title}</h3>
                        <h4>Unit: {'Soen 330'}</h4>
                        <p className={ styles.instruction }>Instructions: This assignment should be done in groups of five. the assignment should be submitted either on a Monday or a Wednesday</p>
                    </div>
                    <RoleRestricted allowedRoles={['teacher']}>
                        <button className={ styles.addAssignment }>EDIT ASSIGNMENT</button>
                    </RoleRestricted>
                </div>
        }
            <div className={ styles.extras }>

            </div>
        </div>
    )
}

export default Assignments
