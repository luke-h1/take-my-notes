import React, { useReducer } from 'react';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import UserContext from './userContext';
import userReducer from './userReducer';
import setAuthToken from '../../utils/setAuthToken';
import {
  USER_DETAILS_FAIL,
  USER_DETAILS_REQUEST,
  USER_DETAILS_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_LOADED,
  USER_REGISTER_FAIL,
  USER_REGISTER_REQUEST,
  USER_REGISTER_SUCCESS,
  USER_UPDATE_PROFILE_FAIL,
  USER_UPDATE_PROFILE_REQUEST,
  USER_UPDATE_PROFILE_SUCCESS,
  USER_DETAILS_RESET,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_RESET,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_DELETE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
  USER_UPDATE_FAIL,
  CLEAR_ERRORS,
} from '../constants/userConstants';

const UserState = ({ children }) => {
  const initialState = {
    user: null,
    users: [],
    userList: [],
    loading: false,
    error: null,
    isAuth: null,
  };

  const [state, dispatch] = useReducer(userReducer, initialState);

  const login = async (email, password) => {
    try {
      dispatch({
        type: USER_LOGIN_REQUEST,
      });
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        'http://localhost:5000/api/users/login',
        { email, password },
        config,
      );

      dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    } catch (e) {
      dispatch({
        type: USER_LOGIN_FAIL,
        payload:
          e.response && e.response.data.message
            ? e.response.data.message
            : e.message,
      });
    }
  };

  const authUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get('http://localhost:5000/api/users/auth');
      dispatch({ type: USER_LOADED, payload: res.data }); // USER DATA
    } catch (err) {
      console.log(err);
      dispatch({ type: USER_LOGIN_FAIL });
    }
  };

  const logout = async () => {
    localStorage.removeItem('user');
    dispatch({ type: USER_LOGOUT });
    dispatch({ type: USER_DETAILS_RESET });
    dispatch({ type: USER_LIST_RESET });
  };

  return (
    <UserContext.Provider
      value={{
        userInfo: state.userInfo,
        userDetails: state.userDetails,
        users: state.users,
        userList: state.userList,
        loading: state.loading,
        error: state.error,
        isAuth: state.isAuth,
        login,
        logout,
        authUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserState;
