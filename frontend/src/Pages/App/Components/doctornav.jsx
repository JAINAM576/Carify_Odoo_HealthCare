import React from 'react';
import { Link } from 'react-router-dom';
import doc_profile from '../Home/doctor.png'

const Nav = ({ activeName }) => {
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-myblue">
            <div className="container">
                <Link className="navbar-brand mytitle" to="/">Carify</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="mynavbar">
                    <ul className="navbar-nav ms-auto d-flex align-items-center">
                        <li className="nav-item me-3">
                            <Link className={`nav-link ${activeName === "Patients" ? "active" : ""}`} to="/">Patients</Link>
                        </li>
                        <li className="nav-item me-3">
                            <Link className={`nav-link ${activeName === "Schedule" ? "active" : ""}`} to="/schedule">Schedule</Link>
                        </li>
                        <li className="nav-item me-3">
                            <Link className={`nav-link ${activeName === "Dashboard" ? "active" : ""}`} to="/dashboard">Dashboard</Link>
                        </li>
                        <li className="nav-item d-flex align-items-center">
                            <Link className={`nav-link ${activeName === "Profile" ? "active" : ""}`} to="/profile">
                                <img src={doc_profile} alt="Profile" height="40px" className="rounded-circle" />
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Nav;
