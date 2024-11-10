import React, { useEffect, useState } from "react";
import Patientnav from "../Components/patientnav";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PatientProfile = () => {
    const [patient, setPatient] = useState({
        pid: "P12345",
        name: "John Doe",
        phone_no: "1234567890",
        location: "New York, USA",
        age: 45,
        gender: "Male",
        email: "johndoe@example.com",
    });

    const [reports, setReports] = useState([
        { pid: "P12345", did: "D001", link: "/reports/report1.pdf" },
        { pid: "P12345", did: "D002", link: "/reports/report2.pdf" },
        { pid: "P12345", did: "D003", link: "/reports/report3.pdf" },
        { pid: "P12345", did: "D004", link: "/reports/report4.pdf" },
        { pid: "P12345", did: "D005", link: "/reports/report5.pdf" },
        { pid: "P12345", did: "D006", link: "/reports/report6.pdf" },
    ]);

    const [medicalHistory, setMedicalHistory] = useState([
        { did: "D001", pid: "P12345", sid: "S001", date: "2024-09-15", status: "Appointed" },
        { did: "D002", pid: "P12345", sid: "S002", date: "2024-09-10", status: "Canceled" },
        { did: "D003", pid: "P12345", sid: "S003", date: "2024-08-20", status: "Rejected" },
        { did: "D004", pid: "P12345", sid: "S004", date: "2024-08-15", status: "Appointed" },
    ]);

    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = () => {
        if (!selectedFile) {
            setUploadStatus("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);

        // Uncomment this when backend endpoint is ready for file uploads
        /*
        axios.post("https://api.example.com/upload-report", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
        .then(response => {
            // Update the reports state with the new report if upload is successful
            setReports([...reports, { pid: patient.pid, did: response.data.did, link: response.data.link }]);
            setUploadStatus("File uploaded successfully.");
        })
        .catch(error => {
            setUploadStatus("Error uploading the file.");
            console.error("File upload error:", error);
        });
        */
    };

    // Function to determine Bootstrap label color based on status
    const getStatusClass = (status) => {
        switch (status) {
            case "Appointed":
                return "badge bg-success";
            case "Canceled":
                return "badge bg-warning text-dark";
            case "Rejected":
                return "badge bg-danger";
            default:
                return "badge bg-secondary";
        }
    };

    // Dummy data for the graph
    const months = ["Sep", "Oct", "Nov", "Dec"];
    const scores = [20,8,10,2]; // Random scores between 0 and 27

    // Chart.js data configuration
    const data = {
        labels: months,
        datasets: [
            {
                label: "Monthly Scores",
                data: scores,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${context.raw}`;
                    },
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Months",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Scores",
                },
                min: 0,
                max: 27,
            },
        },
    };

    const handleSubmit = async () => {

     
       
        try {
            const response = await axios.get('http://localhost:8000/getProfileInfo/',{withCredentials:true});
          console.log(response)
          setPatient(response.data)
        } catch (error) {
            console.error('Error loging :', error);
            // alert('Failed to login . Please try again.');
        }
    };
    useEffect(()=>{
        handleSubmit()
    },[])

      const handleLogout = () => {
        Cookies.remove("email");
        Cookies.remove("password");
        Cookies.remove("role");
        navigate("/login");
    };

    return (
        <>
            <Patientnav activeName="Profile" />
            <div className="container mt-4">
                <h2 className="mb-4">Patient Profile</h2>

                {/* Patient Information Card */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h4 className="card-title">Patient Information</h4>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item"><strong>Patient ID:</strong> {patient.pid}</li>
                            <li className="list-group-item"><strong>Name:</strong> {patient.name}</li>
                            <li className="list-group-item"><strong>Phone Number:</strong> {patient.phone_no}</li>
                            <li className="list-group-item"><strong>Location:</strong> {patient.location}</li>
                            <li className="list-group-item"><strong>Age:</strong> {patient.age}</li>
                            <li className="list-group-item"><strong>Gender:</strong> {patient.gender}</li>
                            <li className="list-group-item"><strong>Email:</strong> {patient.email}</li>
                        </ul>
                    </div>
                </div>

                {/* File Upload Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h4 className="card-title">Upload Medical Report</h4>
                        <div className="mb-3">
                            <input
                                type="file"
                                className="form-control"
                                accept=".pdf"
                                onChange={handleFileChange}
                            />
                        </div>
                        <button className="btn btn-primary" onClick={handleFileUpload}>
                            Upload Report
                        </button>
                        {uploadStatus && (
                            <div className={`alert ${uploadStatus.includes('Error') ? 'alert-danger' : 'alert-success'} mt-3`} role="alert">
                                {uploadStatus}
                            </div>
                        )}
                    </div>
                </div>

                {/* Reports Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h4 className="card-title">Patient Reports</h4>
                        <ul className="list-group list-group-flush">
                            {reports.map((report, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span><strong>Report ID:</strong> {report.did}</span>
                                    <a href={report.link} target="_blank" rel="noopener noreferrer" className="btn btn-link">
                                        View Report
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Medical History Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h4 className="card-title">Medical History</h4>
                        <ul className="list-group list-group-flush">
                            {medicalHistory.map((record, index) => (
                                <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Doctor ID:</strong> {record.did} <br />
                                        <strong>Session ID:</strong> {record.sid} <br />
                                        <strong>Date:</strong> {record.date}
                                    </div>
                                    <span className={getStatusClass(record.status)}>{record.status}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Chart Section */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h4 className="card-title">Monthly Scores Graph</h4>
                        <Line data={data} options={options} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default PatientProfile;
