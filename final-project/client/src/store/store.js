import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import * as encrypt from "redux-persist-transform-encrypt"; // Namespace import
import authReducer from "./slices/authSlice"; // Contoh slice Anda
import attendanceReducer from "./slices/attendanceSlice";
import permitReducer from "./slices/permitSlice";

const encryptor = encrypt.encryptTransform({
  // Gunakan 'encryptTransform' dari namespace 'encrypt'
  secretKey: "z135s278d957c426x581", // Gunakan kunci yang aman dan rahasia
  onError: (error) => {
    console.error("Encryption Error", error);
  },
});

const persistConfig = {
  key: "root",
  storage,
  transforms: [encryptor], // Tambahkan transformasi enkripsi di sini
};

const rootReducer = combineReducers({
  auth: authReducer,
  attendance: attendanceReducer,
  permit: permitReducer,
  // tambahkan reducer lain di sini
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"], // Abaikan pengecekan serializable untuk action ini
        ignoredActionPaths: ["register", "rehydrate"], // Abaikan pengecekan serializable untuk properti ini
        ignoredPaths: ["persist"], // Abaikan path yang tidak serializable
      },
    }),
});

export const persistor = persistStore(store);
export default store;
