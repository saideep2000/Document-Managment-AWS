// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch } from 'react-redux';
import { setUserInfo } from '../store/authActions';

import * as client from "./client";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [step,  setStep] = useState(1); // 1: Email Input, 2: New User Info, 3: Existing User Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState(''); 
  const [isNewUser, setIsNewUser] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsEmailValid(validateEmail(email));
  }, [email]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const checkIfEmailExists = async (email) => {
    const token = { "email": email };
    try {
      const res = await client.testAccount(token);
      console.log(res)
    } catch (error) {
      if (error.response.status === 404) {
        return false;
      }
      if (error.code === 'NotAuthorizedException') {
        return true;
      }
      throw error;
    }
    return true;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const emailExists = await checkIfEmailExists(email);
      if (emailExists) {
        setIsNewUser(false);
        setStep(3);
      } else {
        setIsNewUser(true);
        setStep(2);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNewUserSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = {"email" : email, "password" : password, "fullname" : fullName}
    try {
      const res = await client.signupAccount(token);
      dispatch(setUserInfo({ email, fullName }));
      console.log(res)
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExistingUserSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const token = {"email" : email, "password" : password}
    try {
      const res = await client.loginAccount(token);
      dispatch(setUserInfo({ email, fullName: res.fullName }));
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">Let's get started!</h1>
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-4">
                <label className="text-[#1F2225A6] text-sm font-bold mb-2" htmlFor="email">
                  Please confirm your email to continue
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-xs italic">{error}</p>}
              <button
                className={`${
                  isEmailValid ? 'bg-blue-500 hover:bg-blue-700' : 'bg-blue-300'
                } text-white font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full mb-2`}
                type="submit"
                disabled={!isEmailValid}
              >
                Continue
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
            <form onSubmit={handleNewUserSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fullName">
                  Full Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="fullName"
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="**********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-xs italic">{error}</p>}
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign Up
              </button>
            </form>
          </>
        )}


        {step === 3 && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">Existing User</h1>
            <form onSubmit={handleExistingUserSubmit}>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="**********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-xs italic">{error}</p>}
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
            </form>
          </>
        )}

        <div className="flex items-center justify-center mt-6">
          <div className="border-t border-gray-300 flex-grow mr-3"></div>
          <span className="text-gray-500">or</span>
          <div className="border-t border-gray-300 flex-grow ml-3"></div>
        </div>

        <div className="mt-6 text-center">
          <button className="bg-transparent border border-gray-400 text-black font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full mb-2 flex items-center justify-center">
            <img src="https://img.icons8.com/?size=20&id=17949&format=png&color=000000" alt="Google logo" className="mr-2" />
            Continue with Google
          </button>
          <button className="bg-transparent border border-gray-400 text-black font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full mb-2 flex items-center justify-center">
            <img src="https://img.icons8.com/?size=20&id=22989&format=png&color=000000" alt="Microsoft logo" className="mr-2" />
            Continue with Microsoft
          </button>
          <button className="bg-transparent border border-gray-400 text-black font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full mb-2 flex items-center justify-center">
            <img src="https://img.icons8.com/?size=20&id=101403&format=png&color=000000" alt="Apple logo" className="mr-2" />
            Continue with Apple
          </button>
          <button className="bg-transparent border border-gray-400 text-black font-bold py-2 px-4 rounded-full focus:outline-none focus:shadow-outline w-full flex items-center justify-center">
            <img src="https://img.icons8.com/?size=20&id=uLWV5A9vXIPu&format=png&color=000000" alt="Facebook logo" className="mr-2" />
            Continue with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
