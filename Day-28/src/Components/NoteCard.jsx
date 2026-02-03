import React from "react";

const NoteCard = ({ note, onDelete, onEdit }) => {
  return (
    <div className="note-card">
      <div className="card-top">
        <h3 className="card-title">{note.title}</h3>
        <p className="card-text">{note.content}</p>
      </div>
      <div className="card-footer">
        <button className="card-btn" onClick={() => onEdit(note)}>
          Edit
        </button>
        <button className="card-btn" onClick={() => onDelete(note.id)}>
          Delete
        </button>
      </div>

      <style jsx>{`
        .note-card {
          background: white;
          border-radius: 28px;
          border-top: 10px solid #ff6b00;
          padding: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.03);
          min-height: 250px;
        }
        .card-title {
          color: #ff6b00;
          margin: 0 0 15px 0;
          font-size: 22px;
          font-weight: 700;
        }
        .card-text {
          color: #666;
          font-size: 17px;
          line-height: 1.6;
          margin: 0;
        }
        .card-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #f8f8f8;
        }
        .card-btn {
          background: #fff5ed;
          color: #ff6b00;
          border: none;
          padding: 10px 20px;
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .card-btn:hover {
          background: #ff6b00;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default NoteCard;
