import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = ({ onFilterChange, logout, onTriggerDataFetch }) => {

    const [filterOptions, setFilterOptions] = useState({
        all: false,
        active: false,
        completed: false,
    });

    const navigate = useNavigate();
    const [toggleFilterTaskDropDown, settoggleFilterTaskDropDown] = useState(false);

    const handleClearCompleted = async () => {
        const authToken = localStorage.getItem("authToken");

        const userConfirmation = window.confirm('Delete Completed Tasks?')
        if (!userConfirmation) {
            return;
        };

        try {
            const response = await fetch('http://127.0.0.1:8000/tasks/deletecompleted', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
            });

            if (!response.ok) {
                // Handle non-successful response (e.g., show an error message)
                console.error(`Error: ${response.status} - ${response.statusText}`);
                return;
            }

            const responseData = await response.json();
            console.log(responseData);
            onTriggerDataFetch();
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    const getUsername = localStorage.getItem("username");

    const capitalizeFirstChar = (getUsername) => {
        return getUsername.charAt(0).toUpperCase() + getUsername.slice(1);
    };

    const handleFilterTask = (e) => {
        // Add your logic for clearing completed tasks here
        e.preventDefault();
        settoggleFilterTaskDropDown(!toggleFilterTaskDropDown);
    };

    const handleFilterChange = (option) => {
        const newFilterOptions = { ...filterOptions, [option]: !filterOptions[option] };
        setFilterOptions(newFilterOptions);

        // Pass the filter options to the parent component
        onFilterChange && onFilterChange(newFilterOptions);
    };

    const handleLogout = () => {
        try {
            localStorage.removeItem('authToken');
            localStorage.removeItem('username');
            logout(false);
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='h-dvh flex flex-col justify-between w-96 select-none border-r border-black'>
            <div className='flex flex-col items-start justify-start gap-y-8 w-full h-1/2 p-4'>
                <header className='text-2xl text-center w-full'>
                    <Link to="/" className='p-2'>To-Do List</Link>
                </header>
                <ul className='flex flex-col w-full justify-center gap-y-2'>

                    {/* Add Task */}
                    <li>
                        <Link to="/addtask" className='flex rounded-xl p-3 border border-slate-300 items-center gap-x-2 text-gray-700 hover:bg-slate-300 transition-all ease duration-75'>
                            <i className="fa-solid fa-circle-plus text-green-500"></i>
                            <span>Add Task</span>
                        </Link>
                    </li>

                    {/* My Tasks */}
                    <li>
                        <Link to="/" className='flex rounded-xl p-3 border border-slate-300 items-center gap-x-2 text-gray-700 hover:bg-slate-300 transition-all ease duration-75'>
                            <i className="fa-solid fa-inbox text-blue-500"></i>
                            <span>My Tasks</span>
                        </Link>
                    </li>

                    {/* Filter Task */}
                    <li>
                        <Link to="/filtertask" className={`flex rounded-xl p-3 border border-slate-300 items-center gap-x-2 text-gray-700 hover:bg-slate-300 transition-all ease duration-75 ${!toggleFilterTaskDropDown ? '' : 'rounded-br-none rounded-bl-none border-b-0'}`} onClick={handleFilterTask}>
                            <i className="fa-solid fa-filter text-orange-500"></i>
                            <span>Filter Task</span>
                        </Link>
                        <div className={`flex flex-col p-3 border border-slate-300 border-t-0 -mt-2 rounded-bl-xl rounded-br-xl transition-all ease-linear duration-75 ${!toggleFilterTaskDropDown ? 'hidden' : ''}`}>
                            <label className='flex gap-x-3'>
                                <input className='cursor-pointer'
                                    type="checkbox"
                                    checked={filterOptions.all}
                                    onChange={() => handleFilterChange('all')}
                                />
                                All</label>
                            <label className='flex gap-x-3'>
                                <input className='cursor-pointer'
                                    type="checkbox"
                                    checked={filterOptions.active}
                                    onChange={() => handleFilterChange('active')}
                                />
                                Active</label>
                            <label className='flex gap-x-3'>
                                <input className='cursor-pointer'
                                    type="checkbox"
                                    checked={filterOptions.completed}
                                    onChange={() => handleFilterChange('completed')}
                                />
                                Completed</label>
                        </div>
                    </li>

                    {/* Clear Completed */}
                    <li>
                        <Link className={`flex rounded-xl p-3 border border-slate-300 items-center gap-x-2 text-gray-700 hover:bg-slate-300 transition-all ease duration-75`}
                            onClick={handleClearCompleted}>
                            <i className="fa-solid fa-trash text-red-500"></i>
                            <span>Clear Completed</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="flex justify-between items-center w-full p-4 border-t border-black text-gray-500">
                <span className="text-sm">{capitalizeFirstChar(getUsername)}</span>
                <Link onClick={handleLogout} className="text-base flex items-center gap-x-1 hover:text-black transition-all ease-linear duration-150">
                    <span className="flex items-center gap-x-1">Logout<i className="fa-solid fa-right-from-bracket"></i></span>
                </Link>
            </div>
        </div>
    );
}

export default Sidebar;
