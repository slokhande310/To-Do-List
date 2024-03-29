const express = require('express');
const router = express.Router();

const auth = require('../Middleware/authentication');
const Task = require('../Models/TaskSchema');

router.get('/', auth, (req, res) => {
    res.json({ message: 'Hey from Tasks Route', user: req.user })
});

// Create TASK
router.post('/createtask', auth, async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and Description is required to create a task' });
        }

        const task = new Task({
            ...req.body,
            owner: req.user._id
        });

        await task.save();
        res.status(201).json({ message: 'Task saved successfully', task });


    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Fetch TASKS
router.get('/fetchtask', auth, async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments({ owner: req.user._id });

        // Find tasks where owner id == provided id, with pagination
        const tasks = await Task.find({ owner: req.user._id })
            .sort({
                completed: 1, // Ascending order for completed tasks (false first)
                createdAt: -1, // Descending order for creation time
            });

        // If no tasks available
        if (tasks.length === 0) {
            return res.status(404).json({ message: 'No tasks available' });
        }

        // If tasks available, display them
        res.status(200).json({ tasks, totalTasks });
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Fetch TASKS by ID
router.get('/fetchtask/:id', auth, async (req, res) => {
    // get task id from url using params
    const taskId = req.params.id;
    try {
        // find task by ID and owner
        const task = await Task.findOne({
            _id: taskId,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ task });

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update TASKS
router.patch('/updatetask/:id', auth, async (req, res) => {
    const taskid = req.params.id;       // gets task id from url
    const updates = Object.keys(req.body);  // gets updates from body
    const allowedUpdates = ['title', 'description', 'completed'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' });
    }

    try {
        // find task by ID and owner
        const task = await Task.findOne({
            _id: taskid,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        updates.forEach((update) => task[update] = req.body[update]);
        await task.save();
        res.status(200).json({ task, message: 'Task updated successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

// Delete TASKS
router.delete('/deletetask/:id', auth, async (req, res) => {
    const taskid = req.params.id;       // gets task id from url
    try {
        const task = await Task.findOneAndDelete({
            _id: taskid,
            owner: req.user._id
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ task, message: 'Task deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// delete completed tasks
router.delete('/deletecompleted', auth, async (req, res) => {
    try {
        const tasksToDelete = await Task.find({
            completed: true,
            owner: req.user._id
        });

        if (!tasksToDelete || tasksToDelete.length === 0) {
            return res.status(404).json({ error: 'No completed tasks found' });
        }

        // Use deleteMany to delete all matching tasks
        const deleteResult = await Task.deleteMany({
            completed: true,
            owner: req.user._id
        });

        if (deleteResult.deletedCount === 0) {
            return res.status(404).json({ error: 'No tasks deleted' });
        }

        res.status(200).json({
            message: 'Completed tasks have been deleted',
            deletedCount: deleteResult.deletedCount
        });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;