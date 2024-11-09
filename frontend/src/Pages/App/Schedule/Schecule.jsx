import React, { useState } from 'react';
import DoctorNav from "../Components/doctornav";
import "bootstrap/dist/css/bootstrap.min.css";

const Schedule = () => {
    // State to hold slots data
    const [slots, setSlots] = useState([
        { slot_no: 1, time_range: '9:00 AM - 10:00 AM', max_patient: 10, status: 'present' },
        { slot_no: 2, time_range: '10:00 AM - 11:00 AM', max_patient: 8, status: 'present' },
        // Add more dummy slots if needed
    ]);

    // State for managing form inputs
    const [timeRange, setTimeRange] = useState('');
    const [maxPatient, setMaxPatient] = useState('');
    const [status, setStatus] = useState('present');  // Only 'present' option
    const [slotNo, setSlotNo] = useState(null);  // Null for new slot, or slot number for update

    // Handler for adding/updating a slot
    const handleAddSlot = () => {
        if (!timeRange || !maxPatient) {
            alert("Please fill in all fields.");
            return;
        }

        const newSlot = {
            slot_no: slots.length + 1,  // Can be dynamic based on the current length of slots
            time_range: timeRange,
            max_patient: parseInt(maxPatient),
            status: status
        };

        // Add the new slot and sort by time range
        const updatedSlots = [...slots, newSlot].sort((a, b) => {
            return timeToMinutes(a.time_range.split(' - ')[0]) - timeToMinutes(b.time_range.split(' - ')[0]);
        });

        // Update state
        setSlots(updatedSlots);
        clearForm();
    };

    // Function to delete a slot by slot number
    const handleDeleteSlot = (slotNo) => {
        setSlots(slots.filter(slot => slot.slot_no !== slotNo));
    };

    // Function to start editing a slot
    const handleEditSlot = (slot) => {
        setSlotNo(slot.slot_no);
        setTimeRange(slot.time_range);
        setMaxPatient(slot.max_patient.toString());
        setStatus(slot.status); // Allow updating status if needed
    };

    // Function to update a slot (e.g., changing its details)
    const handleUpdateSlot = () => {
        if (!timeRange || !maxPatient) {
            alert("Please fill in all fields.");
            return;
        }

        const updatedSlots = slots.map(slot => 
            slot.slot_no === slotNo
                ? { ...slot, time_range: timeRange, max_patient: parseInt(maxPatient), status: status }
                : slot
        );

        // Re-sequence the slots
        const reSequencedSlots = updatedSlots.map((slot, index) => ({
            ...slot,
            slot_no: index + 1  // Ensure slot numbers are sequential
        }));

        // Update state and clear form
        setSlots(reSequencedSlots);
        clearForm();
        setSlotNo(null);
    };

    // Clear form inputs
    const clearForm = () => {
        setTimeRange('');
        setMaxPatient('');
        setStatus('present');
    };

    // Convert time range to minutes for sorting
    // Convert time range to minutes for sorting with validation
const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':');

    // Check if the hour is within a valid range (0 to 23)
    if (parseInt(hours) > 23 || parseInt(hours) < 0) {
        alert("Invalid time: hours must be between 00 and 23");
        return 0;  // Return a fallback value
    }

    // Handle if minutes exceed 60
    if (parseInt(minutes) >= 60 || parseInt(minutes) < 0) {
        alert("Invalid time: minutes must be between 00 and 59");
        return 0;  // Return a fallback value
    }

    return parseInt(hours) * 60 + parseInt(minutes);
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
                                <li key={slot.slot_no} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Slot {slot.slot_no}</strong><br />
                                        <strong>Time Range:</strong> {slot.time_range} <br />
                                        <strong>Max Patients:</strong> {slot.max_patient} <br />
                                        <strong>Status:</strong> <span className="badge bg-success">{slot.status}</span>
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
                                            onClick={() => handleDeleteSlot(slot.slot_no)}
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
