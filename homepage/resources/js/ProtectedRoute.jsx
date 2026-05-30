import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRoles }) {
    const userString = localStorage.getItem("user");

    // 1. Debug: Lihat data mentah
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
        // Jika gagal parse, anggap tidak login
        return <Navigate to="/login" replace />;
    }

    // 2. Debug: Pastikan id_role ada
    console.log("User ID Role:", user.id_role);

    // 3. Cek Role
    if (allowedRoles && !allowedRoles.includes(user.id_role)) {
        console.log("Role tidak sesuai, akses ditolak.");
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}
