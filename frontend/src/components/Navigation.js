import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';  // Updated import
import { logout } from '../store/authActions';

const Navigation = () => {
  const user = useSelector(state => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Updated for React Router v6

  const handleLogout = () => {
    dispatch(logout());
    navigate('/'); // Updated navigation method
  };

  return (
    <header className="flex justify-between items-center p-4 bg-transparent">
      <div className="logo text-3xl font-bold text-[#4169e1]">
        <span>DocuFlow</span>
      </div>
      <nav className="main-nav">
        <ul className="flex list-none m-0 p-0">
          <li className="mr-4">
          <a href={`/myfiles`} className="inline-block px-8 py-4 rounded-full bg-[#E1FF6A] text-[#18202C] text-base font-bold uppercase tracking-widest transition-all duration-300 hover:bg-opacity-80 hover:scale-105">My Files</a>
          </li>
          <li className="mr-4">
            <a href="/messages" className="inline-block px-8 py-4 rounded-full bg-[#E1FF6A] text-[#18202C] text-base font-bold uppercase tracking-widest transition-all duration-300 hover:bg-opacity-80 hover:scale-105">Messages</a>
          </li>
          <li>
            <a href="/profile" className="inline-block px-8 py-4 rounded-full bg-[#E1FF6A] text-[#18202C] text-base font-bold uppercase tracking-widest transition-all duration-300 hover:bg-opacity-80 hover:scale-105">Profile</a>
          </li>
        </ul>
      </nav>
      <nav className="secondary-nav">
        <ul className="flex list-none m-0 p-0 items-center h-12 bg-[#e9e6dc] rounded-full overflow-hidden transition-all duration-300">
          <li className="flex">
            <a href="/about" className="inline-block px-6 py-4 bg-[#e9e6dc] text-[#15535e] text-base font-bold uppercase tracking-widest transition-all duration-300 hover:bg-opacity-80 hover:scale-105">About</a>
          </li>
          <li className="flex">
            <a href="/contact" className="inline-block px-6 py-4 bg-[#e9e6dc] text-[#15535e] text-base font-bold uppercase tracking-widest transition-all duration-300 hover:bg-opacity-80 hover:scale-105">Contact</a>
          </li>
          <li className="flex">
            {user.email ? (
                <button onClick={handleLogout} className="inline-block px-6 py-4 bg-[#e9e6dc] text-[#15535e] text-base font-bold uppercase tracking-widest transition-all duration-300 hover:bg-opacity-80 hover:scale-105">Logout</button>
              ) : (
                <a href="/login" className="inline-block px-6 py-4 bg-[#e9e6dc] text-[#15535e] text-base font-bold uppercase tracking-widest transition-all duration-300 hover:bg-opacity-80 hover:scale-105">Login</a>
              )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navigation;
