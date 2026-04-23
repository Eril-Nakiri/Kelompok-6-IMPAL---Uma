import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="navbar">
      
      {/* LOGO → ke dashboard */}
      <Link to="/dashboard" className="logo">
        META
      </Link>

      <div className="nav-right">
        <div className="menu">
          <Link to="/dashboard">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/stats">Stats</Link>
        </div>

        <input className="search" placeholder="Search..." />
      </div>

    </div>
  );
}