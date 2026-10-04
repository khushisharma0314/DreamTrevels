import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {
    return children ? children : <Outlet />;
}

export default ProtectedRoute;