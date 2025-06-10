import React, { useEffect, useState } from 'react'
import styles from '../css/TeacherMain.module.css'
import { getUserDetails } from '../../../services/user'
import Title from '../Title'
import UnitCard from '../UnitCard'
import AssignmentCard from '../AssignmentCard'

function TeacherMain({showNav, profile}) {
    const[assignments, setAssignments] = useState([])
    const[units, setUnits] = useState([])

    useEffect(() => {
        const fetchData = async() => {
            const teacherData = await getUserDetails(profile.role, profile.id)
            
            console.log(teacherData)
            if(teacherData.data.message) {
                // setAssignments(teacherData.data.data.assignments)
            }
        }
        fetchData()
    }, [])

    return (
        <div className={ `${styles.hero} ${showNav ? '' : styles.marginCollapsed}` }>
            <Title />
            <div className={ styles.assignmentsOverview }>
            {
                units.length === 0 ? 
                <div className={ styles.noUnits }>
                    <h4>NO UNITS</h4>
                    <div className={ styles.message }>
                        <p>You don't have any units assigned to you</p>
                        <p>The admin is yet to assign them to you</p>
                    </div>
                </div> : 
                <div className={ styles.unitsBox }>
                    <h4>Assignments</h4>
                    <div className={ styles.units }>
                        {
                            assignments.map(assignment => {
                                return <AssignmentCard />
                            })
                        }
                    </div>
                </div>
            }
            </div>
        </div>
    )
}

export default TeacherMain
