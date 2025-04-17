import React, { useState } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('templates');
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

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [formData, setFormData] = useState({ id: null, title: '', content: '' });

  const openAddForm = () => {
    setFormMode('add');
    setFormData({ id: null, title: '', content: '' });
    setFormOpen(true);
  };

  const openEditForm = (template) => {
    setFormMode('edit');
    setFormData(template);
    setFormOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (formMode === 'edit') {
      setTemplates(prev =>
        prev.map(t => (t.id === formData.id ? formData : t))
      );
    } else {
      const newTemplate = { ...formData, id: Date.now() };
      setTemplates(prev => [...prev, newTemplate]);
    }
    setFormOpen(false);
  };

  const handleDeleteTemplate = (id, title) => {
    if (window.confirm(`Delete template "${title}"?`)) {
      setTemplates(templates.filter(template => template.id !== id));
    }
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

      {/* Tab Buttons */}
      <div className="tabs">
        {['templates', 'automation', 'analytics', 'settings'].map(tab => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Templates */}
        <div id="templates" className={`tab-pane ${activeTab === 'templates' ? 'active' : ''}`}>
          <div className="template-list">
            {templates.map(template => (
              <div className="template-item" key={template.id}>
                <div className="template-header">
                  <h3>{template.title}</h3>
                  <div className="template-actions">
                    <button onClick={() => openEditForm(template)}>Edit</button>
                    <button onClick={() => handleDeleteTemplate(template.id, template.title)}>Delete</button>
                  </div>
                </div>
                <p className="template-preview">{template.content}</p>
              </div>
            ))}
          </div>
          <button className="add-template-btn" onClick={openAddForm}>+ Add New Template</button>
        </div>

        {/* Automation */}
        <div id="automation" className={`tab-pane ${activeTab === 'automation' ? 'active' : ''}`}>
          <p>Automation settings will go here.</p>
        </div>

        {/* Analytics */}
        <div id="analytics" className={`tab-pane ${activeTab === 'analytics' ? 'active' : ''}`}>
          <p>Analytics overview will go here.</p>
        </div>

        {/* Settings */}
        <div id="settings" className={`tab-pane ${activeTab === 'settings' ? 'active' : ''}`}>
          <p>Settings controls will go here.</p>
        </div>
      </div>

      {/* Modal Form */}
      {formOpen && (
        <div className="modal">
          <form className="modal-content" onSubmit={handleFormSubmit}>
            <h2>{formMode === 'edit' ? 'Edit Template' : 'Add Template'}</h2>
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Content"
              value={formData.content}
              onChange={e => setFormData({ ...formData, content: e.target.value })}
              rows={4}
              required
            />
            <div className="modal-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setFormOpen(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <footer>
        <button className="help-btn">Help</button>
        <button className="feedback-btn">Feedback</button>
      </footer>
    </div>
  );
}

export default App;