import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorNav from "../Components/doctornav";
import "bootstrap/dist/css/bootstrap.min.css";

const Schedule = () => {
    const doctorId = 101; // Set doctor ID as a constant
    const [slots, setSlots] = useState([]);
    const [timeRange, setTimeRange] = useState('');
    const [maxPatient, setMaxPatient] = useState('');
    const [status, setStatus] = useState('present'); // Only 'present' option
    const [slotNo, setSlotNo] = useState(null);  // Null for new slot, or slot number for update

    // Fetch slots from the server
    const fetchSlots = async () => {
        try {
    const response = await axios.post('http://localhost:8000/getSlots/', {
       send:true
      },
      {withCredentials: true,
    });
    setSlots(response.data.data)
    console.log(response.data.data)
  } catch (error) {
    console.error("Error fetching slots:", error.response ? error.response.data : error.message);
    
  }
    };
      // Fetch slot count from  the server
    const fetchSlotCount = async () => {
        try {
    const response = await axios.post('http://localhost:8000/getSlotsCount/', {
       send:true
      },
      {withCredentials: true,
    });
  
    console.log(response.data)
  } catch (error) {
    console.error("Error fetching slots:", error.response ? error.response.data : error.message);
    
  }
    };

    // Use effect to fetch slots when the component mounts
    useEffect(() => {
        fetchSlots();
        fetchSlotCount();
    }, []);

    // Handler for adding/updating a slot
    const handleAddSlot = async () => {
        if (!timeRange || !maxPatient) {
            alert("Please fill in all fields.");
            return;
        }

        const newSlot = {
           slot_no: 4,
            time_range: timeRange,
            max_patient: parseInt(maxPatient),
            status: status
        };

        try {
            const response = await axios.post('http://localhost:8000/slots/', newSlot, { withCredentials: true });
            if (response.status === 200) {
                console.log(response)
                fetchSlots();  // Refresh the slot list
                clearForm();
            }
        } catch (error) {
            console.error("Error adding slot:", error);
        }
    };

    // Handler for deleting a slot
    const handleDeleteSlot = async (slotNo) => {
        try {
            const response = await axios.delete(`http://localhost:8000/slots/${slotNo}`, { withCredentials: true });
            if (response.status === 200) {
                fetchSlots();  // Refresh the slot list
            }
        } catch (error) {
            console.error("Error deleting slot:", error);
        }
    };

    // Function to start editing a slot
    const handleEditSlot = (slot) => {
        setSlotNo(slot.slot_no);
        setTimeRange(slot.time_range);
        setMaxPatient(slot.max_patient.toString());
        setStatus(slot.status); // Allow updating status if needed
    };

    // Function to update a slot (e.g., changing its details)
    const handleUpdateSlot = async () => {
        if (!timeRange || !maxPatient) {
            alert("Please fill in all fields.");
            return;
        }

        const updatedSlot = {
            slot_no: 4,
            time_range: timeRange,
            max_patient: parseInt(maxPatient),
            status: status
        };

        try {
            const response = await axios.put(`/api/slots/${slotNo}`, updatedSlot, { withCredentials: true });
            if (response.status === 200) {
                fetchSlots();  // Refresh the slot list
                clearForm();
                setSlotNo(null);
            }
        } catch (error) {
            console.error("Error updating slot:", error);
        }
    };

    // Clear form inputs
    const clearForm = () => {
        setTimeRange('');
        setMaxPatient('');
        setStatus('present');
    };

    return (
        <>
            <DoctorNav activeName="Schedule" />
            <div className="container mt-4">
                <h2 className="mb-4">Doctor Schedule</h2>

                {/* Form for adding or editing a slot */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h4 className="card-title">{slotNo ? 'Edit Slot' : 'Add Slot'}</h4>
                        <div className="mb-3">
                            <label htmlFor="timeRange" className="form-label">Time Range</label>
                            <input
                                type="text"
                                id="timeRange"
                                className="form-control"
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="maxPatient" className="form-label">Max Patients</label>
                            <input
                                type="number"
                                id="maxPatient"
                                className="form-control"
                                value={maxPatient}
                                onChange={(e) => setMaxPatient(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="status" className="form-label">Status</label>
                            <select
                                id="status"
                                className="form-select"
                                value={status}
                                disabled // Status is always 'present'
                            >
                                <option value="present">Present</option>
                            </select>
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={slotNo ? handleUpdateSlot : handleAddSlot}
                        >
                            {slotNo ? 'Update Slot' : 'Add Slot'}
                        </button>
                    </div>
                </div>

                {/* Display Existing Slots */}
                <div className="card mb-4">
                    <div className="card-body">
                        <h4 className="card-title">Existing Slots</h4>
                        <ul className="list-group list-group-flush">
                            {slots.map((slot) => (
                                <li key={slot[0]} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Slot {slot[0]}</strong><br />
                                        <strong>Time Range:</strong> {slot[2]} <br />
                                        <strong>Max Patients:</strong> {slot[3]} <br />
                                        <strong>Status:</strong> <span className="badge bg-success">{slot[4]?"Yes":"No"}</span>
                                    </div>
                                    <div>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEditSlot(slot)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeleteSlot(slot[0])}
                                        >
                                            Delete Slot
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Schedule;
