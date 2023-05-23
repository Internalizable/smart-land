import React from "react";

export interface User {
    id: string;
    email: string;
    access_token: string;
    admin: boolean;
}

interface IUserContext {
    user: User | null;
    setUser: (user: User | null) => void;
}

const defaultState = {
    user: null,
    setUser: (user: User | null) => {}
};

export const UserContext = React.createContext<IUserContext>(defaultState);
