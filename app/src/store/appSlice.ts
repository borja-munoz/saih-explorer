import { createSlice } from '@reduxjs/toolkit';
import { LOCALES } from "../i18n/locales";
import { AppMessage } from '../components/ModalMessage';
import { EntityType, SelectedEntity } from '../components/EntitySelector';

const slice = createSlice({
  name: 'app',
  initialState: {
    error: null,
    locale: LOCALES.ENGLISH,
    modalMessage: null,
    selectedEntity: {
      type: EntityType.Basin,
      id: "1",
      idBasin: 1,
    },
  },
  reducers: {
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLocale: (state, action) => {
      state.locale = action.payload;
    },
    setModalMessage: (state, action) => {
      state.modalMessage = action.payload;
    },
    setSelectedEntity: (state, action) => {
      state.selectedEntity = action.payload;
    },    
  },
});

export default slice.reducer;

export const setError = (payload: string | null) => ({
  type: 'app/setError',
  payload,
});
export const setLocale = (payload: string | null) => ({
  type: 'app/setLocale',
  payload,
});
export const setModalMessage = (payload: AppMessage | null) => ({
  type: 'app/setModalMessage',
  payload,
});
export const setSelectedEntity = (payload: SelectedEntity | null) => ({
  type: 'app/setSelectedEntity',
  payload,
});
