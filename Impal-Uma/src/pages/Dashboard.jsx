import Navbar from "../components/Navbar";

export default function Dashboard() {
  return (
    <div className="dashboard">
      <Navbar />

      <div className="dashboard-container">

        {/* LEFT SIDE */}
        <div className="left-panel">

          {/* HERO */}
          <div className="hero-card">
            <img
              src="https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt8bb3cbb3a85b7a76/65a76e5f2c8b2036d6b8a5a4/VALORANT_Episode8_KeyArt_3840x2160.jpg"
              alt="hero"
            />
            <div className="hero-title">Latest Esports News</div>
          </div>

          {/* NEWS LIST */}
          <div className="news-list">
            <div className="news-item">DRX calls academy player "young" to main roster</div>
            <div className="news-item">MIBR Statement</div>
            <div className="news-item">Nongshim Red Force make a legendary history</div>
            <div className="news-item">Paper Rex dominates NRG</div>
            <div className="news-item">FunPlus Phoenix sign "Scary" to the squad</div>
            <div className="news-item">Tenz retirement rumor</div>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="right-panel">

          <div className="sidebar-card">
            <h3>Upcoming Match</h3>
            <div className="match">FNATIC vs PRX</div>
            <div className="match">NRG vs LOUD</div>
            <div className="match">DRX vs C9</div>
            <div className="match">SEN vs NAVI</div>
          </div>

          <div className="sidebar-card">
            <h3>Live Event</h3>
            <div className="event">Masters Shanghai</div>
            <div className="event">VCT Korea</div>
          </div>

        </div>

      </div>
    </div>
  );
}