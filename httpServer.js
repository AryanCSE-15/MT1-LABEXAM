import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let tasks = [
    {
        id: 1,
        taskName: "Develop Login Page",
        assignedTo: "Rahul Sharma",
        status: "Pending"
    },
    {
        id: 2,
        taskName: "Design Dashboard",
        assignedTo: "Priya Verma",
        status: "In Progress"
    },
    {
        id: 3,
        taskName: "Test Application",
        assignedTo: "Amit Kumar",
        status: "Completed"
    }
];

const server = http.createServer((req, res) => {

    // GET /
    if (req.method === "GET" && req.url === "/") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h1>Welcome to Employee Task Management</h1>");
    }

    // GET /tasks
    else if (req.method === "GET" && req.url === "/tasks") {

        res.writeHead(200, {
            "Content-Type": "application/json"
        });

        res.end(JSON.stringify(tasks));
    }

    // GET /about
    else if (req.method === "GET" && req.url === "/about") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end("<h1>Employee Task Management Application</h1>");
    }

    // GET /home using FS module
    else if (req.method === "GET" && req.url === "/home") {

        const filePath = path.join(__dirname, "public", "index.html");

        fs.readFile(filePath, "utf8", (err, data) => {

            if (err) {
                res.writeHead(500);
                res.end("Unable to read HTML file");
                return;
            }

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(data);
        });
    }

    // POST /add-task
    else if (req.method === "POST" && req.url === "/add-task") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {

            try {

                const newTask = JSON.parse(body);

                if (
                    newTask.id === undefined ||
                    !newTask.taskName ||
                    !newTask.assignedTo ||
                    !newTask.status
                ) {
                    res.writeHead(400);
                    res.end("All task fields are required");
                    return;
                }

                if (
                    !Number.isInteger(Number(newTask.id)) ||
                    tasks.some(task => task.id === Number(newTask.id))
                ) {
                    res.writeHead(400);
                    res.end("Task ID must be a unique integer");
                    return;
                }

                newTask.id = Number(newTask.id);
                tasks.push(newTask);

                res.writeHead(201, {
                    "Content-Type": "application/json"
                });

                res.end(JSON.stringify({
                    message: "Task added successfully",
                    task: newTask
                }));

            } catch (error) {

                res.writeHead(400);
                res.end("Invalid JSON");
            }
        });
    }

    // Invalid routes
    else {

        res.writeHead(404, {
            "Content-Type": "text/plain"
        });

        res.end("404 - Page Not Found");
    }

});

server.listen(PORT, () => {
    console.log(`HTTP Server running at http://localhost:${PORT}`);
});
