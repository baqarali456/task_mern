import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function EditTask() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const tasks = useSelector((state) => state.tasks) || [];

  const task = tasks.find((ele) => ele._id === taskId);

  const [formData, setFormData] = useState({
    title: task.title || "",
    description: task.description || "",
    status: task.status || "",
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `http://localhost:8000/api/v1/task/updateTask/${taskId}`,
        formData,
        { withCredentials: true },
      );
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h4 className="card-title text-center mb-4">Edit Task</h4>

              <form onSubmit={handleUpdate}>
                {/* Title */}
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                {/* Description */}
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Enter task description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Status */}
                <div className="mb-4">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {/* Buttons */}
                <div className="d-flex justify-content-between">
                  <button type="submit" className="btn btn-primary">
                    Update Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTask;
