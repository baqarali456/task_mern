import { useDispatch, useSelector } from "react-redux";
import { authLogin } from "../store/slice";
import { useState,useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import axios from "axios";


function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authStatus = useSelector(state=>state.status);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(authStatus){
      navigate("/");
    }
  },[authStatus,dispatch,navigate])

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      return setError("Email and password are required");
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        formData,
        {
            withCredentials:true
        }
      );

      dispatch(authLogin(response.data.data.user));
  

    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="card shadow" style={{ width: "22rem" }}>
        <div className="card-body">
          <h4 className="card-title text-center mb-4">Login</h4>

          {error && (
            <div className="alert alert-danger py-2" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter email"
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

           {/* Signup Link */}
          <p className="text-center mt-3 mb-0">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-decoration-none">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
