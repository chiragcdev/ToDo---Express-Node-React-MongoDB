import { Fragment, useEffect, useState } from 'react';
import '../assets/style/list-task.css'
import { Link } from 'react-router-dom';

export default function List () {
    const [taskData, setTaskData] = useState([]);
    const [selectedTask, setSelectedTask] = useState([]);

    useEffect(() => {
        getListData()
    }, []);

    const getListData = async () => {
        let list = await fetch("http://localhost:3200/tasks", {
            credentials: 'include' 
        });
        list = await list.json();
        if (list.success) {
            setTaskData(list.result);
        } else {
            console.log("Failed to fetch task data");
        }
    };

    

    const deleteTask = async (id) => {
        try {
            const response = await fetch(`http://localhost:3200/delete/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            const data = await response.json();
             if (data.success) {
                getListData();
            } else {
                console.log("Failed to delete task");
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    const selectAll = (event) => {
        console.log(event.target.checked);
        if(event.target.checked) {
            let items = taskData.map((item) => item._id);
            console.log(items);
            setSelectedTask(items);
        } else {
            setSelectedTask([]);
        }
    }

    const selectSingleItem = (id) => {
        if(selectedTask.includes(id)) {
            let items = selectedTask.filter((item) => item !== id);
            setSelectedTask(items);
        } else {
            setSelectedTask([...selectedTask, id]);
        }
    }

    const deleteMultiple = async () => {
        try {
            const response = await fetch(`http://localhost:3200/delete-multiple`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids: selectedTask }),
            });
            const data = await response.json();
            if (data.success) {
                getListData();
                setSelectedTask([]);
            } else {
                console.log("Failed to delete tasks");
            }
        } catch (error) {
            console.error("Error deleting tasks:", error);
        }
    }

    return (
        <div className="wrapper">
            
            <h1 className="text-center">Task List</h1>
           <ul className="task-list">
                <li className="task-title"><input onChange={selectAll} type="checkbox" /></li>
                <li className="task-title">No.</li>
                <li className="task-title">Title</li>
                <li className="task-title">Description</li>
                <li className="task-title">Actions</li>

                {taskData && taskData.map((item, index) => (
                    <Fragment key={item._id || item.id}>
                        <li><input onChange={()=>selectSingleItem(item._id)} checked={selectedTask.includes(item._id)} type="checkbox" /></li>
                        <li>{index + 1}</li>
                        <li>{item.title}</li>
                        <li>{item.description}</li>
                        <li>
                            <Link className='btn' to={`/update/${item._id}`}>Update</Link>
                            <button onClick={()=>deleteTask(item._id)}>Delete</button>
                        </li>
                    </Fragment>
                ))}
            </ul>
            <button onClick={deleteMultiple} className="delete-selected">Delete Selected</button>
        </div>
    )
}