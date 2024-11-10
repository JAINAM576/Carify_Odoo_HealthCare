import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import { Button, Modal, Form } from 'react-bootstrap';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import DatePicker from 'react-datepicker';  // Import DatePicker from react-datepicker
import 'react-datepicker/dist/react-datepicker.css';  // Style for DatePicker

// Set Axios default configuration for credentials
axios.defaults.withCredentials = true;

// Main component
const DoctorTable = ({ doctors }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  // Column definitions
  const columns = [
    { headerName: "Name", field: "name", filter: true },
    { headerName: "Phone No", field: "phone_no", filter: true },
    { headerName: "Location", field: "location", filter: true },
    { headerName: "Experience (years)", field: "experience", filter: true },
    { headerName: "Specialty", field: "speciality", filter: true },
    { headerName: "Email", field: "email", filter: true },
    {
      headerName: "Appointment",
      cellRenderer: (params) => (
        <div>
          <Button variant="primary bg-myblue" onClick={() => handleAppointmentClick(params.data.did)}>
            Book Appointment
          </Button>
        </div>
      ),
    },
  ];

  // Handle the button click in the Appointment column
  const handleAppointmentClick = (doctorId) => {
    setSelectedDoctorId(doctorId);
    setModalVisible(true); // Show modal after button click
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

      {/* Appointment Modal */}
      <AppointmentModal
        show={modalVisible}
        onClose={() => setModalVisible(false)}
        doctorId={selectedDoctorId}
      />
    </div>
  );
};

// Appointment Modal component
const AppointmentModal = ({ show, onClose, doctorId }) => {
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (show && doctorId && selectedDate) {
      // Simulate sending backend request to fetch slots for selected date
      const fetchSlots = async () => {
        try {
          // Example of API call to fetch slots (commented for now)
          // const response = await axios.get(`/api/getSlots?doctorId=${doctorId}&date=${selectedDate}`);
          // setSlots(response.data.slots);

          // Simulating the response

        } catch (error) {
          console.error("Error fetching slots:", error);
        }
      };
      fetchSlots();
    }
  }, [show, doctorId, selectedDate]);

  const handleConfirmAppointment = async() => {
    if (!selectedSlot || !description) {
      alert("Please select a slot and enter a description.");
      return;
    }
    const response=await axios.post("http://localhost:8000/insertPatient/",{did:doctorId,sid:selectedSlot,desc:description,date:selectedDate},{withCredentials:true})
console.log(response)
    // Simulate sending appointment data
    alert("Appointment booked successfully!");
    onClose(); // Close modal after successful booking
  };
  const getSlots = async (selectedDoctorId) => {
  try {
    const response = await axios.post('http://localhost:8000/getSlots/', {
        doctorId: selectedDoctorId,
      },
      {withCredentials: true,
    });
    return response.data; 
  } catch (error) {
    console.error("Error fetching slots:", error.response ? error.response.data : error.message);
    
  }
};
  const handleDateChange=async (date)=>{
setSelectedDate(date);
const formattedDate = date.toISOString().split('T')[0]; 
setSelectedDate(formattedDate)
const slotData=await getSlots(doctorId)
console.log(slotData)
let sidArray=[]
slotData['data'].forEach((e)=>{
  sidArray.push(e[1])
})
 try {
    const response = await axios.post('http://localhost:8000/checkAvailibility/', {
        doctorId: doctorId,
        date:formattedDate,
        sidArray:sidArray

      },
      {withCredentials: true,
    });
   let validateSlots=[]
   console.log(response.data)
   
   slotData['data'].forEach((e)=>{
   
    validateSlots.push({slot_no:e[0],time_range:e[2],availability:response['data'][e[1]],slot_id:e[1]})
   })
   setSlots(validateSlots)

  } catch (error) {
    console.error("Error fetching slots:", error.response ? error.response.data : error.message);
    
  }

  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book an Appointment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {doctorId ? (
          <>
            <p>Select a date for Doctor ID: {doctorId}</p>
            {/* Date Picker for selecting the date */}
            <DatePicker
              selected={selectedDate}
              onChange={(e)=>handleDateChange(e)}
              dateFormat="yyyy-MM-dd"
              className="form-control"
              placeholderText="Select a date"
            />
            {selectedDate && (
              <>
                <p>Select an available slot for {doctorId} on {selectedDate}</p>
                {Array.isArray(slots) && slots.length > 0 ? (
                  <Form>
                    {slots.map((slot) => (
                      <Form.Check 
                        key={slot.slot_id}
                        type="radio"
                        label={`${slot.time_range} - ${slot.availability ? 'Unavailable' : 'Available'}`}
                        name="slot"
                        value={slot.slot_id}
                        disabled={slot.availability}
                        onChange={() => setSelectedSlot(slot.slot_id)}
                        style={{
                          backgroundColor: slot.availability ? 'red' : 'green',
                          color: 'white',
                          marginBottom: '10px',
                        }}
                      />
                    ))}
                    <Form.Group className="mt-3">
                      <Form.Label>Description of Problem</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your symptoms or concerns"
                      />
                    </Form.Group>
                  </Form>
                ) : (
                  <p>No available slots for this doctor on the selected date.</p>
                )}
              </>
            )}
          </>
        ) : (
          <p>No doctor selected.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleConfirmAppointment} disabled={!selectedSlot || !description}>
          Confirm Appointment
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DoctorTable;
