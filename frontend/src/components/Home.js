import React from 'react';
import Navigation from './Navigation';
import Myfiles from './Myfiles';
import { useSelector } from 'react-redux';

const Home = () => {
  // const user = useSelector(state => state.auth);

  return (
    <div className="w-full px-4 sm:px-0 font-sans">
      <div className="mb-4">
        <Navigation />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-9">
          <Myfiles/>
        </div>
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          <div className="flex-1 bg-gray-100 p-4 rounded-lg shadow-md">Recent Messages</div>
          <div className="flex-1 bg-gray-100 p-4 rounded-lg shadow-md">Follow</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 h-[600px]">Information Tab</div>
      </div>
    </div>
  );
};

export default Home;
