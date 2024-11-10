import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Datatable from "../Components/Datatable";
import axios from 'axios';
import Patientnav from "../Components/patientnav";
import Doctornav from "../Components/doctornav";
import PatientTable from '../Components/PatieantDatatable';

const Home = () => {
    const navigate = useNavigate();

    // Declare hooks at the top
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isDoctor, setIsDoctor] = useState(false);
    const [doctors, setDoctors] = useState([]);

    // Check authentication and role based on cookies
    useEffect(() => {
        const checkCookies = () => {
            const cookies = document.cookie.split('; ');

            const email = cookies.find(cookie => cookie.startsWith('email='));
            const role = cookies.find(cookie => cookie.startsWith('role='));
            const password = cookies.find(cookie => cookie.startsWith('password='));

            if (email && role && password) {
                setIsAuthenticated(true);
                const roleValue = role.split('=')[1]; // Get role value from cookie
                console.log(roleValue)
                if(roleValue=='doctor'){
                    setIsDoctor(true);
                }
                
            } else {
                navigate('/login'); // Redirect to the login page if not authenticated
            }
        };

        checkCookies();
    }, [navigate]);

    // Fetch doctor data from backend
    const fetchDoctorData = async () => {
        try {
            const response = await axios.get('http://localhost:8000/getInfo/', { withCredentials: true });
            setDoctors(response.data);
        } catch (error) {
            console.error('Error fetching doctor data:', error);
        }
    };

    // Fetch doctor data on mount
    useEffect(() => {
        if (isAuthenticated) {
            fetchDoctorData();
        }
    }, [isAuthenticated]);

    // Show loading message until authentication is checked
    if (!isAuthenticated) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {/* Render different navigation and content based on doctor's role */}
            {isDoctor ? (
                <>
                    <Doctornav activeName="Patients" />
                    <div className='container mt-2'>
                        <p className='mt-4 mytitle' style={{ color: "black" }}>Patients:</p>
                        <PatientTable doctors={doctors} />
                    </div>
                </>
            ) : (
                <>
                    <Patientnav activeName="Appoint" />
                    <div className='container'>
                        <p className='mt-4 mytitle' style={{ color: "black" }}>Doctors:</p>
                        <Datatable doctors={doctors} />
                    </div>
                </>
            )}
            <Outlet />
        </>
    );
};

export default Home;
