import user_profile from '../Home/patient.png'
import React from 'react';
const Nav = ({ activeName }) => {
    return (
        <>
            <nav className="navbar navbar-expand-sm navbar-dark bg-myblue">
                <div className="container">
                    <a className="navbar-brand mytitle" href="javascript:void(0)">Carify</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="mynavbar">
                        <ul className="navbar-nav ms-auto d-flex align-items-center">
                            <li className="nav-item me-3">
                                <a className={`nav-link ${activeName === "Appoint" ? "active" : ""}`} href="/">Appoint</a>
                            </li>
                            <li className="nav-item me-3">
                                <a className={`nav-link ${activeName === "Mental-Test" ? "active" : ""}`} href="/mental-test">Mental-Test</a>
                            </li>
                            <li className="nav-item me-3">
                                <a className={`nav-link ${activeName === "Chatbot" ? "active" : ""}`} href="/chatbot">Chatbot</a>
                            </li>
                            <li className="nav-item me-3">
                                <a className={`nav-link ${activeName === "Report-Analysis" ? "active" : ""}`} href="/report-analysis">Report-Analysis</a>
                            </li>
                            <li className="nav-item d-flex align-items-center">
                                <a className={`nav-link ${activeName === "Profile" ? "active" : ""}`} href="/profile/patient">
                                    <img src={user_profile} alt="Profile" height="40px" className="rounded-circle" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}
export default Nav;
