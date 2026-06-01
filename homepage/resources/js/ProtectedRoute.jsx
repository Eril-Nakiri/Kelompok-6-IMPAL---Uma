import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
    const userString = localStorage.getItem("user");

    console.log("Raw userString dari localStorage:", userString);

    if (!userString) {
        console.log("Error: userString kosong/null");
        return <Navigate to="/login" replace />;
    }

    let user;
    try {
        user = JSON.parse(userString);
        console.log("Data berhasil diparse:", user);
    } catch (e) {
        console.error("Error parsing JSON:", e);
        return <Navigate to="/login" replace />;
    }

    console.log("User ID Role:", user.id_role);

    if (allowedRoles && !allowedRoles.includes(user.id_role)) {
        console.log("Role tidak sesuai, akses ditolak.");
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
