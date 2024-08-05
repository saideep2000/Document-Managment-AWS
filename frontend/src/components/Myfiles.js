// src/components/Myfiles.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faDownload, faCopy, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';

import * as client from "./client";

const Myfiles = () => {

  const user = useSelector(state => state.auth);
  const [files, setFiles] = useState([
    { fileid: 1, filename: 'SampleFile1.txt' },
    { fileid: 2, filename: 'SampleFile2.txt' },
    { fileid: 3, filename: 'SampleFile3.txt' },
  ]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user.email) {
      loadFiles();
    }
  }, [user.email]);


  const loadFiles = async () => {
    const token = {"email" : user.email}
    try {
      const response = await client.getFile(token);
      setFiles(response);
    } catch (err) {
      setError('Failed to load files. Please try again.');
    }
  };

  const handleUpload = (event) => {
    const newFile = event.target.files[0];
    if (newFile) {
      uploadNewFile(newFile)
    }
  };

  const uploadNewFile = async (newFile) => {
    const formData = {
        'email': user.email,
        'filename': newFile.name
    };
    try {
        const response = await client.addFile(formData);
        const presignedUrl = response.presignedUrl;

        console.log(presignedUrl)

        const uploadSuccessful = await client.uploadFileToS3(presignedUrl, newFile);

        if (uploadSuccessful) {
            setFiles(prevFiles => [...prevFiles, {
                fileid: response.fileId,
                filename: response.filename
            }]);
            console.log('File uploaded successfully');
        }
    } catch (err) {
        setError('Failed to upload file. Please try again.');
        console.error('Upload error:', err);
    }
};



  const handleRename = async (fileid, currentName) => {
    const newName = prompt('Enter new name:', currentName);
    if (newName && newName !== currentName) {
        const token = {
            "email": user.email,
            "fileid": fileid,
            "newfilename": newName
        };
        try {
            const response = await client.renameFile(token);
            setFiles(prevFiles => prevFiles.map(file => 
                file.fileid === fileid ? { ...file, filename: newName } : file
            ));
        } catch (error) {
            console.error('Rename error:', error);
        }
    }
  };

  const handleDelete = async (fileid) => {
    const token = {
        'email': user.email,
        'fileid': fileid,
        'manipulate': 'delete'
    };
    try {
        const response = await client.manipulateFile(token);
        setFiles(files => files.filter(file => file.fileid !== fileid));
    } catch (error) {
        console.error('Delete error:', error);
        setError('Failed to delete file. Please try again.');
    }
};

const handleDownload = async (fileid) => {
  const token = {
      'email': user.email,
      'fileid': fileid,
      'manipulate': 'download'
  };
  try {
      const response = await client.manipulateFile(token);
      console.log('Download URL:', response.presignedUrl);
      window.open(response.presignedUrl, '_blank');
  } catch (error) {
      console.error('Download error:', error.response ? error.response.data : error);
      setError('Failed to download file. Please try again.');
  }
};



const handleDuplicate = async (fileid) => {
  const token = {
      'email': user.email,
      'fileid': fileid,
      'manipulate': 'duplicate'
  };
  try {
      const responseData = await client.manipulateFile(token);

      if (responseData && responseData.newFileId) {
          // Add the new file information to the state
          setFiles(prevFiles => [...prevFiles, {
              fileid: responseData.newFileId,
              filename: responseData.message.split(' as ')[1]
          }]);
      } else {
          setError('Failed to duplicate file. Please try again.');
          console.error('Duplicate error:', responseData);
      }
  } catch (error) {
      console.error('Duplicate error:', error);
      setError('Failed to duplicate file. Please try again.');
  }
};






  if(!user.email){
        return (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4 h-[600px] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">My Files</h1>
            </div>
            <h1 className="text-2xl font-bold">Start Logging In to Manage Your Files</h1>
            <div className="bg-gray-200 p-4 rounded-lg shadow-md mt-10 mb-4 h-[400px] overflow-auto">
              <ul>
                {files.map(file => (
                  <div className="bg-gray-300 p-1 rounded-lg shadow-md mt-3 mb-1 h-[50px]">
                  <li key={file.fileid} className="flex justify-between items-center mb-2 p-2 border-b border-gray-300">
                    <span>{file.filename}</span>
                    <div className="flex space-x-4">
                      <div className="group relative">
                        <FontAwesomeIcon
                          icon={faEdit}
                          className="text-blue-500 cursor-pointer hover:text-blue-700"
                        />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                          Rename
                        </div>
                      </div>
                      <div className="group relative">
                        <FontAwesomeIcon
                          icon={faDownload}
                          className="text-green-500 cursor-pointer hover:text-green-700"
                        />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                          Download
                        </div>
                      </div>
                      <div className="group relative">
                        <FontAwesomeIcon
                          icon={faCopy}
                          className="text-yellow-500 cursor-pointer hover:text-yellow-700"
                        />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                          Duplicate
                        </div>
                      </div>
                      <div className="group relative">
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-red-500 cursor-pointer hover:text-red-700"
                        />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                          Delete
                        </div>
                      </div>
                    </div>
                  </li>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        );
  }

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
      <div className="sticky top-0 z-10 bg-gray-100 p-3 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">My Files</h1>
          <label className="bg-[#E1FF6A] text-[#18202C] px-4 py-2 rounded-full font-bold uppercase tracking-widest transition-all duration-300 hover:bg-opacity-80 hover:scale-105 cursor-pointer">
            Upload
            <input type="file" onChange={handleUpload} className="hidden" />
          </label>
        </div>
      </div>
      <ul className="overflow-auto h-[500px]">  {/* Adjust height as needed */}
        {files.map(file => (
          <div className="bg-gray-300 p-1 rounded-lg shadow-md mt-2 mb-1 h-[50px]">
          <li key={file.fileid} className="flex justify-between items-center mb-2 p-2 border-b border-gray-300">
            <span>{file.filename}</span>
            <div className="flex space-x-4">
              <div className="group relative">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="text-blue-500 cursor-pointer hover:text-blue-700"
                  onClick={() => handleRename(file.fileid, file.filename)}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                  Rename
                </div>
              </div>
              <div className="group relative">
                <FontAwesomeIcon
                  icon={faDownload}
                  className="text-green-500 cursor-pointer hover:text-green-700"
                  onClick={() => handleDownload(file.fileid)}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                  Download
                </div>
              </div>
              <div className="group relative">
                <FontAwesomeIcon
                  icon={faCopy}
                  className="text-yellow-500 cursor-pointer hover:text-yellow-700"
                  onClick={() => handleDuplicate(file.fileid)}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                  Duplicate
                </div>
              </div>
              <div className="group relative">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-red-500 cursor-pointer hover:text-red-700"
                  onClick={() => handleDelete(file.fileid)}
                />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
                  Delete
                </div>
              </div>
            </div>
          </li>
          </div>
        ))}
      </ul>
    </div>
  );

};

export default Myfiles;
