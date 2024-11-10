import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Doctornav from "../Components/doctornav";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Booking = () => {
    const doctorId = 101; // Set doctor ID as a constant

    const [slots, setSlots] = useState([]); // Initialize slots as an empty array
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Fetch slots data by date
    const fetchSlots = async (date) => {
        setLoading(true);
        try {
            const formattedDate = date.toISOString().split("T")[0];
            const response = await axios.get(`/api/slots?did=${doctorId}&date=${formattedDate}`);
            if (response.status === 200 && Array.isArray(response.data)) {
                setSlots(response.data);
            } else {
                console.error("Failed to fetch slot data or received non-array data");
                setSlots([]); // Ensure slots is set to an array if data is invalid
            }
        } catch (error) {
            console.error("Error fetching slots:", error);
            setSlots([]); // Set to an empty array on error to avoid map issues
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSlots(selectedDate);
    }, [selectedDate]);

    const handleToggleAvailability = async (slotId, currentAvailability) => {
        const confirmed = window.confirm("Are you sure you want to change availability?");
        if (confirmed) {
            const doubleConfirmed = window.confirm("Please confirm again to change availability.");
            if (doubleConfirmed) {
                try {
                    const response = await axios.post('/api/slot-availability', {
                        did: doctorId,
                        sid: slotId,
                        available: !currentAvailability
                    });
                    if (response.status === 200) {
                        fetchSlots(selectedDate); // Refresh the slots data
                    }
                } catch (error) {
                    console.error("Error updating slot availability:", error);
                }
            }
        }
    };

    const handleAppoint = async (pid, sid) => {
        try {
            const response = await axios.post('/api/appoint', { did: doctorId, pid, sid });
            if (response.status === 200) {
                updatePatientStatus(pid, sid, 'appointed');
            }
        } catch (error) {
            console.error("Error appointing patient:", error);
        }
    };

    const handleReject = async (pid, sid) => {
        try {
            const response = await axios.post('/api/reject', { did: doctorId, pid, sid });
            if (response.status === 200) {
                updatePatientStatus(pid, sid, 'rejected');
            }
        } catch (error) {
            console.error("Error rejecting patient:", error);
        }
    };

    const updatePatientStatus = (pid, sid, newStatus) => {
        setSlots((prevSlots) =>
            prevSlots.map(slot =>
                slot.slotId === sid
                    ? {
                        ...slot,
                        patients: slot.patients.map(patient =>
                            patient.pid === pid
                                ? { ...patient, status: newStatus }
                                : patient
                        )
                    }
                    : slot
            )
        );
    };

    return (
        <>
            <Doctornav activeName="Booking" />
            <div className="container py-3">
                <div className="date-picker mb-3">
                    <label><strong>Select Date: </strong></label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="form-control"
                    />
                </div>
                {loading ? (
                    <p>Loading slots...</p>
                ) : (
                    Array.isArray(slots) && slots.length > 0 ? (
                        slots.map((slot) => (
                            <div key={slot.slotId} className="slotdiv mb-3">
                                <div className="slotno">
                                    <span className="mytitle">Slot - {slot.slotId} : {slot.time}</span>
                                    <button
                                        style={{
                                            backgroundColor: slot.available ? "#66C962" : "#FF5050",
                                            position: "absolute",
                                            right: "25px"
                                        }}
                                        className="toggleappoint"
                                        onClick={() => handleToggleAvailability(slot.slotId, slot.available)}
                                    >
                                        {slot.available ? "Available" : "Not Available"}
                                    </button>
                                </div>
                                <div className="slotinfo">
                                    {slot.patients.map((patient) => (
                                        <div key={patient.pid} className="patient">
                                            <p><strong>Patient ID:</strong> {patient.pid}</p>
                                            <p><strong>Patient Name:</strong> {patient.name}</p>
                                            <p><strong>Description:</strong> {patient.description}</p>
                                            <button
                                                className="btn btn-success"
                                                onClick={() => handleAppoint(patient.pid, slot.slotId)}
                                                disabled={patient.status === "appointed"}
                                            >
                                                Appoint
                                            </button>
                                            <button
                                                className="btn btn-danger ms-2"
                                                onClick={() => handleReject(patient.pid, slot.slotId)}
                                                disabled={patient.status === "rejected"}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ))}
                                    {slot.patients.length === 0 && (
                                        <p>No appointments for this slot.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No slots available for the selected date.</p>
                    )
                )}
            </div>
        </>
    );
};

export default Booking;
