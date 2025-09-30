import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DataContext = createContext();

// Data actions
const DATA_ACTIONS = {
  LOAD_DATA: 'LOAD_DATA',
  ADD_SESSION: 'ADD_SESSION',
  UPDATE_SESSION: 'UPDATE_SESSION',
  DELETE_SESSION: 'DELETE_SESSION',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

// Initial state
const initialState = {
  sessions: [], // Array of timer sessions
  isLoading: false,
  error: null,
};

// Data reducer
const dataReducer = (state, action) => {
  switch (action.type) {
    case DATA_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case DATA_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case DATA_ACTIONS.LOAD_DATA:
      return {
        ...state,
        sessions: action.payload.sessions,
        isLoading: false,
        error: null,
      };
    case DATA_ACTIONS.ADD_SESSION:
      return {
        ...state,
        sessions: [...state.sessions, action.payload.session],
      };
    case DATA_ACTIONS.UPDATE_SESSION:
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload.sessionId
            ? { ...session, ...action.payload.updates }
            : session
        ),
      };
    case DATA_ACTIONS.DELETE_SESSION:
      return {
        ...state,
        sessions: state.sessions.filter(session => session.id !== action.payload.sessionId),
      };
    default:
      return state;
  }
};

// Storage key for app data
const APP_DATA_KEY = '@app_data';

