import React, { useState } from "react";
import axios from "axios";

function Chatbotnew() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!query) return;

    // Add the user's message to the chat
    const newMessages = [...messages, { sender: "user", text: query }];
    setMessages(newMessages);

    try {
      // Send the query to the backend
      const response = await axios.post("http://localhost:5001/chat", { query });

      // Add the response from the backend (either a math result or OpenAI response)
      setMessages([...newMessages, { sender: "bot", text: response.data.message }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { sender: "bot", text: "Error processing your request." }]);
    }

    // Clear the input field
    setQuery("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Chatbot</h1>
      <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "auto" }}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === "user" ? "right" : "left",
              margin: "10px 0",
              color: msg.sender === "user" ? "blue" : "green",
            }}
          >
            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ask me something..."
        style={{ width: "calc(100% - 60px)", padding: "10px" }}
      />
      <button onClick={handleSend} style={{ marginLeft: "10px", padding: "10px" }}>
        Send
      </button>
    </div>
  );
}

export default Chatbotnew;
