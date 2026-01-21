import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Task } from "../models/task.model.js";
import { isValidObjectId } from "mongoose";

const createTaskByUser = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title?.trim() || !description?.trim()) {
        throw new ApiError(400, 'all fields are required')
    }

    const task = await Task.create({
        title,
        description,
        createdBy: req.user._id
    })

    return res
        .status(201)
        .json(
            new ApiResponse(task,
                'task create successfully',
                200)
        )
})

const updateTaskByUser = asyncHandler(async (req, res) => {
    const { title, description, status = 'pending' } = req.body;

    const { taskId } = req.params;

    if (!isValidObjectId(taskId)) {
        throw new ApiError(400, 'taskId is not valid')
    }

    if (!title?.trim() || !description?.trim()) {
        throw new ApiError(400, 'all fields are required')
    }

    const task = await Task.findOne({ _id: taskId })

    if (!task) {
        throw new ApiError(404, 'task not found')
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(401, 'you are not authorize to update the task')

    }

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
            $set: {
                title,
                description,
                status,
            }
        },
        {
            new: true
        }
    )


    return res
        .status(200)
        .json(
            new ApiResponse(updatedTask, 'update task successfully', 200)
        )

})

const deleteTaskByUser = asyncHandler(async (req, res) => {
    const { taskId } = req.params;

    if (!isValidObjectId(taskId)) {
        throw new ApiError(400, 'taskId is not valid')
    }

    const task = await Task.findOne({ _id: taskId })

    if (!task) {
        throw new ApiError(404, 'task not found')
    }

    if (task.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError(401, 'you are not authorize to update the task')

    }

    await Task.deleteOne({ _id: taskId })

    return res
        .status(200)
        .json(
            new ApiResponse(null, 'user delete task  successfully', 200)
        )


})


const getAllTaskOfUser = asyncHandler(async (req, res) => {
    const allTasks = await Task.find({ createdBy: req.user?._id });

    return res
        .status(200)
        .json(
            new ApiResponse(allTasks, 'user get successfully all tasks', 200)
        )

})




export {
    createTaskByUser,
    deleteTaskByUser,
    updateTaskByUser,
    getAllTaskOfUser,
}