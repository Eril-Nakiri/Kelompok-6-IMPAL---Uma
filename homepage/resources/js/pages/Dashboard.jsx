import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function Dashboard() {
    // --- MOCK DATA: Nanti diganti dengan fetch API dari Laravel ---
    const mainEvents = [
        {
            id: 1,
            title: "VALORANT Champions 2024",
            prize: "$2,250,000",
            location: "Seoul",
            type: "Offline",
            dates: "Aug 1 - 25, 2024",
            status: "Completed",
            logo: "🏆" // Bisa diganti <img> tag nantinya
        },
        {
            id: 2,
            title: "VCT 2024: Ascension Pacific",
            prize: "$100,000",
            location: "Jakarta",
            type: "Offline",
            dates: "Sep 20 - 29, 2024",
            status: "Completed",
            logo: "🌏"
        },
        {
            id: 3,
            title: "VCT 2024: Ascension EMEA",
            prize: "$100,000",
            location: "Monterrey",
            type: "Offline",
            dates: "Aug 31 - Sep 15, 2024",
            status: "Completed",
            logo: "🌍"
        },
        {
            id: 4,
            title: "VCT 2024: Ascension Americas",
            prize: "$100,000",
            location: "Monterrey",
            type: "Offline",
            dates: "Sep 9 - 21, 2024",
            status: "Completed",
            logo: "🌎"
        }
    ];

    const upcomingEvents = [
        { id: 1, title: "VALORANT Radiant Asia Invitational", date: "Nov 21" },
        { id: 2, title: "Red Bull Home Ground #5 - APAC", date: "Oct 19" },
    ];

    const recentEvents = [
        { id: 1, title: "VCT 2024: Ascension Pacific", winner: "Sin Prisa Gaming" },
        { id: 2, title: "Red Bull Home Ground #5", winner: "T1" },
    ];

    return (
        <div className="min-h-screen bg-[#f3f3f3] font-sans text-[#333]">
            <Navbar />

            {/* SUB-NAVBAR (TABS MENU) */}
            <div className="bg-white border-b border-gray-300 shadow-sm text-xs md:text-sm">
                <div className="max-w-6xl mx-auto px-4 flex flex-wrap gap-4 py-3 font-medium text-gray-500">
                    <span className="text-red-600 border-b-2 border-red-600 pb-1 cursor-pointer">featured</span>
                    <span className="hover:text-black cursor-pointer pb-1">recent</span>
                    <span className="hover:text-black cursor-pointer pb-1">main events</span>
                    <span className="hover:text-black cursor-pointer pb-1">upcoming</span>
                    <span className="hover:text-black cursor-pointer pb-1">regional</span>
                    <span className="hover:text-black cursor-pointer pb-1">gameplay</span>
                    <span className="hover:text-black cursor-pointer pb-1">fantasy</span>
                </div>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">

                {/* KIRI: DAFTAR EVENTS UTAMA (70% WIDHT) */}
                <div className="w-full md:w-[70%]">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Events</h1>
                        <div className="flex gap-2">
                            <select className="border border-gray-300 rounded px-2 py-1 text-sm bg-white outline-none">
                                <option>Events</option>
                            </select>
                            <button className="bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded px-4 py-1 text-sm">
                                Search
                            </button>
                        </div>
                    </div>

                    {/* EVENT CARDS */}
                    <div className="flex flex-col gap-3">
                        {mainEvents.map((ev) => (
                            <div key={ev.id} className="bg-white border border-gray-200 rounded hover:shadow-md transition-shadow flex overflow-hidden">
                                {/* Logo Area */}
                                <div className="w-24 bg-gray-50 flex items-center justify-center text-4xl border-r border-gray-100">
                                    {ev.logo}
                                </div>

                                {/* Info Area */}
                                <div className="flex-1 p-4 relative">
                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4">
                                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded font-semibold">
                                            {ev.status}
                                        </span>
                                    </div>

                                    <h3 className="font-bold text-lg text-black mb-1">{ev.title}</h3>
                                    <div className="text-sm font-semibold text-gray-700 mb-3">{ev.prize}</div>

                                    <div className="flex items-center text-xs text-gray-500 gap-4 mt-2">
                                        <div className="flex items-center gap-1">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                            {ev.location} • {ev.type}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>📅 {ev.dates}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KANAN: SIDEBAR (30% WIDTH) */}
                <div className="w-full md:w-[30%]">

                    {/* Sidebar Tabs */}
                    <div className="flex mb-4 text-sm font-bold text-gray-400 border-b border-gray-300">
                        <span className="text-red-600 border-b-2 border-red-600 pb-2 px-2 cursor-pointer">featured</span>
                        <span className="hover:text-black pb-2 px-2 cursor-pointer">all</span>
                    </div>

                    {/* Upcoming Events Module */}
                    <div className="mb-6">
                        <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                            Upcoming Valorant Events
                        </h4>
                        <div className="bg-white border border-gray-200 rounded">
                            {upcomingEvents.map((ev) => (
                                <div key={ev.id} className="border-b border-gray-100 p-3 hover:bg-gray-50 flex justify-between items-center cursor-pointer">
                                    <span className="text-sm font-semibold text-black truncate pr-4">{ev.title}</span>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">{ev.date}</span>
                                </div>
                            ))}
                            <div className="p-2 text-center border-t border-gray-200">
                                <a href="#" className="text-xs text-blue-600 hover:underline">View all upcoming events</a>
                            </div>
                        </div>
                    </div>

                    {/* Recent Events Module */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                            Recent Valorant Events
                        </h4>
                        <div className="bg-white border border-gray-200 rounded">
                            {recentEvents.map((ev) => (
                                <div key={ev.id} className="border-b border-gray-100 p-3 hover:bg-gray-50 flex justify-between items-center cursor-pointer">
                                    <span className="text-sm font-semibold text-black truncate pr-2">{ev.title}</span>
                                    <span className="text-xs text-gray-500 whitespace-nowrap">{ev.winner}</span>
                                </div>
                            ))}
                            <div className="p-2 text-center border-t border-gray-200">
                                <a href="#" className="text-xs text-blue-600 hover:underline">View all completed events</a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
