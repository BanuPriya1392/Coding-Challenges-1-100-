import React, { useState, useEffect } from "react";
import NoteForm from "./Components/NoteForm";
import NoteCard from "./Components/NoteCard";

function App() {
  // Initialize state by checking LocalStorage first
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("smart-notes-data");
    return savedNotes
      ? JSON.parse(savedNotes)
      : [
          {
            id: 1,
            title: "Welcome",
            content: "Your notes are now saved automatically!",
          },
        ];
  });

  const [search, setSearch] = useState("");
  const [editingNote, setEditingNote] = useState(null);

  // Sync with LocalStorage whenever the notes array changes
  useEffect(() => {
    localStorage.setItem("smart-notes-data", JSON.stringify(notes));
  }, [notes]);

  const saveNote = (noteData) => {
    if (editingNote) {
      setNotes(
        notes.map((n) =>
          n.id === editingNote.id ? { ...noteData, id: n.id } : n,
        ),
      );
      setEditingNote(null);
    } else {
      setNotes([{ id: Date.now(), ...noteData }, ...notes]);
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const startEdit = (note) => {
    setEditingNote(note);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="logo">SmartNotes Using React</h1>
        <input
          className="search-bar"
          placeholder="Find a note..."
          onChange={(e) => setSearch(e.target.value)}
        />
      </header>

      <main className="main-layout">
        <div className="sidebar">
          <NoteForm
            onSave={saveNote}
            editData={editingNote}
            onCancel={() => setEditingNote(null)}
          />
        </div>

        <div className="notes-grid">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={deleteNote}
              onEdit={startEdit}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
