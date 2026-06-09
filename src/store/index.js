import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import assetsReducer from './assetsSlice';

// configurazione dello store globale
// metto insieme tutti gli slice e li espongo all'app tramite il Provider
export const store = configureStore({
    reducer: {
        auth: authReducer,
        assets: assetsReducer,
    },
});