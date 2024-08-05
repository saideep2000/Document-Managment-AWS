// src/store/index.js
import { createStore, applyMiddleware, combineReducers } from 'redux';
import {thunk} from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import authReducer from './authReducer';

const rootReducer = combineReducers({
  auth: authReducer
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth']  // Only persist the auth reducer
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(persistedReducer, applyMiddleware(thunk));
const persistor = persistStore(store);

export { store, persistor };
