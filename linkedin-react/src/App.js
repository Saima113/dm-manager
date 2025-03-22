// import React from "react";
// import Popup from "./components/popup"; // ✅ Correct path
//   // Importing the Popup component
// import "./App.css"; // Import CSS for styling

// function App() {
//   return (
//     <div className="App">
//       <Popup /> {/* Rendering the Popup component */}
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('templates');

  // Sample data
  const [templates, setTemplates] = useState([
    {
      id: 1,
      title: "Initial Connection",
      content: "Hi {{name}}, I noticed your work at {{company}} and wanted to connect..."
    },
    {
      id: 2,
      title: "Follow-up",
      content: "Hi {{name}}, just following up on our conversation about {{topic}}..."
    }
  ]);

  const handleEditTemplate = (id, title, content) => {
    // In a real app, you'd open a modal or navigate to edit page
    alert(`Edit template: ${title}\n\nContent: ${content}`);
  };

  const handleDeleteTemplate = (id, title) => {
    if (window.confirm(`Delete template "${title}"?`)) {
      setTemplates(templates.filter(template => template.id !== id));
    }
  };

  const handleAddTemplate = () => {
    // In a real app, you'd open a modal or form
    alert('Add new template');
  };

  return (
    <div className="container">
      <header>
        <h1>LinkedIn DM Manager</h1>
        <div className="status-indicator">
          <span className="status-dot online"></span>
          <span className="status-text">Active</span>
        </div>
      </header>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`} 
          onClick={() => setActiveTab('templates')}
        >
          Templates
        </button>
        <button 
          className={`tab-btn ${activeTab === 'automation' ? 'active' : ''}`} 
          onClick={() => setActiveTab('automation')}
        >
          Automation
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} 
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`} 
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="tab-content">
        {/* Templates Tab */}
        <div id="templates" className={`tab-pane ${activeTab === 'templates' ? 'active' : ''}`}>
          <div className="template-list">
            {templates.map(template => (
              <div className="template-item" key={template.id}>
                <div className="template-header">
                  <h3>{template.title}</h3>
                  <div className="template-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditTemplate(template.id, template.title, template.content)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteTemplate(template.id, template.title)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="template-preview">{template.content}</p>
              </div>
            ))}
          </div>
          
          <button className="add-template-btn" onClick={handleAddTemplate}>+ Add New Template</button>
        </div>

        {/* Automation Tab */}
        <div id="automation" className={`tab-pane ${activeTab === 'automation' ? 'active' : ''}`}>
          <div className="automation-settings">
            <div className="setting-group">
              <h3>Auto-respond</h3>
              <div className="toggle-switch">
                <input type="checkbox" id="auto-respond" className="toggle-input" />
                <label htmlFor="auto-respond" className="toggle-label"></label>
              </div>
              <p>Automatically respond to new messages</p>
            </div>
            
            <div className="setting-group">
              <h3>Schedule Messages</h3>
              <div className="toggle-switch">
                <input type="checkbox" id="schedule-messages" className="toggle-input" />
                <label htmlFor="schedule-messages" className="toggle-label"></label>
              </div>
              <p>Schedule messages to be sent later</p>
            </div>
            
            <div className="setting-group">
              <h3>Follow-up Reminders</h3>
              <div className="toggle-switch">
                <input type="checkbox" id="follow-up" className="toggle-input" />
                <label htmlFor="follow-up" className="toggle-label"></label>
              </div>
              <p>Remind to follow up on unanswered messages</p>
            </div>
          </div>
        </div>

        {/* Analytics Tab */}
        <div id="analytics" className={`tab-pane ${activeTab === 'analytics' ? 'active' : ''}`}>
          <div className="analytics-container">
            <div className="analytics-card">
              <h3>Response Rate</h3>
              <div className="analytics-value">62%</div>
              <div className="analytics-trend positive">↑ 5%</div>
            </div>
            
            <div className="analytics-card">
              <h3>Avg. Response Time</h3>
              <div className="analytics-value">2.4h</div>
              <div className="analytics-trend negative">↓ 0.5h</div>
            </div>
            
            <div className="analytics-card">
              <h3>Messages Sent</h3>
              <div className="analytics-value">128</div>
              <div className="analytics-trend positive">↑ 12</div>
            </div>
          </div>
          
          <button className="view-details-btn">View Detailed Analytics</button>
        </div>

        {/* Settings Tab */}
        <div id="settings" className={`tab-pane ${activeTab === 'settings' ? 'active' : ''}`}>
          <div className="settings-list">
            <div className="setting-item">
              <h3>Notification Settings</h3>
              <div className="setting-controls">
                <select id="notification-setting">
                  <option value="all">All Messages</option>
                  <option value="important">Important Only</option>
                  <option value="none">Disabled</option>
                </select>
              </div>
            </div>
            
            <div className="setting-item">
              <h3>Auto-save Drafts</h3>
              <div className="setting-controls">
                <div className="toggle-switch">
                  <input type="checkbox" id="auto-save" className="toggle-input" defaultChecked />
                  <label htmlFor="auto-save" className="toggle-label"></label>
                </div>
              </div>
            </div>
            
            <div className="setting-item">
              <h3>Data Sync</h3>
              <div className="setting-controls">
                <button className="sync-btn">Sync Now</button>
                <span className="last-sync">Last sync: 2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer>
        <button className="help-btn">Help</button>
        <button className="feedback-btn">Feedback</button>
      </footer>
    </div>
  );
}

export default App;