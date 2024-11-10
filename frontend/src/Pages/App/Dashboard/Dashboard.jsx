import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Container } from 'react-bootstrap';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js';
import Doctornav from "../Components/doctornav";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from 'react-router-dom';

// Register chart.js components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [patientsBookings, setPatientsBookings] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportSummary, setReportSummary] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [statusCount, setStatusCount] = useState({ appointed: 0, cancelled: 0, rejected: 0 });

  // Ensure authentication is checked first
  useEffect(() => {
    const checkCookies = () => {
      const cookies = document.cookie.split('; ');
      const email = cookies.find(cookie => cookie.startsWith('email='));
      const role = cookies.find(cookie => cookie.startsWith('role='));
      const password = cookies.find(cookie => cookie.startsWith('password='));

      // Check if all necessary cookies exist
      if (email && role && password) {
        setIsAuthenticated(true);
      } else {
        navigate('/'); // Redirect to the home page if not authenticated
      }
    };

    checkCookies();
  }, [navigate]);

  // Fetch data only if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setPatientsBookings([
        { did: 1, pid: 101, sid: 5, date: '2024-11-01', status: 'appointed' },
        { did: 2, pid: 102, sid: 6, date: '2024-11-02', status: 'cancelled' },
        { did: 1, pid: 103, sid: 7, date: '2024-11-03', status: 'appointed' },
        { did: 1, pid: 104, sid: 8, date: '2024-11-01', status: 'rejected' },
      ]);
      setReports([
        { pid: 101, did: 1, link: 'https://example.com/report/101', reason: 'Medical', },
        { pid: 102, did: 2, link: 'https://example.com/report/102', reason: 'Consultation', },
        { pid: 103, did: 1, link: 'https://example.com/report/103', reason: 'Medical', },
        { pid: 104, did: 1, link: 'https://example.com/report/104', reason: 'Consultation', },
      ]);
    }
  }, [isAuthenticated]);

  // Update status count and report summary when data changes
  useEffect(() => {
    if (patientsBookings.length > 0) {
      setTotalBookings(patientsBookings.length);

      const statusObj = { appointed: 0, cancelled: 0, rejected: 0 };
      patientsBookings.forEach(booking => {
        statusObj[booking.status]++;
      });
      setStatusCount(statusObj);

      // Summarize reports by patient ID
      const summary = reports.reduce((acc, report) => {
        const patientIndex = acc.findIndex(r => r.pid === report.pid);
        if (patientIndex !== -1) {
          acc[patientIndex].reportCount += 1;
        } else {
          acc.push({ pid: report.pid, reportCount: 1 });
        }
        return acc;
      }, []);
      setReportSummary(summary);
    }
  }, [patientsBookings, reports]);

  // Pie chart data for report reasons
  // Updated report reasons data with more categories
  const reportReasonData = {
    labels: ['Medical', 'Consultation', 'Surgery', 'Follow-up', 'Emergency', 'Routine Checkup'],
    datasets: [
      {
        label: 'Reports by Reason',
        data: [4, 3, 2, 5, 1, 4], // Count of each reason, update as per your actual data
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)', // Medical
          'rgba(255, 99, 132, 0.2)', // Consultation
          'rgba(54, 162, 235, 0.2)', // Surgery
          'rgba(255, 159, 64, 0.2)', // Follow-up
          'rgba(153, 102, 255, 0.2)', // Emergency
          'rgba(255, 206, 86, 0.2)'  // Routine Checkup
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)', // Medical
          'rgba(255, 99, 132, 1)', // Consultation
          'rgba(54, 162, 235, 1)', // Surgery
          'rgba(255, 159, 64, 1)', // Follow-up
          'rgba(153, 102, 255, 1)', // Emergency
          'rgba(255, 206, 86, 1)'  // Routine Checkup
        ],
        borderWidth: 1,
      },
    ],
  };


  const bookingChartData = {
    labels: ['2024-11-01', '2024-11-02', '2024-11-03'],
    datasets: [
      {
        label: 'Bookings',
        data: [3, 1, 1],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const reportChartData = {
    labels: ['Parth', 'Jainam', 'Bhavik'],
    datasets: [
      {
        label: 'Reports per Patient',
        data: [3, 1, 2],
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
      },
    ],
  };

  if (!isAuthenticated) {
    return null; // You could show a loading indicator here
  }

  return (
    <>
      <Doctornav activeName="Dashboard" />
      <Container className="mt-5">
        <Row className="mb-4">
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Total Bookings</Card.Title>
                <Card.Text>{totalBookings}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Appointments</Card.Title>
                <Card.Text>{statusCount.appointed}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Cancelled</Card.Title>
                <Card.Text>{statusCount.cancelled}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={12}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Bookings vs Time</Card.Title>
                <Line data={bookingChartData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={12}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Reports per Patient</Card.Title>
                <Bar data={reportChartData} />
              </Card.Body>
            </Card>
          </Col>
        </Row>



        {/* Reports Summary */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="mb-4">
              <Card.Body>
                <Card.Title>Report Summary :</Card.Title>
                <Row>
                  {reportSummary.map((summary, index) => (
                    <Col md={4} key={index} className="mb-4">
                      <Card>
                        <Card.Body>
                          <Card.Title>Patient ID: {summary.pid}</Card.Title>
                          <Card.Text>Number of Reports: {summary.reportCount}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                  {/* Reports Reason Summary (Pie Chart) */}
                  <Row className="mb-4">
                    <Col md={6}>
                      <Card className="mb-4">
                        <Card.Body>
                          <Card.Title>Report Reasons</Card.Title>
                          <Pie data={reportReasonData} />
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;