export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Load app data when component mounts
  useEffect(() => {
    loadAppData();
  }, []);

  // Load app data from AsyncStorage
  const loadAppData = async () => {
    try {
      dispatch({ type: DATA_ACTIONS.SET_LOADING, payload: true });
      
      const appData = await AsyncStorage.getItem(APP_DATA_KEY);
      
      if (appData) {
        const parsedData = JSON.parse(appData);
        dispatch({
          type: DATA_ACTIONS.LOAD_DATA,
          payload: { sessions: parsedData.sessions || [] },
        });
      } else {
        // Initialize empty data for first time use
        dispatch({
          type: DATA_ACTIONS.LOAD_DATA,
          payload: { sessions: [] },
        });
      }
    } catch (error) {
      console.error('Error loading app data:', error);
      dispatch({
        type: DATA_ACTIONS.SET_ERROR,
        payload: 'Failed to load app data',
      });
    }
  };

  // Save app data to AsyncStorage
  const saveAppData = async (data) => {
    try {
      await AsyncStorage.setItem(APP_DATA_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving app data:', error);
      throw error;
    }
  };

  // Add a new timer session
  const addSession = async (sessionData) => {
    try {
      const newSession = {
        id: Date.now().toString(),
        startTime: sessionData.startTime,
        endTime: sessionData.endTime,
        duration: sessionData.duration,
        date: sessionData.date || new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        createdAt: new Date().toISOString(),
      };

      dispatch({
        type: DATA_ACTIONS.ADD_SESSION,
        payload: { session: newSession },
      });

      // Save to storage
      const updatedSessions = [...state.sessions, newSession];
      await saveAppData({ sessions: updatedSessions });

      return newSession;
    } catch (error) {
      console.error('Error adding session:', error);
      dispatch({
        type: DATA_ACTIONS.SET_ERROR,
        payload: 'Failed to save session',
      });
      throw error;
    }
  };

  // Update an existing session
  const updateSession = async (sessionId, updates) => {
    try {
      dispatch({
        type: DATA_ACTIONS.UPDATE_SESSION,
        payload: { sessionId, updates },
      });

      // Save to storage
      const updatedSessions = state.sessions.map(session =>
        session.id === sessionId ? { ...session, ...updates } : session
      );
      await saveAppData({ sessions: updatedSessions });
    } catch (error) {
      console.error('Error updating session:', error);
      dispatch({
        type: DATA_ACTIONS.SET_ERROR,
        payload: 'Failed to update session',
      });
      throw error;
    }
  };

  // Delete a session
  const deleteSession = async (sessionId) => {
    try {
      dispatch({
        type: DATA_ACTIONS.DELETE_SESSION,
        payload: { sessionId },
      });

      // Save to storage
      const updatedSessions = state.sessions.filter(session => session.id !== sessionId);
      await saveAppData({ sessions: updatedSessions });
    } catch (error) {
      console.error('Error deleting session:', error);
      dispatch({
        type: DATA_ACTIONS.SET_ERROR,
        payload: 'Failed to delete session',
      });
      throw error;
    }
  };

  // Get sessions for a specific date
  const getSessionsByDate = (date) => {
    return state.sessions.filter(session => session.date === date);
  };

  // Get sessions for today
  const getTodaySessions = () => {
    const today = new Date().toISOString().split('T')[0];
    return getSessionsByDate(today);
  };

  // Get total duration for a specific date
  const getTotalDurationForDate = (date) => {
    const sessions = getSessionsByDate(date);
    return sessions.reduce((total, session) => total + session.duration, 0);
  };

  // Get total duration for today
  const getTodayTotalDuration = () => {
    const today = new Date().toISOString().split('T')[0];
    return getTotalDurationForDate(today);
  };

  // Get sessions grouped by date (for history screen)
  const getSessionsGroupedByDate = () => {
    const grouped = {};
    state.sessions.forEach(session => {
      if (!grouped[session.date]) {
        grouped[session.date] = [];
      }
      grouped[session.date].push(session);
    });
    
    // Sort dates in descending order
    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
    
    return sortedDates.map(date => ({
      date,
      sessions: grouped[date].sort((a, b) => new Date(b.startTime) - new Date(a.startTime)),
    }));
  };

  // Get weekly stats for reports
  const getWeeklyStats = () => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay()); // Start of current week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6); // End of current week (Saturday)
    weekEnd.setHours(23, 59, 59, 999);

    const weekSessions = state.sessions.filter(session => {
      const sessionDate = new Date(session.date);
      return sessionDate >= weekStart && sessionDate <= weekEnd;
    });

    const totalDuration = weekSessions.reduce((total, session) => total + session.duration, 0);
    const totalHours = totalDuration / 3600;
    const averageDaily = totalHours / 7;
    const totalSessions = weekSessions.length;

    // Find most productive day
    const dailyTotals = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    weekSessions.forEach(session => {
      const sessionDate = new Date(session.date);
      const dayIndex = sessionDate.getDay();
      const dayName = dayNames[dayIndex];
      
      if (!dailyTotals[dayName]) {
        dailyTotals[dayName] = 0;
      }
      dailyTotals[dayName] += session.duration;
    });

    const mostProductiveDay = Object.keys(dailyTotals).reduce((a, b) => 
      dailyTotals[a] > dailyTotals[b] ? a : b, 'Monday'
    );

    return {
      totalHours: Math.round(totalHours * 10) / 10, // Round to 1 decimal
      averageDaily: Math.round(averageDaily * 10) / 10,
      mostProductiveDay,
      totalSessions,
    };
  };

  // Get activity heatmap data
  const getActivityHeatmapData = () => {
    const weeks = 4; // Show last 4 weeks
    const daysPerWeek = 7;
    const heatmapData = [];

    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - (weeks * daysPerWeek - 1));
    startDate.setHours(0, 0, 0, 0);

    for (let week = 0; week < weeks; week++) {
      const weekData = [];
      for (let day = 0; day < daysPerWeek; day++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (week * daysPerWeek) + day);
        
        const dateString = currentDate.toISOString().split('T')[0];
        const dayDuration = getTotalDurationForDate(dateString);
        
        // Normalize intensity (0-1) based on hours worked
        // 8+ hours = 1.0, 0 hours = 0.0
        const intensity = Math.min(dayDuration / (8 * 3600), 1);
        weekData.push(intensity);
      }
      heatmapData.push(weekData);
    }

    return heatmapData;
  };

  const value = {
    ...state,
    addSession,
    updateSession,
    deleteSession,
    getSessionsByDate,
    getTodaySessions,
    getTotalDurationForDate,
    getTodayTotalDuration,
    getSessionsGroupedByDate,
    getWeeklyStats,
    getActivityHeatmapData,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
