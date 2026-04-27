import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function AboutPage() {
    return (
        <div className="page">
        <Navbar />
        <h1>About</h1>
        <p>This is META portal project.</p>
        </div>
    );

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
