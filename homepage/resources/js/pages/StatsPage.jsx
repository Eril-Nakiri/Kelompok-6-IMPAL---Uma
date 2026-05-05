import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
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
        const params = new URLSearchParams(filters).toString();
        fetch(`http://127.0.0.1:8000/api/stats?${params}`)
            .then(res => res.json())
            .then(data => {
                console.log("STATS:", data);
                setStats(data.data || []);
            })
            .catch(err => console.error(err));
    };

    const [stats, setStats] = useState([]);
    const [agents, setAgents] = useState([]);
    const [maps, setMaps] = useState([]);
    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/stats/filters")
            .then(res => res.json())
            .then(data => {
                console.log("FILTER DATA:", data);
                setAgents(data.agents || []);
                setMaps(data.maps || []);
            });
    }, []);

    console.log("STATS:", stats);

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
                            <option value="All">All</option>
                            {agents.map((agent, index) => (
                                <option key={index} value={agent}>
                                    {agent}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>MAP</label>
                        <select name="map" onChange={handleChange}>
                            <option value="All">All</option>
                            {maps.map((map, index) => (
                                <option key={index} value={map}>
                                    {map}
                                </option>
                            ))}
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
                    <tr>
                        <th>User</th>
                        <th>Agent</th>
                        <th>Kills</th>
                        <th>Deaths</th>
                        <th>Assists</th>
                        <th>KD</th>
                        <th>ACS</th>
                    </tr>

                    <tbody>
                        {stats.length > 0 ? (
                            stats.map((row, index) => (
                                <tr key={index}>
                                    <td>User {row.id_user}</td>
                                    <td>{row.agent_used}</td>
                                    <td>{row.kills}</td>
                                    <td>{row.deaths}</td>
                                    <td>{row.assists}</td>
                                    <td>{row.kd}</td>
                                    <td>{row.acs}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">No Data</td>
                            </tr>
                        )}
                    </tbody>
                </table>

            </div>

        </div>
        </div>
        </>
    );
}
