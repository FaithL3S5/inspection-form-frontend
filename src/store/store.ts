import { configureStore } from "@reduxjs/toolkit";
import fileDropReducer from "../components/FileDropZone/fileDropSlice";

export const store = configureStore({
  reducer: {
    fileDrop: fileDropReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
