import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.id_role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
