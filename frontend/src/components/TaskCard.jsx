import axios from 'axios'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { handleTasks } from '../store/slice'

function TaskCard(
    {
        _id,
        title,
        description,
        status,
    }
) {


  const tasks = useSelector(state=>state.tasks)

  const dispatch = useDispatch();

  const handleDeleteTask = async() =>{
    console.log('delete')
    try {
      await axios.delete(`http://localhost:8000/api/v1/task/deleteTask/${_id}`,{withCredentials:true})

      dispatch(handleTasks(tasks.filter(task=>task._id !== _id)))
    } catch (error) {
      console.log(error)
    }
  }

  return (
   <div class="card" style={{width: "18rem;"}}>
  <div class="card-body">
    <h5 class="card-title">{title}</h5>
    <p class="card-text"> Status - {status}</p>
    <p class="card-text">{description}</p>
    <Link to={`editTask/${_id}`} class="btn btn-primary">Update Task</Link>
    <button onClick={handleDeleteTask} className="btn btn-sm mx-2 btn-outline-danger">
          Delete
        </button>
  </div>
</div>
  )
}

export default TaskCard