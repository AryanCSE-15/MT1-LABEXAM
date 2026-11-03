import express from "express";

const app = express();

const PORT = 4000;

app.use(express.json());

// Initial employee task array

let tasks = [

    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending",
        priority: "High"
    },

    {
        id: 2,
        taskName: "Design Dashboard",
        assignedTo: "Priya Verma",
        status: "In Progress",
        priority: "Medium"
    },

    {
        id: 3,
        taskName: "Test REST API",
        assignedTo: "Amit Kumar",
        status: "Completed",
        priority: "Low"
    }

];


// GET ALL TASKS

app.get("/tasks", (req, res) => {

    res.status(200).json(tasks);

});


// GET TASK BY ID

app.get("/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    res.json(task);

});


// POST - ADD NEW TASK

app.post("/tasks", (req, res) => {

    const { id, taskName, assignedTo, status, priority } = req.body;

    if (
        id === undefined ||
        !taskName ||
        !assignedTo ||
        !status ||
        !priority
    ) {

        return res.status(400).json({
            message: "All fields are required"
        });

    }

    if (!Number.isInteger(Number(id))) {
        return res.status(400).json({
            message: "Task ID must be an integer"
        });
    }

    if (tasks.some(t => t.id === Number(id))) {

        return res.status(409).json({
            message: "Task ID already exists"
        });

    }

    const newTask = {

        id: Number(id),
        taskName,
        assignedTo,
        status,
        priority

    };

    tasks.push(newTask);

    res.status(201).json({

        message: "Task added successfully",
        task: newTask

    });

});


// PUT - UPDATE TASK

app.put("/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    const { taskName, assignedTo, status, priority } = req.body;

    if (!taskName || !assignedTo || !status || !priority) {

        return res.status(400).json({
            message: "All fields are required"
        });

    }

    tasks[index] = {

        id,
        taskName,
        assignedTo,
        status,
        priority

    };

    res.json({

        message: "Task updated successfully",
        task: tasks[index]

    });

});


// DELETE TASK

app.delete("/tasks/:id", (req, res) => {

    const id = Number(req.params.id);

    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {

        return res.status(404).json({
            message: "Task not found"
        });

    }

    const deletedTask = tasks.splice(index, 1);

    res.json({

        message: "Task deleted successfully",
        task: deletedTask[0]

    });

});


// INVALID ROUTE

app.use((req, res) => {

    res.status(404).json({
        message: "Route not found"
    });

});


// SERVER

app.listen(PORT, () => {

    console.log(
        `Express Server running at http://localhost:${PORT}`
    );

});
