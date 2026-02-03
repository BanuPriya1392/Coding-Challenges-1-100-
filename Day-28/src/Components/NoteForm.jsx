import React, { useState, useEffect } from "react";

const NoteForm = ({ onSave, editData, onCancel }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editData) {
      setTitle(editData.title);
      setContent(editData.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [editData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({ title, content });
    setTitle("");
    setContent("");
  };

  return (
    <div className="sidebar-card">
      <h2 className="sidebar-title">
        {editData ? "Update Note" : "Capture your thoughts"}
      </h2>
      <form onSubmit={handleSubmit} className="form-stack">
        <input
          className="input-field"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="input-field textarea-field"
          placeholder="What's on your mind..."
          rows="10"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="button-row">
          <button type="submit" className="save-btn">
            {editData ? "Update Note" : "Save Note"}
          </button>
          {editData && (
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>

      <style jsx>{`
        .sidebar-card {
          background: white;
          padding: 40px;
          border-radius: 24px;
          border: 2px solid #ff6b00;
          box-shadow: 0 15px 35px rgba(255, 107, 0, 0.05);
        }
        .sidebar-title {
          color: #ff6b00;
          margin: 0 0 30px 0;
          font-size: 24px;
        }
        .form-stack {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .input-field {
          padding: 18px;
          border: 1px solid #f0f0f0;
          background: #fafafa;
          border-radius: 14px;
          outline: none;
          font-size: 16px;
          width: 100%;
          box-sizing: border-box;
        }
        .input-field:focus {
          border-color: #ff6b00;
          background: #fff;
        }
        .save-btn {
          background: #ff6b00;
          color: white;
          padding: 16px;
          border: none;
          border-radius: 14px;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          flex-grow: 1;
        }
        .cancel-btn {
          padding: 16px 20px;
          background: #eee;
          border: none;
          border-radius: 14px;
          cursor: pointer;
        }
        .button-row {
          display: flex;
          gap: 10px;
        }
      `}</style>
    </div>
  );
};

export default NoteForm;
