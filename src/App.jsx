import './App.css';
import AddTask from './components/AddTask';
import MyTasks from './components/MyTasks';
import Sidebar from './components/Sidebar';
import TaskDetails from './components/TaskDetails';
import EditTask from './components/EditTask';
import Login from './components/Login';
import { useEffect, useState } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  const [filterOptions, setFilterOptions] = useState({
    all: false,
    active: false,
    completed: false,
  });

  const handleFilterChange = (options) => {
    setFilterOptions(options);
  };

  const [loggedIn, setLoggedIn] = useState(false);

  const checkLogin = () => {
    try {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setLoggedIn(true);
      }
    } catch (error) {
      console.error('Error while retrieving authentication token:', error);
    }
  };

  const login = (setLogin) => {
    setLoggedIn(setLogin);
  };

  const logout = (setLogin) => {
    setLoggedIn(setLogin);
  }

  useEffect(() => {
    checkLogin();
    // Check local storage for authentication token on component mount
  }, [loggedIn, login]);

  return (
    <div className='w-full h-full flex'>
      <BrowserRouter>
        {/* Render Login component if not logged in, else render Sidebar and other components */}
        {!loggedIn ? (
          <Routes>
            <Route path='/' element={<Login login={login} />} />
          </Routes>
        ) : (
          <>
            {/* Sidebar Component */}
            <Sidebar logout={logout} onFilterChange={handleFilterChange} />
            <Routes>
              {/* MyTasks Component */}
              <Route exact path='/' element={<MyTasks filterOptions={filterOptions} />} />
              {/* AddTask Component */}
              <Route path='/addtask' element={<AddTask />} />
              {/* TaskDetails Component */}
              <Route path='/details/:taskId' element={<TaskDetails />} />
              {/* EditTask Component */}
              <Route path='/edit/:taskId' element={<EditTask />} />
              {/* You can add more routes/components here */}
            </Routes>
          </>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
