import * as client from "../components/client";

export const setUserInfo = (userInfo) => ({
    type: 'SET_USER_INFO',
    payload: userInfo
  });
  
  export const logout = () => ({
    type: 'LOGOUT'
  });
  
  export const registerUser = (credentials) => {
    return async (dispatch) => {
      try {
        const response = await client.signupAccount(credentials);
        const { email, fullname } = response.data;
        dispatch(setUserInfo({ email, fullname }));
      } catch (error) {
        console.error("Registration failed: ", error);
      }
    };
  };
  