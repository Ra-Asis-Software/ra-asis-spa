import { useEffect, useState } from 'react'
import styles from './css/Assignments.module.css'
import Title from './Title'
import { getUserDetails } from '../../services/user'
import RoleRestricted from '../ui/RoleRestricted'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

function Assignments({showNav, user}) {
    const[assignments, setAssignments] = useState([])
    const[allAssignments, setAllAssignments] = useState([])
    const[units, setUnits] = useState([])
    const[openAssignment, setOpenAssignment] = useState(false)
    const[currentAssignment, setCurrentAssignment] = useState(null)
    const[content, setContent] = useState([]) //array for holding all assignment content
    const[sectionData, setSectionData] = useState({
        instruction: '',
        question: '',
        answer: ''
    })
    const[showButton, setShowButton] = useState({
        instruction: false,
        question: false,
        answer: false
    })
    const[assignmentUnit, setAssignmentUnit] = useState('')
    const navigate = useNavigate()

    //check if a new assignment is being created
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const newAssignment = params.get('new') ? params.get('new') : false

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
        if(unitId === '') {
            setAssignments(allAssignments)
        } else {
            setAssignments(() => {
                return allAssignments.filter(assignment => assignment.unit === unitId)
            })
        }
    }
    
    //handles adding an instructions section to the assignment
    const handleInstruction = (e) => {
        const input = e.target

        input.style.height = 'auto'
        input.style.height = `${input.scrollHeight}px`
        setSectionData({...sectionData, instruction: input.value})
    }

    const handleAddInstruction = () => {
        const tempArray = [sectionData.instruction, 'instruction']

        setContent(prev => [...prev, tempArray]) // add the instruction to the contents array

        setSectionData({...sectionData, instruction: ''}) //return instruction to empty
        setShowButton({...showButton, instruction: false})// hide the add instruction area
    }

    //handles adding a question section to the assignment
    const handleQuestion = (e) => {
        const input = e.target

        input.style.height = 'auto'
        input.style.height = `${input.scrollHeight}px`
        setSectionData({...sectionData, question: input.value})
    }

    const handleAddQuestion = () => {
        const tempArray = [sectionData.question, 'question', []]

        setContent(prev => [...prev, tempArray]) // add the instruction to the contents array

        setSectionData({...sectionData, question: ''}) //return instruction to empty
        setShowButton({...showButton, question: false})// hide the add instruction area
    }

    //adding an answer to a question
    const handleChangeAnswer = (e) => {
        const input = e.target

        input.style.width = 'auto';
        input.style.height = '4vh'
        input.style.width = `${input.scrollWidth}px`;

        setSectionData({...sectionData, answer: input.value})
    }

    const handleAddAnswer = (index) => {
        let tempArray = [...content]
        tempArray[index][2].push(sectionData.answer)

        setContent(tempArray)

        setSectionData({...sectionData, answer: ''}) //return answer to empty
        setShowButton({...showButton, answer: false})// hide the add answer input
    }

    //make changes to an already added section
    const handleChangeText = (e, index) => {
        const tempArray = content
        tempArray[index][0] = e.target.innerHTML

        setContent(tempArray) //replace-in the new changes
    }

    //replace html elements with their appropriate spaces and breaks
    function stripHTML(html) {
        return html
            .replace(/<br\s*\/?>/gi, "\n") 
            .replace(/<[^>]*>/g, "");  
    }

    return (
        <div className={ `${styles.hero} ${showNav ? '' : styles.marginCollapsed}` }>
        {
            params.get('new') ? 
                <RoleRestricted allowedRoles={['teacher']}>
                    <div className={ styles.assignmentsBox }>
                        <div className={ styles.assignmentsHeader }>
                            <h3>Create New Assignment</h3>
                        </div>
                        <div>
                            <select onChange={(e) => setAssignmentUnit(e.target.value)}>
                                <option value={''}>select unit</option>
                                {
                                    units.map(unit => {
                                        return <option key={unit.id} value={unit.name} >{ unit.name }</option>
                                    })
                                }
                            </select>

                        </div>
                        <div className={ styles.newAssignmentContent }>
                            <div className={ styles.textContent }>
                            <h4>{assignmentUnit}</h4>
                            {
                                content.length === 0 && <p>Use the tools on the left to add content</p>
                            }
                            {
                                content.length > 0 && content.map((item, index) => {
                                    return <>
                                    {
                                        item[1] === 'instruction' ?
                                        <p key={index} className={ `${styles.textInstruction} ${styles.editable}` } contentEditable   suppressContentEditableWarning 
                                        onInput={(e) => handleChangeText(e, index)} >NOTE: { stripHTML(item[0]) }</p>
                                        :
                                        item[1] === 'question' && 
                                        <div className={ styles.questionContainer }>
                                            <p key={index} className={ `${styles.textQuestion} ${styles.editable}` } contentEditable   suppressContentEditableWarning 
                                            onInput={(e) => handleChangeText(e, index)} >{stripHTML(item[0])}</p>

                                            {
                                                item[2].map((ans, index1) => {
                                                    return <p key={index1}>{ans}</p>
                                                })
                                            }

                                            {
                                                showButton.answer === index && 
                                                    <div className={ styles.showAnswer }>
                                                        <input
                                                        className={ styles.answerInput }
                                                        placeholder='Enter answer here'
                                                        type='text'
                                                        onInput={(e) => handleChangeAnswer(e)} />
                                                        <i onClick={() => handleAddAnswer(index)} className={`fa-solid fa-plus ${styles.faPlus}`}></i>
                                                    </div>
                                            }

                                            <button className={ styles.addAnswer } onClick={() => setShowButton({...showButton, answer: index})}>
                                                <i className={`fa-solid fa-plus ${styles.faPlus}`}></i> 
                                                answer
                                            </button>
                                        </div>
                                    }
                                    </>
                                })

                            }

                            {/* display area for adding instruction */}
                            {
                                showButton.instruction === true && 
                                <div style={{ height: 'max-content', display: 'flex', gap: '10px', flexDirection: 'column' }}>

                                    <textarea onChange={(e) => handleInstruction(e)} placeholder='Enter Instruction here...' style={{ fontSize: '1.0rem', padding: '8px', width: '650px', backgroundColor: '#F0F8FF', border: 'none', borderBottom: '1px solid #C0C0C0' }} />

                                    <button  onClick={handleAddInstruction}  style={{ width: 'max-content', height: '5vh', padding: '0 10px' }}>
                                        Add Instruction
                                    </button>
                                </div>
                            }

                            {/* display area for adding a question */}
                            {
                                showButton.question === true && 
                                <div style={{ height: 'max-content', display: 'flex', gap: '10px', flexDirection: 'column' }}>

                                    <textarea onChange={(e) => handleQuestion(e)} placeholder='Enter Question here...' style={{ fontSize: '1.0rem', padding: '8px', width: '650px', backgroundColor: '#F0F8FF', border: 'none', borderBottom: '1px solid #C0C0C0' }} />

                                    <button onClick={handleAddQuestion}  style={{ width: 'max-content', height: '5vh', padding: '0 10px' }}>
                                        ADD Question
                                    </button>
                                </div>
                            }
                            </div>
                        </div>
                    </div>
                </RoleRestricted>
            :  openAssignment === true ?
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
            :
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
                                <button className={ styles.addAssignment } onClick={() => navigate('/dashboard/assignments?new=true')}>
                                        <i className="fa-solid fa-plus"></i>
                                        <p>Create New</p>
                                </button>
                            </RoleRestricted>
                        </div>
                        <div className={ styles.assignmentsBody }>
                            {
                                assignments.map(assignment => {
                                    return <button key={assignment._id} className={ styles.assignment } onClick={() => {setOpenAssignment(true); setCurrentAssignment(assignment)}}>
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
                
        }
            <div className={ styles.extras }>
            {
                params.get('new') && 
                <div className={ styles.tools }>
                    <h3>Tools</h3>
                    <div className={ styles.toolsArea }>
                        <button className={ styles.addAssignment } onClick={() => setShowButton(prev => ({...prev, instruction: true}))}>Instruction</button>

                        <button className={ styles.addAssignment } onClick={() => setShowButton(prev => ({...prev, question: true}))}>Question</button>
                    </div>
                </div>
            }
            </div>
        </div>
    )
}

export default Assignments
