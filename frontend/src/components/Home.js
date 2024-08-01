import React from 'react';
import Navigation from './Navigation';
import Myfiles from './Myfiles';

const Home = () => {
  return (
    <div className="w-full px-4 sm:px-0 font-sans">
      <div className="mb-4">
        <Navigation />
      </div>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-9">
          {/* Placeholder for Timeline component */}
          {/* <div className="bg-gray-100 p-4 rounded-lg shadow-md">My Files Component</div> */}
          <Myfiles/>
        </div>
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4">
          {/* Placeholder for Recent Messages component */}
          <div className="flex-1 bg-gray-100 p-4 rounded-lg shadow-md">Recent Messages Component</div>
          {/* Placeholder for Follow component */}
          <div className="flex-1 bg-gray-100 p-4 rounded-lg shadow-md">Follow Component</div>
        </div>
      </div>
      <div className="mt-4">
        {/* Placeholder for Task Info component */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">Info Component</div>
      </div>
    </div>
  );
};

export default Home;
