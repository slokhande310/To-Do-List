import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'

const AddTask = () => {

    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [titleError, setTitleError] = useState('');
    const [descriptionError, setDescriptionError] = useState('');

    // Maximum number of characters allowed for the title
    const maxTitleLength = 50;
    const maxDescriptionLength = 256;

    const handleSubmit = async () => {
        // Reset error messages
        setTitleError('');
        setDescriptionError('');

        // Check if both title and description are not empty
        if (title.trim() === '' && description.trim() === '') {
            setTitleError('*Title is required');
            setDescriptionError('*Description is required');
            return;
        }
        else if (title.trim() === '') {
            setTitleError('*Title is required');
            return;
        }
        else if (description.trim() === '') {
            setDescriptionError('*Description is required');
            return;
        }

        // Check if the title exceeds the maximum length
        if (title.length > maxTitleLength) {
            setTitleError(`*Title should not exceed ${maxTitleLength} characters`);
            return;
        }

        // Check if the desc exceeds 256 characters
        if (description.length > maxDescriptionLength) {
            setDescriptionError(`*Description should not exceed ${maxDescriptionLength} characters`);
            return;
        }

        try {
            const authToken = localStorage.getItem('authToken');
            let response = await fetch(`http://127.0.0.1:8000/tasks/createtask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ title, description, completed: false })
            });
            if (!response.ok) {
                console.error(`Error: ${response.status} - ${response.statusText}`);
                return;
            }

            // Assuming the response is JSON, you should await it here
            response = await response.json();

            // Clear the form fields after successful submission
            setTitle('');
            setDescription('');

            // Clear the form fields after submission
            navigate('/');
        } catch (error) {
            console.log('Error Adding task:', error);
        }
    };

    return (
        <div className='h-dvh flex flex-col w-full p-4'>
            <div className='w-5/6 h-full flex flex-col items-center gap-y-5'>
                <div className='flex p-4 items-center text-5xl'>
                    <h1 className='relative'>Add Task<span className='absolute left-0 -bottom-3 w-full h-1 bg-slate-300'></span></h1>
                </div>
                <div className='w-full flex flex-col justify-center gap-y-12'>
                    <div className='relative flex w-11/12 justify-center items-start'>
                        <label htmlFor="title-AddTask" className='w-1/6 self-center '>Title: </label>
                        <input
                            type="text"
                            id="title-AddTask"
                            className='border border-slate-300 outline-none w-1/2 text-lg p-2'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            maxLength={maxTitleLength}
                            autoFocus
                        />
                        <span className='absolute text-gray-500 right-16 bottom-0'>{title.length}/{maxTitleLength}</span>
                        <p className='absolute text-red-600 -bottom-9 left-1/2'>{titleError}</p>
                    </div>
                    <div className='relative flex w-11/12 justify-center items-start'>
                        <label htmlFor="description-AddTask" className='w-1/6'>Description: </label>
                        <textarea
                            className='border border-slate-300 outline-none w-1/2 text-lg h-52 p-2'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            maxLength={maxDescriptionLength}
                        ></textarea>
                        <p className='absolute text-red-600 -bottom-9 left-1/2'>{descriptionError}</p>
                        <span className='absolute text-gray-500 right-16 bottom-0'>{description.length}/{maxDescriptionLength}</span>
                    </div>
                    <div className='w-11/12 flex justify-start items-center gap-x-4'>
                        <div className='w-1/2'></div>
                        <span onClick={handleSubmit} className='select-none border flex items-center justify-center border-slate-300 w-36 h-12 hover:bg-slate-300 transition-all ease-linear duration-75 cursor-pointer text-lg'>Save</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddTask;
