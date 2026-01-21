import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { useEffectEvent } from "react"
import { handleFilterTasks, handleTasks } from "../store/slice"

function Navbar() {

  const authStatus = useSelector(state=>state.status)

  const tasks = useSelector(state=>state.tasks);
  
  const navItems = [
    {
      path:"/",
      name:"Dashboard",
      active:authStatus,
    },
    {
      path:"/login",
      name:"Login",
      active:!authStatus,
    },
    {
      path:"/signup",
      name:"Signup",
      active:!authStatus,
    },
    {
      path:"/addtask",
      name:"AddTask",
      active:authStatus,
    },
  ]
  
  const [search,setSearch] = useState('');

  const navigate = useNavigate()

  const dispatch = useDispatch()

  const handleLogout = async() =>{
    try {
      await axios.post('http://localhost:8000/api/v1/user/logout',{},{withCredentials:true})
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }

  
  useEffect(()=>{

    let id;
    if(search){
       id = setTimeout(()=>{
        
        const filterTaskByTitle = tasks.filter(task=>task.title.toLowerCase().includes(search.toLowerCase()));

        dispatch(handleFilterTasks(filterTaskByTitle));

        navigate('/filterTasks')
        
        
       },500)

    }
    else {
      navigate('/')
    }
    




     return ()=>clearTimeout(id)

  },[search,navigate,dispatch])

  return (
   <nav className="navbar navbar-expand-lg bg-light">
  <div className="container-fluid">
    <a className="navbar-brand" href="#">Navbar</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        {
          navItems.map(item=>(
            item.active &&  <li key={item.name} className="nav-item">
          <Link className="nav-link active" aria-current="page" to={item.path}>{item.name}</Link>
        </li>
          ))
        }
       
      </ul>
      <div className=" d-flex gap-3">
        {
          authStatus && <button onClick={handleLogout} className=" btn btn-danger mx-1 ">Logout</button>
        }
        <input value={search}
         onChange={(e)=>setSearch(e.target.value)} className="form-control me-2" type="search task by title" placeholder="Search" aria-label="Search"/>

      </div>
      
    </div>
  </div>
</nav>
  )
}

export default Navbar