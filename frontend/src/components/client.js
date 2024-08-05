import axios from "axios";

export const BASE_API = process.env.REACT_APP_BASE_API_URL;

export const AUTH_API = `${BASE_API}`;

const request = axios.create({
    baseURL: BASE_API,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const testAccount = async (token) => {
    const response = await request.post( `${AUTH_API}/test`, token);
    
    return response.data;
};

export const loginAccount = async (token) => {
    const response = await request.post( `${AUTH_API}/login`, token );
    return response.data;
};

export const signupAccount = async (token) => {
    console.log(token)
    const response = await request.post( `${AUTH_API}/signup` , token);
    return response.data;
};

export const getFile = async (token) => {
    console.log(token)
    // token = {"email" : email}
    // we'll get all the filenames under this email
    const response = await request.post( `${AUTH_API}/getfile` , token);
    return response.data;
};

export const addFile = async (formData) => {
    // token = {"email" : email, "filename" : filename}
    // you add the file with the given name under this email
    console.log(formData)
    const response = await axios.post(`${AUTH_API}/addfile`, formData);
    return response.data;
};

export const uploadFileToS3 = async (presignedUrl, file) => {
    // Upload the file to the S3 bucket using the pre-signed URL
    const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,  // Ensure the actual file is passed here
        headers: {
            'Content-Type': 'application/octet-stream'  // Adjust based on backend requirements
        }
    });

    if (!uploadResponse.ok) {
        throw new Error('Failed to upload file.');
    }

    // If successful, return some status or data as needed
    return uploadResponse.ok;
};

export const previewFile = async (token) => {
    console.log(token)
    // token = {"email" : email, "filename" : filename}
    // you'll get the contents of the file to display as clicked.
    const response = await request.post( `${AUTH_API}/previewfile` , token);
    return response.data;
};

export const renameFile = async (token) => {
    console.log(token)
    // token = {"email" : email, "fileid" : fileid, "newfilename" : newfilename}
    // you'll get the contents of the file to display as clicked.
    const response = await request.post( `${AUTH_API}/renamefiles` , token);
    return response.data;
};

export const manipulateFile = async (token) => {
    console.log(token)
    // token = {"email" : email, "fileid" : fileid}
    // you'll get the contents of the file to display as clicked.
    const response = await request.post( `${AUTH_API}/manipulatefile` , token);
    return response.data;
};