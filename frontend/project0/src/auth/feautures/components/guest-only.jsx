import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const GuestOnly = ({ children }) => {
    const user = useSelector((state) => state.auth.user);
    const loading = useSelector((state) => state.auth.loading);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default GuestOnly;
