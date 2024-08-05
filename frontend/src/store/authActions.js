// src/store/authActions.js

import * as client from "../components/client";

export const setUserInfo = (userInfo) => ({
    type: 'SET_USER_INFO',
    payload: userInfo
  });
  
  export const logout = () => ({
    type: 'LOGOUT'
  });
  
  // Async action example using thunk
  export const registerUser = (credentials) => {
    return async (dispatch) => {
      try {
        // This assumes `client.signupAccount()` is a function that signs up the user
        // and returns their email and fullname among other details.
        const response = await client.signupAccount(credentials);
        const { email, fullname } = response.data;
        dispatch(setUserInfo({ email, fullname }));
      } catch (error) {
        console.error("Registration failed: ", error);
        // Handle error appropriately
      }
    };
  };
  