import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function HomePage(){

    const [data, setData] = useState(null);
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            fetch("http://127.0.0.1:8000/api/dashboard")
            .then((res) => res.json())
            .then((result) => {
                setData(result);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
        }, []);

        return (
            <>
            <Navbar />

            <div className="min-h-screen bg-gray-50 py-10 px-4">
                <div className="max-w-5xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-gray-600 mt-2">
                    Sistem Pencatatan dan Manajemen Turnamen
                    </p>
                </div>

                {/* CONTENT */}
                {loading ? (
                    <div className="bg-white shadow-md rounded-2xl p-6 text-center">
                    <p className="text-gray-600">Connecting to Laravel API...</p>
                    </div>
                ) : data ? (
                    <div className="bg-white shadow-md rounded-2xl p-6 text-center">
                    <h2 className="text-xl font-semibold mb-2">
                        {data.app}
                    </h2>
                    <p className="text-gray-600">{data.status}</p>
                    <p className="mt-2 text-sm text-gray-500">
                        Version: {data.version}
                    </p>
                    </div>
                ) : (
                    <div className="bg-red-100 text-red-700 p-4 rounded-xl text-center">
                    Failed to load dashboard data.
                    </div>
                )}

                </div>
            </div>
            </>
        );
}
