import React, { useState } from "react";
import axios from "axios";
import Patientnav from "../Components/patientnav";

const Chatbot = () => {
    const [inputText, setInputText] = useState("");
    const [chatHistory, setChatHistory] = useState([
        { sender: "bot", message: "Hi, I am your consultant for today. Can you tell me how you feel today so I can help you further in life." }
    ]);

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

        // Add user's message to chat history
        const newPatientMessage = { sender: "patient", message: inputText };
        setChatHistory((prev) => [...prev, newPatientMessage]);
        setInputText("");

        try {
            // Send request to the backend and get response
            const response = await axios.post("http://localhost:8000/chatResponse/", { message: inputText });
            console.log(response)
            const botMessage = response.data.response || "I'm here to help you.";
            
            // Add bot's response to chat history
            const newBotMessage = { sender: "bot", message: botMessage };
            setChatHistory((prev) => [...prev, newBotMessage]);

        } catch (error) {
            console.error("Error fetching bot response:", error);
            const errorMessage = { sender: "bot", message: "There was an error. Please try again." };
            setChatHistory((prev) => [...prev, errorMessage]);
        }

        // Clear input field
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
