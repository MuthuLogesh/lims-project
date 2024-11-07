import { configureStore } from '@reduxjs/toolkit';
import laboratoryReducer from './reducer';

// Configure the store
const store = configureStore({
    reducer: {
       data: laboratoryReducer
    }
});

// Define RootState and AppDispatch types for use throughout the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
