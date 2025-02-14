import { configureStore } from '@reduxjs/toolkit'
import diagramReducer from "../features/diagram/diagramSlice"
import youtubeListReducer from '../features/youtubeList/youtubeListSlice'
import savedDiagramReducer from "../features/savedDiagram/savedDiagramSlice"
import authReducer from "../features/auth/authSlice"

export const store = configureStore({
  reducer: {
    diagram: diagramReducer,
    savedDiagram: savedDiagramReducer,
    youtubeList: youtubeListReducer,
    auth: authReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch