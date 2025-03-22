
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, } from '@reduxjs/toolkit';

interface UserState {
    currentUser: any;
    loading: boolean;
    error: string | null;
    userLogged: boolean;
}

const initialState: UserState = {
    currentUser: null,
    loading: false,
    error: null,
    userLogged: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

        loginUser: (state) => {
            state.userLogged = true;
        },
        logoutUser: (state) => {
            state.userLogged = false;
            state.currentUser = null;
        }
    },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
