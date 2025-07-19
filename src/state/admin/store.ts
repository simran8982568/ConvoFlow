import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import campaignsSlice from './slices/campaignsSlice';
import contactsSlice from './slices/contactsSlice';
import templatesSlice from './slices/templatesSlice';
import automationSlice from './slices/automationSlice';
import inboxSlice from './slices/inboxSlice';
import phoneNumbersSlice from './slices/phoneNumbersSlice';
import analyticsSlice from './slices/analyticsSlice';

export const adminStore = configureStore({
  reducer: {
    auth: authSlice,
    campaigns: campaignsSlice,
    contacts: contactsSlice,
    templates: templatesSlice,
    automation: automationSlice,
    inbox: inboxSlice,
    phoneNumbers: phoneNumbersSlice,
    analytics: analyticsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type AdminRootState = ReturnType<typeof adminStore.getState>;
export type AdminAppDispatch = typeof adminStore.dispatch;
