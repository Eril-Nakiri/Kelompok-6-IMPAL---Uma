import Navbar from "../components/Navbar";
import { useState } from "react";
import "../../css/Stat.css";

export default function StatsPage() {
    const [filters, setFilters] = useState({
        eventSeries: "All",
        region: "All",
        minRounds: "",
        minRating: "",
        agent: "All",
        map: "All",
        timespan: "Past 60 Days"
    });

    const handleChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleApply = () => {
        console.log("FILTER APPLIED:", filters);
    };

    return (
        <>
        <Navbar />
        <div className="page-container">
        <div className="stats-container">

            {/* FILTER SECTION */}
            <div className="filter-box">

                <div className="filter-group">
                    <label>Event Series</label>
                    <select name="eventSeries" onChange={handleChange}>
                        <option>All</option>
                    </select>
                </div>

                <div className="filter-row">
                    <div className="filter-group">
                        <label>Region</label>
                        <select name="region" onChange={handleChange}>
                            <option>All</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>MIN # RNDS</label>
                        <input
                            name="minRounds"
                            type="number"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="filter-group">
                        <label>MIN OOP RATING</label>
                        <input
                            name="minRating"
                            type="number"
                            step="0.1"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="filter-group">
                        <label>AGENT</label>
                        <select name="agent" onChange={handleChange}>
                            <option>All</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>MAP</label>
                        <select name="map" onChange={handleChange}>
                            <option>All</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>TIMESPAN</label>
                        <select name="timespan" onChange={handleChange}>
                            <option>Past 60 Days</option>
                        </select>
                    </div>
                </div>

                <button className="apply-btn" onClick={handleApply}>
                    Apply
                </button>

            </div>

            {/* TABLE SECTION */}
            <div className="table-box">

                <table>
                    <thead>
                        <tr>
                            <th>Player</th>
                            <th>Team</th>
                            <th>Rounds</th>
                            <th>KD</th>
                            <th>ACS</th>
                            <th>Rating</th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* Dummy Data */}
                        <tr>
                            <td>felixgunawan</td>
                            <td>TEAM A</td>
                            <td>422</td>
                            <td>1.33</td>
                            <td>244.5</td>
                            <td>1.40</td>
                        </tr>

                        <tr>
                            <td>ditya</td>
                            <td>TEAM B</td>
                            <td>300</td>
                            <td>1.20</td>
                            <td>210.1</td>
                            <td>1.32</td>
                        </tr>

                    </tbody>
                </table>

            </div>

        </div>
        </div>
        </>
    );
}
