import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Container, Dropdown } from 'react-bootstrap';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import Doctornav from "../Components/doctornav";
import "bootstrap/dist/css/bootstrap.min.css";

// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const Dashboard = () => {
  const [patientsBookings, setPatientsBookings] = useState([]);
  const [reports, setReports] = useState([]);

  // Sample data for visualization
  const [totalBookings, setTotalBookings] = useState(0);
  const [statusCount, setStatusCount] = useState({ appointed: 0, cancelled: 0, rejected: 0 });

  // Simulate data fetching
  useEffect(() => {
    // Fetch your patients_booking and reports data from backend
    setPatientsBookings([
      { did: 1, pid: 101, sid: 5, date: '2024-11-01', status: 'appointed' },
      { did: 2, pid: 102, sid: 6, date: '2024-11-02', status: 'cancelled' },
      { did: 1, pid: 103, sid: 7, date: '2024-11-03', status: 'appointed' },
      { did: 1, pid: 104, sid: 8, date: '2024-11-01', status: 'rejected' },
    ]);
    setReports([
      { pid: 101, did: 1, link: 'https://example.com/report/101' },
      { pid: 102, did: 2, link: 'https://example.com/report/102' },
      { pid: 103, did: 1, link: 'https://example.com/report/103' },
    ]);
  }, []);

  useEffect(() => {
    // Total bookings count
    setTotalBookings(patientsBookings.length);

    // Count of each booking status
    const statusObj = { appointed: 0, cancelled: 0, rejected: 0 };
    patientsBookings.forEach(booking => {
      statusObj[booking.status]++;
    });
    setStatusCount(statusObj);
  }, [patientsBookings]);

  // Chart Data for Bookings vs. Time (Booking count per day)
  const bookingChartData = {
    labels: ['2024-11-01', '2024-11-02', '2024-11-03'],
    datasets: [
      {
        label: 'Bookings',
        data: [3, 1, 1],  // Change with dynamic data
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  // Chart Data for Reports per Patient
  const reportChartData = {
    labels: ['Parth', 'Jainam', 'Bhavik'],  // Patient IDs
    datasets: [
      {
        label: 'Reports per Patient',
        data: [3, 1, 2],  // Change with dynamic data
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <>
    <Doctornav activeName="Dashboard"/>
    <Container className="mt-5">
      <Row>
        {/* Summary Metrics */}
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Total Bookings</Card.Title>
              <Card.Text>{totalBookings}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Appointments</Card.Title>
              <Card.Text>{statusCount.appointed}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Cancelled</Card.Title>
              <Card.Text>{statusCount.cancelled}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Booking vs Time Chart */}
      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Bookings vs Time</Card.Title>
              <Line data={bookingChartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reports per Patient */}
      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Reports per Patient</Card.Title>
              <Bar data={reportChartData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Reports List */}
      <Row className="mt-4">
        <Col md={12}>
          <Card>
            <Card.Body>
              <Card.Title>Reports</Card.Title>
              <ul className="list-group">
                {reports.map((report, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Patient ID:</strong> {report.pid} <br />
                      <a href={report.link} target="_blank" rel="noopener noreferrer">View Report</a>
                    </div>
                  </li>
                ))}
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </>
  );
};

export default Dashboard;
