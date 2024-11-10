import React, { useEffect, useState } from 'react';
import Doctornav from "../Components/doctornav";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Booking = () => {
    const doctorId = 101; // Set doctor ID as a constant

    const [slots, setSlots] = useState([]); // Initialize slots as an empty array
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Dummy data for slots
    const dummySlots = [
        {
            slotId: 1,
            time: "09:00 AM - 10:00 AM",
            available: true,
            patients: [
                { pid: 1, name: "John Doe", description: "Consultation", status: "pending" },
                { pid: 2, name: "Jane Smith", description: "Follow-up", status: "pending" }
            ]
        },
        {
            slotId: 2,
            time: "10:00 AM - 11:00 AM",
            available: false,
            patients: [
                { pid: 3, name: "Mark Wilson", description: "Routine checkup", status: "appointed" }
            ]
        },
        {
            slotId: 3,
            time: "11:00 AM - 12:00 PM",
            available: true,
            patients: []
        }
    ];

    // Fetch slots data by date (using dummy data here)
    const fetchSlots = async (date) => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setSlots(dummySlots);
            setLoading(false);
        }, 1000);
    };

    useEffect(() => {
        fetchSlots(selectedDate);
    }, [selectedDate]);

    const handleToggleAvailability = async (slotId, currentAvailability) => {
        const confirmed = window.confirm("Are you sure you want to change availability?");
        if (confirmed) {
            const doubleConfirmed = window.confirm("Please confirm again to change availability.");
            if (doubleConfirmed) {
                // Simulate updating availability
                setSlots((prevSlots) =>
                    prevSlots.map(slot =>
                        slot.slotId === slotId
                            ? { ...slot, available: !currentAvailability }
                            : slot
                    )
                );
            }
        }
    };

    const handleAppoint = async (pid, sid) => {
        // Simulate appointment action
        setSlots((prevSlots) =>
            prevSlots.map(slot =>
                slot.slotId === sid
                    ? {
                        ...slot,
                        patients: slot.patients.map(patient =>
                            patient.pid === pid
                                ? { ...patient, status: "appointed" }
                                : patient
                        )
                    }
                    : slot
            )
        );
    };

    const handleReject = async (pid, sid) => {
        // Simulate rejection action
        setSlots((prevSlots) =>
            prevSlots.map(slot =>
                slot.slotId === sid
                    ? {
                        ...slot,
                        patients: slot.patients.map(patient =>
                            patient.pid === pid
                                ? { ...patient, status: "rejected" }
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
                <div className="row " >
                    <div className="col-12">
                        <div className="date-picker" >
                            <label><strong>Select Date: </strong></label>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                dateFormat="yyyy-MM-dd"
                                className="form-control"
                               
                            />
                        </div>
                    </div>
                </div>
                
                {loading ? (
                    <p>Loading slots...</p>
                ) : (
                    Array.isArray(slots) && slots.length > 0 ? (
                        slots.map((slot) => (
                            <div key={slot.slotId} className="slotdiv mb-3" >
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