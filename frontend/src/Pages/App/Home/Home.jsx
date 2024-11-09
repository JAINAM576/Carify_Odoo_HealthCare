// Home.js
import React,{useEffect,useState} from 'react';
import { useNavigate ,Outlet} from 'react-router-dom';
import doc_profile from './doctor.png';
import user_profile from './patient.png';



const Home = () => {
   
    const isDoctor = false;

 

    return (
        <>
            {isDoctor && (
                <nav className="navbar navbar-expand-sm navbar-dark bg-myblue">
                    <div className="container">
                        <a className="navbar-brand mytitle" href="javascript:void(0)">Carify</a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mynavbar">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="mynavbar">
                            <ul className="navbar-nav ms-auto d-flex align-items-center">
                                <li className="nav-item me-3">
                                    <a className="nav-link active" href="/">Home</a>
                                </li>
                                <li className="nav-item me-3">
                                    <a className="nav-link" href="/patient_info">Schedule</a>
                                </li>
                                <li className="nav-item me-3">
                                    <a className="nav-link" href="/patient_info">Patients</a>
                                </li>
                             
                                <li className="nav-item me-3">
                                    <a className="nav-link" href="/patient_info">Dashboard</a>
                                </li>
                                <li className="nav-item d-flex align-items-center">
                                    <a className="nav-link" href="/profile">
                                        <img src={doc_profile} alt="Profile" height="40px" className="rounded-circle" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            )}
            {!isDoctor && (
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
                                        <a className="nav-link active" href="/">Appoint</a>
                                    </li>
                                    <li className="nav-item me-3">
                                        <a className="nav-link" href="/patient_info">Mental-test</a>
                                    </li>
                                    <li className="nav-item me-3">
                                        <a className="nav-link" href="/patient_info">Chatbot</a>
                                    </li>
                                    <li className="nav-item me-3">
                                        <a className="nav-link" href="/patient_info">Report-analysis</a>
                                    </li>
                                       <li className="nav-item me-3">
    <a className="nav-link" href="/assessment">Know Your Stress Level</a>
</li>

                                    <li className="nav-item d-flex align-items-center">
                                        <a className="nav-link" href="/profile">
                                            <img src={user_profile} alt="Profile" height="40px" className="rounded-circle" />
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                    
           <Outlet/>
                </>
            )}
        </>
    );
};

export default Home;
