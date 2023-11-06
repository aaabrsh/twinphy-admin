import { Link } from "react-router-dom";

export default function Sidebar({ activeLinks }: { activeLinks: string[] }) {
  return (
    <>
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          {/* Dashboard */}
          <li className="nav-item">
            <Link
              className={`nav-link ${
                activeLinks.includes("dashboard") ? "" : "collapsed"
              }`}
              to="/dashboard"
            >
              <i className="bi bi-grid"></i>
              <span>Dashboard</span>
            </Link>
          </li>

          {/* Users */}
          <li className="nav-item">
            <a
              className={`nav-link ${
                activeLinks.includes("user") ? "" : "collapsed"
              }`}
              data-bs-target="#users-nav"
              data-bs-toggle="collapse"
            >
              <i className="bi bi-people"></i>
              <span>Users</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="users-nav"
              className={`nav-content ${
                activeLinks.includes("user") ? "show" : "collapse"
              }`}
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link
                  to="/user/list"
                  className={`${
                    activeLinks.includes("appUser") ? "active" : ""
                  }`}
                >
                  <i className="bi bi-circle"></i>
                  <span>Users</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/list"
                  className={`${activeLinks.includes("admin") ? "active" : ""}`}
                >
                  <i className="bi bi-circle"></i>
                  <span>Admins</span>
                </Link>
              </li>
            </ul>
          </li>

          {/* Reported Posts */}
          <li className="nav-item">
            <Link
              className={`nav-link ${
                activeLinks.includes("report") ? "" : "collapsed"
              }`}
              to="/report/list"
            >
              <i className="bi bi-flag"></i>
              <span>Reported Posts</span>
            </Link>
          </li>

          {/* <li className="nav-heading">Pages</li> */}
        </ul>
      </aside>
    </>
  );
}
