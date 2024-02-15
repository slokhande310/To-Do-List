import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'
import { handleDeleteTask } from '../Functions/DeleteTask';

const TaskDetails = () => {

    const { taskId } = useParams();
    const navigate = useNavigate();
    const [taskDetails, setTaskDetails] = useState(null);

    useEffect(() => {
        const fetchTaskDetails = async () => {
            try {
                const authToken = localStorage.getItem('authToken');
                const response = await fetch(`http://127.0.0.1:8000/tasks/fetchtask/${taskId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    console.error(`Error: ${response.status} - ${response.statusText}`);
                    return;
                }
                const data = await response.json();
                setTaskDetails(data.task);
            } catch (error) {
                console.error('Error fetching task details:', error);
            }
        };
        fetchTaskDetails();
    }, [taskId]);

    if (!taskDetails) {
        // If taskDetails is not available yet, you can display a loading state
        return <div>Loading...</div>;
    };

    return (
        <div className='h-dvh flex flex-col w-full p-4'>
            <div className='w-1/2 h-full self-center mr-52 flex flex-col items-center gap-y-5'>
                <div className='flex p-4 items-center text-5xl'>
                    <h1 className='relative'>Task Details<span className='absolute left-0 -bottom-3 w-full h-1 bg-slate-300'></span></h1>
                </div>
                <div className='flex w-11/12 justify-center items-start border border-slate-400'>
                    <label htmlFor="title" className='w-1/5 m-1'>Title:</label>
                    <p className='h-full border border-slate-400'></p>
                    <p className='w-full px-2 m-1'>{taskDetails.title}</p>
                </div>
                <div className='flex w-11/12  justify-center items-start border border-slate-400'>
                    <label htmlFor="description" className='w-1/5 m-1'>Description:</label>
                    <p className='h-full border border-slate-400'></p>
                    <p className='w-full h-auto max-h-96 overflow-y-auto px-2 m-1'>{taskDetails.description}</p>
                </div>
                <div className='flex w-11/12 justify-center items-start border border-slate-400'>
                    <label htmlFor="status" className='w-1/5 m-1'>Status:</label>
                    <p className='h-full border border-slate-400'></p>
                    <p className='w-full px-2 m-1'>{taskDetails.completed ? 'COMPLETED' : 'ACTIVE'}</p>
                </div>
                <div className='flex justify-start items-center gap-x-4'>
                    <Link to={`/edit/${taskId}`} state={taskDetails}
                        className='border flex items-center justify-center gap-x-2 border-slate-300 w-36 h-12 hover:bg-slate-300 transition-all ease-linear duration-75 cursor-pointer text-lg select-none'
                    >
                        <i className="fa-regular fa-pen-to-square text-base text-purple-600"></i>Edit
                    </Link>
                    <span onClick={() => handleDeleteTask(taskId, navigate)} className='border flex items-center justify-center gap-x-2 border-slate-300 w-36 h-12 hover:bg-slate-300 transition-all ease-linear duration-75 cursor-pointer text-lg select-none'>
                        <i className="fa-solid fa-trash text-base text-red-500"></i>Delete
                    </span>
                </div>
            </div>
        </div>
    );
}

export default TaskDetails;
