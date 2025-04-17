import React, { useState, useEffect } from 'react';
import './TemplateModal.css';

const TemplateModal = ({ isOpen, onClose, onSave, initialData }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({ ...initialData, title, content });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{initialData ? 'Edit Template' : 'New Template'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Template Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Template Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="modal-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateModal;