import React, { useState, useEffect } from "react";
import axios from "axios";
import Patientnav from "../Components/patientnav";
import { useNavigate } from "react-router-dom";

const Chatbot = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [inputText, setInputText] = useState("");
    const [chatHistory, setChatHistory] = useState([
        { sender: "bot", message: "Hi, I am your consultant for today. Can you tell me how you feel today so I can help you further in life?" }
    ]);

    // Authentication check (runs only once on component mount)
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
                navigate('/login'); // Redirect to the login page if not authenticated
            }
        };

        checkCookies();
    }, [navigate]); // Only run on mount

    // Don't render the chatbot UI until authentication is verified
    if (!isAuthenticated) {
        return <div>Loading...</div>;  // Show a loading state until authentication is checked
    }

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const handleKeyPress = (event) => {
        if (event.key === "Enter") {
            handleButtonClick();
        }
    };

    const handleButtonClick = async () => {
        if (inputText.trim() === "") return;

        // Add patient's message to chat history
        const newPatientMessage = { sender: "patient", message: inputText };
        setChatHistory((prev) => [...prev, newPatientMessage]);
        setInputText("");

        try {
            // Send request to backend for chatbot response
            const response = await axios.post("http://localhost:8000/chatResponse/", { message: inputText });
            console.log(response);
            const botMessage = response.data.response || "I'm here to help you.";

            // Add bot's response to chat history
            const newBotMessage = { sender: "bot", message: botMessage };
            setChatHistory((prev) => [...prev, newBotMessage]);

        } catch (error) {
            console.error("Error fetching bot response:", error);
            const errorMessage = { sender: "bot", message: "There was an error. Please try again." };
            setChatHistory((prev) => [...prev, errorMessage]);
        }
    };

    return (
        <>
            <Patientnav activeName="Chatbot" />
            <div className="container">
                <p className="mytitle mt-3" style={{ color: "var(--Carify-black)" }}>CareBuddy :</p>
                <div className="chatbotdiv">
                    <div className="chat">
                        {chatHistory.map((chat, index) => (
                            <div key={index} className={chat.sender === "patient" ? "patientchatdiv" : "botchatdiv"}>
                                <div className={chat.sender === "patient" ? "patientchat" : "botchat"}>
                                    {chat.message}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="search-container">
                        <div className="searchbar">
                            <input
                                type="text"
                                value={inputText}
                                onChange={handleInputChange}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                style={{
                                    width: "100%",
                                    border: "none",
                                    outline: "none",
                                    padding: "5px",
                                    fontSize: "1rem",
                                }}
                            />
                        </div>
                        <button className="searchbutton" onClick={handleButtonClick}>
                            Go
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbot;
