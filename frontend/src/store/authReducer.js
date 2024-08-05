// src/store/authReducer.js
const initialState = {
    email: null,
    fullname: null
  };
  
  function authReducer(state = initialState, action) {
    switch (action.type) {
      case 'SET_USER_INFO':
        return {
          ...state,
          email: action.payload.email,
          fullname: action.payload.fullname
        };
      case 'LOGOUT':
        return {
          ...initialState
        };
      default:
        return state;
    }
  }
  
  export default authReducer;
  