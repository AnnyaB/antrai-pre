// client/src/App.js
import React, { useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Use environment variable from client/.env
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5050";

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setReply(data.reply || "No response from AntrAI.");
    } catch (err) {
      setReply("⚠️ Error: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <div className="background-overlay"></div>
      <div className="container">
        <h1>AntrAI</h1>

        <textarea
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your secret query here..."
        ></textarea>

        <br />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Processing..." : "Send"}
        </button>

        {reply && (
          <div className="intelligence-report">
            <div dangerouslySetInnerHTML={{ __html: reply }} />
            <div className="feedback-buttons">
              <button className="feedback-button good">👍 Good</button>
              <button className="feedback-button bad">👎 Bad</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
