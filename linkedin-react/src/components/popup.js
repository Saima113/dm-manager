import React, { useState } from "react";
import MessageItem from "./messageitem"; 
import "./popup.css"; // For styling

const Popup = () => {
  const [messages, setMessages] = useState([
    { sender: "John Doe", text: "Hey, let’s connect!" },
    { sender: "Jane Smith", text: "Looking forward to our meeting." }
  ]);

  return (
    <div className="popup-container">
      <h2>LinkedIn DM Prioritizer</h2>
      <div className="messages-list">
        {messages.map((msg, index) => (
          <MessageItem key={index} sender={msg.sender} text={msg.text} />
        ))}
      </div>
    </div>
  );
};

export default Popup;
