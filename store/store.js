import {configureStore} from '@reduxjs/toolkit';
import siteReducer from './slices/siteSlice';

export const store = configureStore({
  reducer: {
    site: siteReducer,
  },
});
