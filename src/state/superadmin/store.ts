import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import businessesSlice from './slices/businessesSlice';
import templatesSlice from './slices/templatesSlice';
import analyticsSlice from './slices/analyticsSlice';
import plansSlice from './slices/plansSlice';
import logsSlice from './slices/logsSlice';

export const superadminStore = configureStore({
  reducer: {
    auth: authSlice,
    businesses: businessesSlice,
    templates: templatesSlice,
    analytics: analyticsSlice,
    plans: plansSlice,
    logs: logsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type SuperAdminRootState = ReturnType<typeof superadminStore.getState>;
export type SuperAdminAppDispatch = typeof superadminStore.dispatch;
