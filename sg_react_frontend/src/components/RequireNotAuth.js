import React from 'react'
import { Navigate, Outlet } from "react-router-dom";

import { AuthContext } from '../contexts/AuthContextProvider';

export default function RequireNotAuth() {

    const { isAuthenticated } = React.useContext(AuthContext);

    if (isAuthenticated === null) {
        return <div>Loading...</div>
    }

    if (isAuthenticated === true) {
        return <Navigate to="/watchlists" />
    }

    return (
        <Outlet />
    )
}