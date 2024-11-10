import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button, Modal } from 'react-bootstrap';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

// Set Axios default configuration for credentials
axios.defaults.withCredentials = true;

// Main component
const PatientTable = ({ doctors }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [historyModalVisible, setHistoryModalVisible] = useState(false);

  // Column definitions for the doctor table
  const columns = [
    { headerName: "Name", field: "name", filter: true },
    { headerName: "Phone No", field: "phone_no", filter: true },
    { headerName: "Location", field: "location", filter: true },
    { headerName: "Age", field: "age", filter: true },
    { headerName: "Gender", field: "gender", filter: true },
    { headerName: "Email", field: "email", filter: true },
    {
      headerName: "History",
      cellRenderer: (params) => (
        <div>
          <Button className='bg-myblue' onClick={() => handleHistoryClick(params.data.pid)}>
            View History
          </Button>
        </div>
      ),
    },
  ];

  // Handle the button click for viewing patient history
  const handleHistoryClick = (patientId) => {
    setSelectedPatientId(patientId);
    setHistoryModalVisible(true); // Show the history modal
  };

  return (
    <div>
      <div className="ag-theme-alpine" style={{ width: '100%' }}>
        <AgGridReact
          rowData={doctors}
          columnDefs={columns}
          domLayout="autoHeight"
          pagination={true}
        />
      </div>

      {/* Patient History Modal */}
      <HistoryModal
        show={historyModalVisible}
        onClose={() => setHistoryModalVisible(false)}
        patientId={selectedPatientId}
      />
    </div>
  );
};

// Patient History Modal component
const HistoryModal = ({ show, onClose, patientId }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && patientId) {
      const fetchReports = async () => {
        setLoading(true);
        try {
          // Dummy data for reports with pid, did, and link
          const dummyReports = [
            {
              pid: patientId,
              did: 101,
              link: 'https://example.com/reports/report1.pdf',
            },
            {
              pid: patientId,
              did: 102,
              link: 'https://example.com/reports/report2.pdf',
            },
            {
              pid: patientId,
              did: 103,
              link: 'https://example.com/reports/report3.pdf',
            },
          ];
          setReports(dummyReports);
        } catch (error) {
          console.error("Error fetching patient history:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchReports();
    }
  }, [show, patientId]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Patient History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {reports.length > 0 ? (
              <ul>
                {reports.map((report, index) => (
                  <li key={index}>
                    <strong>Doctor ID:</strong> {report.did}
                    <br />
                    <a href={report.link} target="_blank" rel="noopener noreferrer">
                      View Report
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No reports found for this patient.</p>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Dummy doctors data
const doctorsData = [
  {
    pid: 1,
    name: "John Doe",
    phone_no: "123-456-7890",
    location: "New York",
    age: 45,
    gender: "Male",
    email: "john.doe@example.com",
  },
  {
    pid: 2,
    name: "Jane Smith",
    phone_no: "987-654-3210",
    location: "Los Angeles",
    age: 38,
    gender: "Female",
    email: "jane.smith@example.com",
  },
  {
    pid: 3,
    name: "Samuel Green",
    phone_no: "456-123-7890",
    location: "Chicago",
    age: 50,
    gender: "Male",
    email: "samuel.green@example.com",
  },
];

const App = ({doctors}) => {
  return (
    <div>
      <PatientTable doctors={doctors} />
    </div>
  );
};

export default App;

// import React from 'react'

// const PatieantDatatable = () => {
//   return (
//     <div>PatieantDatatable</div>
//   )
// }

// export default PatieantDatatable