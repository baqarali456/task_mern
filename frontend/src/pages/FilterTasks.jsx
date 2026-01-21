import { useSelector } from 'react-redux'
import TaskCard from '../components/TaskCard';

function FilterTasks() {

    const tasks = useSelector(state=>state.filterTasks);
    console.log(tasks)

  return (
  <div className="container mt-4">
    <div className="row">
      <div className="col">
        <h3 className="mb-4 text-center">Filtered Tasks</h3>
      </div>
    </div>

    {tasks && tasks.length > 0 ? (
      <div className="row">
        {tasks.map((task) => (
          <div className="col-md-4 mb-4" key={task._id}>
            <TaskCard {...task} />
          </div>
        ))}
      </div>
    ) : (
      <div className="row">
        <div className="col text-center">
          <div className="alert alert-info">
            No tasks found for the selected filter
          </div>
        </div>
      </div>
    )}
  </div>
);

}

export default FilterTasks