import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

// Auth actions
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  RESTORE_TOKEN: 'RESTORE_TOKEN',
  SIGNUP_START: 'SIGNUP_START',
  SIGNUP_SUCCESS: 'SIGNUP_SUCCESS',
  SIGNUP_FAILURE: 'SIGNUP_FAILURE',
};

// Initial state
const initialState = {
  isLoading: true,
  isAuthenticated: false,
  user: null,
  error: null,
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.SIGNUP_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.SIGNUP_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload.user,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.SIGNUP_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload.error,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case AUTH_ACTIONS.RESTORE_TOKEN:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: action.payload.user ? true : false,
        user: action.payload.user,
      };
    default:
      return state;
  }
};

// Storage keys
const STORAGE_KEYS = {
  USER_TOKEN: '@user_token',
  USER_DATA: '@user_data',
  USERS_DB: '@users_db',
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore authentication state on app start
  useEffect(() => {
    const restoreToken = async () => {
      try {
        const userToken = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
        const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
        
        if (userToken && userData) {
          const user = JSON.parse(userData);
          dispatch({
            type: AUTH_ACTIONS.RESTORE_TOKEN,
            payload: { user },
          });
        } else {
          dispatch({
            type: AUTH_ACTIONS.RESTORE_TOKEN,
            payload: { user: null },
          });
        }
      } catch (error) {
        console.error('Error restoring token:', error);
        dispatch({
          type: AUTH_ACTIONS.RESTORE_TOKEN,
          payload: { user: null },
        });
      }
    };

    restoreToken();
  }, []);

  // Get users database from AsyncStorage
  const getUsersDB = async () => {
    try {
      const usersDB = await AsyncStorage.getItem(STORAGE_KEYS.USERS_DB);
      return usersDB ? JSON.parse(usersDB) : [];
    } catch (error) {
      console.error('Error getting users DB:', error);
      return [];
    }
  };

  // Save users database to AsyncStorage
  const saveUsersDB = async (users) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users DB:', error);
    }
  };

  // Sign up function
  const signUp = async (email, password, name) => {
    dispatch({ type: AUTH_ACTIONS.SIGNUP_START });

    try {
      // Basic validation
      if (!email || !password || !name) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }

      // Get existing users
      const users = await getUsersDB();

      // Check if user already exists
      const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        name,
        password, // In a real app, this should be hashed
        createdAt: new Date().toISOString(),
      };

      // Add to users database
      users.push(newUser);
      await saveUsersDB(users);

      // Create user session
      const userToken = `token_${newUser.id}`;
      const userData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      };

      // Save session data
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, userToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

      dispatch({
        type: AUTH_ACTIONS.SIGNUP_SUCCESS,
        payload: { user: userData },
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.SIGNUP_FAILURE,
        payload: { error: error.message },
      });
      return { success: false, error: error.message };
    }
  };

  // Sign in function
  const signIn = async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      // Basic validation
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      // Get existing users
      const users = await getUsersDB();

      // Find user
      const user = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Create user session
      const userToken = `token_${user.id}`;
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      // Save session data
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, userToken);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));

      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user: userData },
      });

      return { success: true };
    } catch (error) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: error.message },
      });
      return { success: false, error: error.message };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // Remove session data
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);

      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    ...state,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
