import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddTask() {
    const [taskData, setTaskData] = useState();
    const navigate = useNavigate();
    const handleAddTask = async () => {
        console.log(taskData);
        let result = await fetch("http://localhost:3200/add-task", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(taskData)
        })
        result = await result.json();
        if (result.success) {
            navigate("/");
            console.log("Task added successfully");
        } else {
            console.log("Failed to add task");
        }
    }
    return (
        <div>
            <div className="wrapper">
                <div className="wrapper-inner">
                    <h1 className="text-center">Add Task</h1>
                    <div className="form">
                        <label htmlFor="title">Title:</label>
                        <input onChange={(event)=>setTaskData({...taskData, title:event.target.value})} type="text" id="title" name="title" placeholder="Enter Title" required />
                        <br /> 
                        <label htmlFor="description">Description:</label>
                        <textarea onChange={(event)=>setTaskData({...taskData, description: event.target.value})} id="description" name="description" rows="5" placeholder="Enter Description" required></textarea>
                        <br />
                        <button onClick={handleAddTask} className="full-width">Add Task</button>
                    </div>
                </div>
            </div>
            
        </div>
    );
}   


