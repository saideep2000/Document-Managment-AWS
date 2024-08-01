// src/components/Myfiles.js
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faDownload, faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';

const Myfiles = () => {
  const [files, setFiles] = useState([
    { id: 1, name: 'File1.txt' },
    { id: 2, name: 'File2.txt' },
    { id: 3, name: 'File3.txt' },
  ]);

  const handleUpload = (event) => {
    const newFile = event.target.files[0];
    if (newFile) {
      setFiles([...files, { id: files.length + 1, name: newFile.name }]);
    }
  };

  const handleDelete = (id) => {
    setFiles(files.filter(file => file.id !== id));
  };

  const handleRename = (id) => {
    const newName = prompt('Enter new name');
    if (newName) {
      setFiles(files.map(file => (file.id === id ? { ...file, name: newName } : file)));
    }
  };

  const handleDownload = (name) => {
    alert(`Downloading ${name}`);
  };

  const handleDuplicate = (id) => {
    const fileToDuplicate = files.find(file => file.id === id);
    if (fileToDuplicate) {
      const newFile = { ...fileToDuplicate, id: files.length + 1 };
      setFiles([...files, newFile]);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 h-[600px] overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Files</h1>
        <label className="bg-[#E1FF6A] text-[#18202C] px-4 py-2 rounded-full font-bold uppercase tracking-widest transition-all duration-300 hover:bg-opacity-80 hover:scale-105 cursor-pointer">
          Upload
          <input type="file" onChange={handleUpload} className="hidden" />
        </label>
      </div>
      <ul>
        {files.map(file => (
          <li key={file.id} className="flex justify-between items-center mb-2 p-2 border-b border-gray-300">
            <span>{file.name}</span>
            <div className="flex space-x-4">
              <div className="group relative">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="text-blue-500 cursor-pointer hover:text-blue-700"
                  onClick={() => handleRename(file.id)}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                  Rename
                </div>
              </div>
              <div className="group relative">
                <FontAwesomeIcon
                  icon={faDownload}
                  className="text-green-500 cursor-pointer hover:text-green-700"
                  onClick={() => handleDownload(file.name)}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                  Download
                </div>
              </div>
              <div className="group relative">
                <FontAwesomeIcon
                  icon={faCopy}
                  className="text-yellow-500 cursor-pointer hover:text-yellow-700"
                  onClick={() => handleDuplicate(file.id)}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                  Duplicate
                </div>
              </div>
              <div className="group relative">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-red-500 cursor-pointer hover:text-red-700"
                  onClick={() => handleDelete(file.id)}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                  Delete
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Myfiles;
