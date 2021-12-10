import React from 'react';
import { Navigate } from 'react-router';

export default function PrivateRoute({children}) {
    const auth = sessionStorage.getItem("token");

    return auth? children : <Navigate to="/"/>
}
