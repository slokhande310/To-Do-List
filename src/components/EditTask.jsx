import React, { useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'

const EditTask = () => {

    const { taskId } = useParams();
    let { state } = useLocation();
    const navigate = useNavigate();
    const [updatedTitle, setUpdatedTitle] = useState(state.title);
    const [updatedDescription, setUpdatedDescription] = useState(state.description);
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
        if (updatedTitle.trim() === '' && updatedDescription.trim() === '') {
            setTitleError('*Title is required');
            setDescriptionError('*Description is required');
            return;
        }
        else if (updatedTitle.trim() === '') {
            setTitleError('*Title is required');
            return;
        }
        else if (updatedDescription.trim() === '') {
            setDescriptionError('*Description is required');
            return;
        }

        // Check if the title exceeds the maximum length
        if (updatedTitle.length > maxTitleLength) {
            setTitleError(`*Title should not exceed ${maxTitleLength} characters`);
            return;
        }

        // Check if the desc exceeds 256 characters
        if (updatedDescription.length > maxDescriptionLength) {
            setDescriptionError(`*Description should not exceed ${maxDescriptionLength} characters`);
            return;
        }

        try {
            const authToken = localStorage.getItem('authToken');
            let response = await fetch(`http://127.0.0.1:8000/tasks/updatetask/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ title: updatedTitle, description: updatedDescription })
            });

            if (!response.ok) {
                console.error(`Error: ${response.status} - ${response.statusText}`);
                return;
            }

            // Assuming the response is JSON, you should await it here
            response = await response.json();

            // Clear the form fields after submission
            navigate(`/details/${taskId}`);

        } catch (error) {
            console.log('Error Editing task:', error);
        }
    }

    return (
        <div className='h-dvh flex flex-col w-full p-4'>
            <div className='w-5/6 h-full flex flex-col items-center gap-y-5'>
                <div className='flex p-4 items-center text-5xl'>
                    <h1 className='relative'>Edit Task<span className='absolute left-0 -bottom-3 w-full h-1 bg-slate-300'></span></h1>
                </div>
                <div className='w-full flex flex-col justify-center gap-y-12'>
                    <div className='relative flex w-11/12 justify-center items-start'>
                        <label htmlFor="title-EditTask" className='w-1/6 self-center'>Title: </label>
                        <input
                            type="text"
                            id="title-EditTask"
                            className='border border-slate-300 outline-none w-1/2 text-lg p-2'
                            value={updatedTitle}
                            onChange={(e) => setUpdatedTitle(e.target.value)}
                            autoFocus
                            maxLength={maxTitleLength}
                        />
                        <span className='absolute text-gray-500 right-16 bottom-0'>{updatedTitle.length}/{maxTitleLength}</span>
                        <p className='absolute text-red-600 -bottom-9 left-1/2'>{titleError}</p>
                    </div>
                    <div className='relative flex w-11/12 justify-center items-start'>
                        <label htmlFor="description" className='w-1/6'>Description: </label>
                        <textarea
                            className='border border-slate-300 outline-none w-1/2 text-lg h-52 p-2'
                            value={updatedDescription}
                            onChange={(e) => setUpdatedDescription(e.target.value)}
                            maxLength={maxDescriptionLength}
                        ></textarea>
                        <p className='absolute text-red-600 -bottom-9 left-1/2'>{descriptionError}</p>
                        <span className='absolute text-gray-500 right-16 bottom-0'>{updatedDescription.length}/{maxDescriptionLength}</span>
                    </div>
                    <div className='w-11/12 flex justify-start items-center gap-x-4'>
                        <div className='w-1/2'></div>
                        <span onClick={handleSubmit} className='select-none border flex items-center justify-center border-slate-300 w-36 h-12 hover:bg-slate-300 transition-all ease-linear duration-75 cursor-pointer text-lg'>Save</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditTask
