import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { handleDeleteTask } from '../Functions/DeleteTask';
import ReactPaginate from 'react-paginate';

const MyTasks = ({ filterOptions, dataUpdated }) => {

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [myTasks, setMyTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = async (page = 1, pageSize = 8) => {
    try {
      // Get the JWT token from your authentication mechanism
      const authToken = localStorage.getItem('authToken');
      let response = await fetch(`http://127.0.0.1:8000/tasks/fetchtask?page=${page}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`, // Add Bearer token to Authorization header
        },
      });

      if (response.status === 404) {
        // Handle the case where there are no tasks
        setMyTasks([]); // or handle it according to your use case
        return;
      }

      if (!response.ok) {
        // Handle non-successful response (e.g., show an error message)
        console.error(`Error: ${response.status} - ${response.statusText}`);
        return;
      }

      response = await response.json();
      setMyTasks(response.tasks);
      setTotalPages(Math.ceil(response.totalTasks / pageSize));
      console.log(response.totalTasks);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleCheckboxChange = (taskId) => {
    try {
      const updatedTasks = myTasks.map((task) => {
        if (task._id === taskId) {
          const updatedTasks = { ...task, completed: !task.completed }
          // call update on backend function
          UpdateTaskOnBackend(updatedTasks);
          return updatedTasks;
        };
        return task;
      });

      // Update the state with the modified tasks
      setMyTasks(updatedTasks);
    } catch (error) {
      console.log(error);
    }
  };

  const UpdateTaskOnBackend = async (updatedTask) => {
    try {
      const authToken = localStorage.getItem('authToken');
      await fetch(`http://127.0.0.1:8000/tasks/updatetask/${updatedTask._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ completed: updatedTask.completed })
      });
    } catch (error) {
      console.error('Error updating task on backend:', error);
    }
  };

  const filteredResult = myTasks.length > 0
    ? myTasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase())
    ).filter(task =>
      (filterOptions.all || (filterOptions.active && !task.completed) || (filterOptions.completed && task.completed) || (!filterOptions.active && !filterOptions.completed))
    )
    : [];

  const handleDeleteAndReload = async (taskId) => {
    await handleDeleteTask(taskId, navigate);
    loadData(); // Reload data after deletion
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
    loadData(selectedPage);
  }

  useEffect(() => {
    loadData();
  }, [dataUpdated])

  return (
    <div className='h-dvh flex flex-col w-full p-4 overflow-y-auto'>
      <div className='w-5/6 h-full flex flex-col items-center'>

        {/* Header */}
        <div className='flex items-center p-4 text-5xl'>
          <h1 className='relative'>My Tasks<span className='absolute left-0 -bottom-3 w-full h-1 bg-slate-300'></span></h1>
        </div>

        {/* Search Bar */}
        <div className='w-full p-4 flex items-center justify-center '>
          <div className='w-1/2 h-12 relative flex items-center'>
            <input
              className='border border-slate-300 outline-none w-full h-full p-2 text-base rounded-xl'
              type="text"
              placeholder='Search task by Title or Description'
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <i className="fa-solid fa-magnifying-glass absolute right-3 p-3 cursor-pointer"></i>
          </div>
        </div>

        {/* Tasks Data */}
        <div className='flex flex-col gap-y-2 w-3/5 min-h-[65%] p-4'>
          {
            filteredResult.length === 0 ? (
              <div className="text-xl">No tasks available</div>
            ) : (
              filteredResult.map((task) => (
                <div key={task._id} className='relative flex items-center border border-slate-500'>
                  <input
                    type="checkbox"
                    className='size-5 cursor-pointer py-4 mx-5'
                    checked={task.completed}
                    onChange={() => handleCheckboxChange(task._id)}
                  />
                  <Link to={`/details/${task._id}`} key={task._id} className='px-4 text-start border-l border-slate-500 hover:bg-slate-300 transition-all ease duration-75 w-full h-full py-4'>
                    <span className={`text-xl select-none font-semibold ${task.completed ? 'line-through' : ''}`}>{task.title}</span>
                  </Link>
                  <div className='absolute right-3 flex gap-x-1 text-base'>
                    <i onClick={() => navigate(`/edit/${task._id}`, {
                      state: {
                        taskId: task._id,
                        title: task.title,
                        description: task.description
                      }
                    })} className="fa-regular fa-pen-to-square z-30 hover:text-green-500 cursor-pointer p-1"></i>
                    <i onClick={() => handleDeleteAndReload(task._id)} className="fa-solid fa-trash z-30 hover:text-red-500 cursor-pointer p-1"></i>
                  </div>
                </div>
              ))
            )
          }
        </div>
        {
          filteredResult.length === 0 ? null
            : (
              <div className=' border-black w-3/5 flex items-center justify-center select-none'>
                <ReactPaginate
                  previousLabel="Prev"
                  nextLabel="Next"
                  breakLabel="..."
                  onPageChange={handlePageClick}
                  pageCount={totalPages}
                  initialPage={0}
                  pageRangeDisplayed={10}
                  pageLinkClassName={`relative inline-flex items-center px-4 py-2.5 text-sm font-semibold text-gray-500 ring-1 ring-inset ring-gray-300 hover:bg-gray-300 hover:text-black focus:z-20 focus:outline-offset-0`}
                  previousLinkClassName={'relative inline-flex items-center rounded-l-md px-4 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-300 hover:text-black focus:z-20 focus:outline-offset-0'}
                  nextLinkClassName={'relative inline-flex items-center rounded-r-md px-4 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-300 hover:text-black focus:z-20 focus:outline-offset-0'}
                  breakLinkClassName={'relative inline-flex items-center px-4 py-2.5 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:text-black hover:bg-gray-300 focus:z-20 focus:outline-offset-0'}
                  activeLinkClassName={'active'}
                  className={'w-full flex items-center justify-center bg-white gap-x-2'} />
              </div>
            )
        }
      </div>
    </div>
  );
}

export default MyTasks;
