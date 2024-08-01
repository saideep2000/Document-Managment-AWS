// src/components/Login.js
import React, { useState, useEffect } from 'react';

const Login = () => {
  const [step, setStep] = useState(1); // 1: Email Input, 2: New User Info, 3: Existing User Password
  const [email, setEmail] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    setIsEmailValid(validateEmail(email));
  }, [email]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Simulate checking if the email exists
    const emailExists = checkIfEmailExists(email);
    if (emailExists) {
      setIsNewUser(false);
      setStep(3);
    } else {
      setIsNewUser(true);
      setStep(2);
    }
  };

  const handleNewUserSubmit = (e) => {
    e.preventDefault();
    // Handle new user registration
    alert('New user registered');
  };

  const handleExistingUserSubmit = (e) => {
    e.preventDefault();
    // Handle existing user login
    alert('User logged in');
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const checkIfEmailExists = (email) => {
    // Replace with real API call to check if email exists
    const existingEmails = ['existing@example.com'];
    return existingEmails.includes(email);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
            <form onSubmit={handleEmailSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                  Email
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
            <h1 className="text-2xl font-bold mb-6 text-center">New User</h1>
            <form onSubmit={handleNewUserSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="username"
                  type="text"
                  placeholder="Username"
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
                />
              </div>
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
                />
              </div>
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
