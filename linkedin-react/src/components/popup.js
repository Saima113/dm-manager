import { useState, useEffect } from "react";

function Popup() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:8080"); // Change if deployed

        socket.onopen = () => console.log("Connected to WebSocket server");

        socket.onmessage = (event) => {
            console.log("New message received:", event.data);
            const newMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        return () => socket.close(); // Cleanup WebSocket on component unmount
    }, []);

    useEffect(() => {
        // Ensure LinkedIn login button exists before adding click listener
        const loginButton = document.getElementById("linkedin-login");

        if (loginButton) {
            loginButton.addEventListener("click", () => {
                const clientId = " 86w2m1s60mrpi8";  
                const redirectUri = "http://localhost:3000/auth/linkedin/callback";
                const state = "103xyz"; // Prevent CSRF attacks

                const linkedInAuthURL = `https://www.linkedin.com/oauth/v2/authorization?` +
                    `response_type=code` +
                    `&client_id=${clientId}` +
                    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                    `&scope=r_liteprofile%20r_emailaddress%20w_member_social` +
                    `&state=${state}`;

                window.open(linkedInAuthURL, "_blank");
            });
        } else {
            console.error("Button with ID 'linkedin-login' not found!");
        }
    }, []); // Runs once after component mounts

    return (
        <div>
            <h2>LinkedIn DM Prioritizer</h2>
            <div id="messages-container">
                {messages.map((msg, index) => (
                    <div key={index} className="message-box">
                        <strong>{msg.user}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <button id="linkedin-login">Login with LinkedIn</button>
        </div>
    );
}

export default Popup;
