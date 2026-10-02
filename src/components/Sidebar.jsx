import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-title">
        EV MANAGEMENT
      </div>

      <NavLink
        to="/dashboard"
        className="sidebar-link"
      >
        🏠 Dashboard
      </NavLink>

      <NavLink
        to="/dashboard/book"
        className="sidebar-link"
      >
        ⚡ Book Charging
      </NavLink>

      <NavLink
        to="/dashboard/bookings"
        className="sidebar-link"
      >
        📅 My Bookings
      </NavLink>

      <NavLink
        to="/dashboard/history"
        className="sidebar-link"
      >
        📊 Charging History
      </NavLink>

      <NavLink
        to="/dashboard/profile"
        className="sidebar-link"
      >
        👤 Profile
      </NavLink>

    </aside>
  );
}

export default Sidebar;