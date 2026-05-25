import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
    const userString = localStorage.getItem("user");

    // DEBUGGING: Lihat apa isi localStorage di console browser
    console.log("ProtectedRoute - userString dari localStorage:", userString);

    const user = userString ? JSON.parse(userString) : null;

    if (!user) {
        console.log("ProtectedRoute - User tidak ditemukan, redirect ke login.");
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.id_role)) {
        console.log("ProtectedRoute - Role tidak sesuai, redirect ke dashboard.");
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
