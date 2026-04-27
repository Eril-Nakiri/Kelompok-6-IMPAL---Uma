import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Dashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/dashboard")
        .then(res => res.json())
        .then(result => setData(result))
        .catch(err => console.error(err));
    }, []);

    return (
        <div>
        <Navbar />

        <div style={{ padding: "40px", color: "white" }}>
            <h1>Dashboard</h1>

            {!data ? (
            <p>Connecting to Laravel...</p>
            ) : (
            <div>
                <h2>{data.app}</h2>
                <p>{data.status}</p>
                <p>Version: {data.version}</p>
            </div>
            )}
        </div>
        </div>
    );
}
