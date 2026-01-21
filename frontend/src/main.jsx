import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter,RouterProvider} from "react-router-dom"
import Dashboard from './pages/Dashboard.jsx'
import { Provider } from 'react-redux'
import {store} from "./store/store.js"
import Protected from './components/Protected.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/SignUp.jsx'
import AddTask from './pages/AddTask.jsx'
import EditTask from './pages/EditTask.jsx'
import FilterTasks from './pages/FilterTasks.jsx'

const router = createBrowserRouter([
  {
    path:"/",
    element:<App/>,
    children:[
      {
        path:"",
        element:<Protected><Dashboard/></Protected>
      },
      {
        path:"login",
        element:<Login/>
      },
      {
        path:"signup",
        element:<Signup/>
      },
      {
        path:"addtask",
        element:<Protected><AddTask/></Protected>
      },
      {
        path:"editTask/:taskId",
        element:<Protected><EditTask/></Protected>
      },
      {
        path:"filterTasks",
        element:<Protected><FilterTasks/></Protected>
      },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>,
)
