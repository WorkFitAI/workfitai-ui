"use client";

import React, { useState } from 'react';
import type { Note } from '@/types/application/application';

interface NotesSectionProps {
  notes: Note[];
  loading: boolean;
  onAdd: (content: string, candidateVisible: boolean) => Promise<void>;
  onUpdate: (noteId: string, content: string, candidateVisible: boolean) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
}

const NotesSection = ({ notes, loading, onAdd, onUpdate, onDelete }: NotesSectionProps): React.ReactElement => {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCandidateVisible, setNewNoteCandidateVisible] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editCandidateVisible, setEditCandidateVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd(newNoteContent, newNoteCandidateVisible);
      setNewNoteContent('');
      setNewNoteCandidateVisible(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (note: Note): void => {
    setEditingNoteId(note.id);
    setEditContent(note.content);
    setEditCandidateVisible(note.candidateVisible);
  };

  const handleUpdate = async (noteId: string): Promise<void> => {
    setIsSubmitting(true);
    try {
      await onUpdate(noteId, editContent, editCandidateVisible);
      setEditingNoteId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = (): void => {
    setEditingNoteId(null);
    setEditContent('');
  };

  if (loading) {
    return <div className="text-center py-3"><div className="spinner-border spinner-border-sm"></div></div>;
  }

  return (
    <div>
      {/* Add Note Form */}
      <form onSubmit={handleAdd} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Add Note</label>
          <textarea
            className="form-control"
            rows={3}
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Write a note about this application..."
            maxLength={2000}
            required
          />
          <div className="form-text">{newNoteContent.length}/2000 characters</div>
        </div>

        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="candidateVisible"
            checked={newNoteCandidateVisible}
            onChange={(e) => setNewNoteCandidateVisible(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="candidateVisible">
            Visible to candidate
          </label>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || !newNoteContent.trim()}
        >
          {isSubmitting ? 'Adding...' : 'Add Note'}
        </button>
      </form>

      {/* Notes List */}
      <div className="notes-list">
        {notes.length === 0 ? (
          <p className="text-muted">No notes yet</p>
        ) : (
          notes.map(note => (
            <div key={note.id} className="card mb-3">
              <div className="card-body">
                {editingNoteId === note.id ? (
                  // Edit Mode
                  <div>
                    <textarea
                      className="form-control mb-2"
                      rows={3}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      maxLength={2000}
                    />
                    <div className="form-check mb-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`edit-visible-${note.id}`}
                        checked={editCandidateVisible}
                        onChange={(e) => setEditCandidateVisible(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor={`edit-visible-${note.id}`}>
                        Visible to candidate
                      </label>
                    </div>
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-success"
                        onClick={() => handleUpdate(note.id)}
                        disabled={isSubmitting}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="d-flex justify-content-between mb-2">
                      <div>
                        <strong>{note.author}</strong>
                        {note.candidateVisible && (
                          <span className="badge bg-info ms-2">Visible to candidate</span>
                        )}
                      </div>
                      <div>
                        <small className="text-muted me-3">
                          {new Date(note.createdAt).toLocaleString()}
                        </small>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEdit(note)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDelete(note.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                      {note.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesSection;
