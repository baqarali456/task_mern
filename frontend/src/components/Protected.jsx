import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate,useLocation} from "react-router-dom";
import { useOutletContext } from "react-router-dom";





function Protected({children}) {

    const authStatus = useSelector(state=>state.status);

    const {loading} = useOutletContext()

    const [loader,setLoader] = useState(true)
    const navigate = useNavigate()

    const {pathname} = useLocation()

    useEffect(()=>{
        if(authStatus){
          navigate(pathname)
        }
        else {
            navigate('/login')
        }
        setLoader(false)
    },[authStatus,navigate,pathname])

  return (
   !loading && loader?<h1 className=" text-center">Loading ...</h1> : <div>{children}</div>
  )
}

export default Protected