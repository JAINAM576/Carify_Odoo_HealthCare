import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import PatientNav from "../Components/doctornav";
import { useNavigate } from 'react-router-dom';

const DoctorProfile = () => {
  const navigate = useNavigate();
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(null);  // Start with null to check during the first render

  // Doctor Data State
  const [doctor, setDoctor] = useState(null);

  useEffect(() => {
    const checkCookies = () => {
      const cookies = document.cookie.split('; ');
      const email = cookies.find(cookie => cookie.startsWith('email='));
      const role = cookies.find(cookie => cookie.startsWith('role='));
      const password = cookies.find(cookie => cookie.startsWith('password='));

      // Check if all necessary cookies exist
      if (email && role && password) {
        setIsAuthenticated(true);  // Set authentication to true if cookies are present
      } else {
        setIsAuthenticated(false);  // Set authentication to false if not authenticated
      }
    };

    checkCookies();
  }, []);  // Run only on component mount
  
  useEffect(() => {
    // Fetch doctor data once authenticated
    if (isAuthenticated) {
      // Example API call to fetch doctor data (replace with actual API URL)
      axios.get('https://api.example.com/doctor-profile')
        .then(response => {
          setDoctor(response.data);
        })
        .catch(error => {
          console.error("Error fetching doctor data:", error);
        });

      // Dummy data to use for now
      const dummyDoctorData = {
        did: 1,
        name: "Dr. John Smith",
        phone_no: "1234567890",
        location: "New York, NY",
        experience: 15,
        speciality: "Cardiology",
        email: "johnsmith@example.com"
      };
      setDoctor(dummyDoctorData);
    }
  }, [isAuthenticated]); // Run when `isAuthenticated` changes

  const handleLogout = () => {
    // Remove cookies for email, password, and role
    Cookies.remove('email');
    Cookies.remove('password');
    Cookies.remove('role');

    // Redirect to login or home page
    navigate('/login');
  };

  // If authentication is still being checked, show loading
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to home page
  if (!isAuthenticated) {
    navigate('/');
    return null;
  }

  // Display loading message until doctor data is available
  if (!doctor) {
    return <div>Loading doctor data...</div>;
  }

  return (
    <>
      <PatientNav activeName="Profile" />
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card>
              <Card.Header as="h5">Doctor Profile</Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col xs={4}><strong>Doctor ID:</strong></Col>
                  <Col xs={8}>{doctor.did}</Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={4}><strong>Name:</strong></Col>
                  <Col xs={8}>{doctor.name}</Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={4}><strong>Phone Number:</strong></Col>
                  <Col xs={8}>{doctor.phone_no}</Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={4}><strong>Location:</strong></Col>
                  <Col xs={8}>{doctor.location}</Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={4}><strong>Experience:</strong></Col>
                  <Col xs={8}>{doctor.experience} years</Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={4}><strong>Specialty:</strong></Col>
                  <Col xs={8}>{doctor.speciality}</Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={4}><strong>Email:</strong></Col>
                  <Col xs={8}>{doctor.email}</Col>
                </Row>
                <Button variant="danger" onClick={handleLogout} className="mt-3">
                  Logout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DoctorProfile;
