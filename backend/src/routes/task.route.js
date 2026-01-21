import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {createTaskByUser,deleteTaskByUser,getAllTaskOfUser,updateTaskByUser} from "../controllers/task.controller.js"

const taskRouter = Router()

taskRouter.use(verifyJWT);

taskRouter.route('/createTask').post(createTaskByUser)
taskRouter.route('/updateTask/:taskId').patch(updateTaskByUser)
taskRouter.route('/deleteTask/:taskId').delete(deleteTaskByUser)
taskRouter.route('/getallTasks').get(getAllTaskOfUser)

export {
    taskRouter
}