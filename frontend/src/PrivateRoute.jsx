import React from "react";
import { Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/AuthContext";

const PrivateRoute = ({ element, ...rest }) => {
    const { authUser } = useAuthContext();

    return authUser ? <Route {...rest} element={element} /> : <Navigate to="/login" />;
};

export default PrivateRoute;
