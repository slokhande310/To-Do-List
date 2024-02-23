import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'

const Login = ({ login }) => {
    const [isLogin, setIsLogin] = useState(true); // Initially set to login mode
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [infoError, setInfoError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const navigate = useNavigate();

    const switchMode = () => {
        setInfoError('');
        setUsername('');
        setEmail('');
        setPassword('');
        setIsLogin(!isLogin);
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                // Handle login failure
                console.error('Login failed');
                handleErrorMessages('Invalid Credentials');
                return;
            }

            const responseData = await response.json();

            if (!responseData.error) {
                setUsername('');
                setEmail('');
                setPassword('');
                setInfoError('');
                localStorage.setItem("authToken", responseData.token);
                localStorage.setItem("username", responseData.user.username);
                // Redirect to the home page after successful login 
                setSuccessMsg('Login Successful');
                setTimeout(() => {
                    login(true);
                    navigate('/');
                    setSuccessMsg('');
                }, 1500);
            } else {
                // Handle login failure based on the API response
                console.error('Login failed:', responseData.error);
                // You might want to provide user feedback here
            }
        } catch (error) {
            console.error('Error while login: ', error);
            // Handle network or other errors
            // You might want to provide user feedback here
        }
    };

    const handleRegister = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            // Check the response status and handle accordingly
            if (!response.ok) {
                // Handle registration failure
                const errorResponse = await response.json();
                console.error(`Error: ${response.status} - ${response.statusText}, ${errorResponse.error}`);
                handleErrorMessages(errorResponse.error);
                return;
            }

            const successResponse = await response.json();
            console.log(successResponse.message);
            setUsername('');
            setPassword('');
            setEmail('');
            setInfoError('');
            setSuccessMsg('User Registered Successfully!!!');
            setTimeout(() => {
                setIsLogin(!isLogin);
                setSuccessMsg('');
            }, 3000);
        } catch (error) {
            console.error('Error while registration: ', error);
        }
    };

    const handleErrorMessages = (message) => {
        setInfoError(message);

        // Clear any existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set a new timeout
        timeoutRef.current = setTimeout(() => {
            setInfoError('');
        }, 5000);
    };

    // Add a ref to store the timeout identifier
    const timeoutRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (username.trim() === '' || password.trim() === '') {
            handleErrorMessages('*All fields are mandatory');
            return;
        }

        if (!isLogin && email.trim() === '') {
            handleErrorMessages('*All fields are mandatory');
            return;
        }

        if (isLogin) {
            handleLogin();
        } else {
            handleRegister();
        }
    };

    return (
        <div className={`container mx-auto w-full h-dvh flex items-center justify-center transition-all ease-linear duration-500 [transform:${isLogin ? 'rotateY(360deg)' : ''}]`}>
            <div className='w-3/5 h-[45%] flex shadow-2xl'>
                <div className='w-1/2 h-full  flex flex-col justify-center items-center p-5 select-none'>
                    <h1 className='text-5xl p-5 underline'>TODO LIST</h1>
                    <h1 className='text-4xl p-5'>{isLogin ? 'LOGIN USER' : 'REGISTER USER'}</h1>
                    <p className='text-base p-5'>
                        {isLogin ? "Don't have an account? Register " : 'Already have an account? Login '}
                        <span className='text-red-500 cursor-pointer hover:underline underline-offset-2' onClick={switchMode}>here</span>
                    </p>
                </div>
                <div className='w-0.5 h-full bg-black'></div>
                <div className='w-1/2 h-full flex flex-col justify-center items-center gap-y-10 p-5 relative'>
                    <span className='absolute top-3 left-1 text-red-500 text-sm'>{infoError}</span>
                    <span className='absolute top-10 left-1 text-green-500 text-sm'>{successMsg}</span>
                    <input
                        type='text'
                        className='border border-slate-300 outline-none h-11 w-full p-2 text-base'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {!isLogin && (
                        <input
                            type='email'
                            className='border border-slate-300 outline-none h-11 w-full p-2 text-base'
                            placeholder='E-mail'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    )}
                    <input
                        type='password'
                        className='border border-slate-300 outline-none h-11 w-full p-2 text-base'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className='border border-slate-300 py-2 px-5 hover:bg-slate-300' type='submit' onClick={handleSubmit}>
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
