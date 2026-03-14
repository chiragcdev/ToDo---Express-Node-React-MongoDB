import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateTask() {
    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
    });
    const { id } = useParams();
    const navigate = useNavigate();

    const getTask = async (id) => {
        let task = await fetch('http://localhost:3200/task/' + id, {
            credentials: "include",
        });
        task = await task.json();
        if (task.result) {
            setTaskData(task.result);  
        } else {
            console.log("Failed to fetch task data");
        }
    }

    useEffect(() => {
        getTask(id);
    },[]);


    const updateTask = async () => {
        try {
            const response = await fetch(`http://localhost:3200/update-task`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });
            const data = await response.json();
            if (data.success) {
                navigate('/');
            } else {
                console.log("Failed to update task");
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    }


    return (
        <div>
            <div className="wrapper">
                <div className="wrapper-inner">
                    <h1 className="text-center">Update Task</h1>
                    <div className="form">
                        <label htmlFor="title">Title:</label>
                        <input value={taskData.title} onChange={(event)=>setTaskData({...taskData, title:event.target.value})} type="text" id="title" name="title" placeholder="Enter Title" required />
                        <br /> 
                        <label htmlFor="description">Description:</label>
                        <textarea value={taskData.description} onChange={(event)=>setTaskData({...taskData, description: event.target.value})} id="description" name="description" rows="5" placeholder="Enter Description" required></textarea>
                        <br />
                        <button onClick={updateTask} className="full-width">Update Task</button>
                    </div>
                </div>
            </div>
            
        </div>
    );
}   


