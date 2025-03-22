// import React from "react";
// In your React component file (e.g., src/components/MessageList.js)
import React, { useState, useEffect } from 'react';

function MessageList() {
  // State to store messages data
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch messages on component mount
  useEffect(() => {
    getMessages();
  }, []);

  // Function to get all messages
  const getMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/messages');
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };
  

  // Add this function to handle search
const searchMessages = async (e) => {
  e.preventDefault();
  if (!searchQuery.trim()) {
    return getMessages();
  }
  
  try {
    const response = await fetch(`/api/messages/search?query=${encodeURIComponent(searchQuery)}`);
    const data = await response.json();
    setMessages(data);
  } catch (error) {
    console.error('Error searching messages:', error);
    setLoading(false);
  }
};

  return (
    <div>
      <h2>LinkedIn Messages</h2>
      
      {/* Search form */}
      <form onSubmit={searchMessages} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search messages..."
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
        <button type="button" onClick={getMessages} className="clear-button">Clear</button>
      </form>
      
      {/* Messages list */}
      {loading ? (
        <p>Loading messages...</p>
      ) : (
        <div>
          {messages.length === 0 ? (
            <p>No messages found</p>
          ) : (
            messages.map(message => (
              <div key={message.id} className="message-card">
                <h3>{message.sender}</h3>
                <p>{message.content}</p>
                {message.priority && (
                  <span className={`priority ${message.priority}`}>
                    {message.priority} priority
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

// Add this search form to your JSX, above the message list
<form onSubmit={searchMessages}>
  <input
    type="text"
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search messages..."
  />
  <button type="submit">Search</button>
  <button type="button" onClick={getMessages}>Clear</button>
</form>
}

export default MessageList;
