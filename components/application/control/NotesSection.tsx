"use client";

import React, { useState } from "react";
import type { Note } from "@/types/application/application";

interface NotesSectionProps {
  notes: Note[];
  loading: boolean;
  onAdd: (content: string, candidateVisible: boolean) => Promise<void>;
  onUpdate: (
    noteId: string,
    content: string,
    candidateVisible: boolean
  ) => Promise<void>;
  onDelete: (noteId: string) => Promise<void>;
}

const NotesSection = ({
  notes,
  loading,
  onAdd,
  onUpdate,
  onDelete,
}: NotesSectionProps): React.ReactElement => {
  const [newNoteContent, setNewNoteContent] = useState("");
  const [newNoteCandidateVisible, setNewNoteCandidateVisible] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editCandidateVisible, setEditCandidateVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onAdd(newNoteContent, newNoteCandidateVisible);
      setNewNoteContent("");
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
    setEditContent("");
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <div
          className="spinner-border spinner-border-sm"
          role="status"
          style={{ color: "#3498DB" }}
        >
          <span className="visually-hidden">Loading notes...</span>
        </div>
        <p className="mt-2 mb-0" style={{ fontSize: "14px", color: "#6C757D" }}>
          Loading notes...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Add Note Form */}
      <form
        onSubmit={handleAdd}
        className="mb-4"
        style={{
          padding: "20px",
          backgroundColor: "#F8F9FA",
          borderRadius: "8px",
          border: "1px solid #E9ECEF",
        }}
      >
        <div className="mb-3">
          <label
            className="form-label"
            style={{
              fontSize: "13px",
              fontWeight: 600,
              color: "#495057",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: "8px",
            }}
          >
            Add New Note
          </label>
          <textarea
            className="form-control"
            rows={4}
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Write a note about this application..."
            maxLength={2000}
            required
            style={{
              padding: "12px 16px",
              fontSize: "14px",
              border: "1px solid #DEE2E6",
              borderRadius: "6px",
              backgroundColor: "#FFFFFF",
              color: "#212529",
              lineHeight: "1.6",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#3498DB";
              e.currentTarget.style.boxShadow =
                "0 0 0 3px rgba(52, 152, 219, 0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#DEE2E6";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "6px",
            }}
          >
            <small style={{ fontSize: "12px", color: "#6C757D" }}>
              {newNoteContent.length}/2000 characters
            </small>
          </div>
        </div>

        <div className="mb-3">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              backgroundColor: "#FFFFFF",
              border: "1px solid #DEE2E6",
              borderRadius: "6px",
            }}
          >
            <input
              type="checkbox"
              id="candidateVisible"
              checked={newNoteCandidateVisible}
              onChange={(e) => setNewNoteCandidateVisible(e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                cursor: "pointer",
                accentColor: "#3498DB",
              }}
            />
            <label
              htmlFor="candidateVisible"
              style={{
                marginLeft: "12px",
                marginBottom: 0,
                fontSize: "14px",
                color: "#495057",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              <i
                className="fi fi-rr-eye"
                style={{ marginRight: "6px", color: "#3498DB" }}
              ></i>
              Visible to candidate
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !newNoteContent.trim()}
          style={{
            padding: "12px 32px",
            fontSize: "15px",
            fontWeight: 600,
            borderRadius: "6px",
            border: "none",
            backgroundColor:
              isSubmitting || !newNoteContent.trim() ? "#ADB5BD" : "#9B59B6",
            color: "#FFFFFF",
            transition: "all 0.2s ease",
            cursor:
              isSubmitting || !newNoteContent.trim()
                ? "not-allowed"
                : "pointer",
          }}
          onMouseOver={(e) => {
            if (!isSubmitting && newNoteContent.trim()) {
              e.currentTarget.style.backgroundColor = "#8E44AD";
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(155, 89, 182, 0.3)";
            }
          }}
          onMouseOut={(e) => {
            if (!isSubmitting && newNoteContent.trim()) {
              e.currentTarget.style.backgroundColor = "#9B59B6";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }
          }}
        >
          {isSubmitting ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
              ></span>
              Adding Note...
            </>
          ) : (
            <>
              <i className="fi fi-rr-plus" style={{ marginRight: "6px" }}></i>
              Add Note
            </>
          )}
        </button>
      </form>

      {/* Notes List */}
      <div className="notes-list">
        {notes.length === 0 ? (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              backgroundColor: "#F8F9FA",
              borderRadius: "8px",
              border: "1px dashed #DEE2E6",
            }}
          >
            <i
              className="fi fi-rr-comment-info"
              style={{
                fontSize: "48px",
                color: "#CED4DA",
                marginBottom: "12px",
              }}
            ></i>
            <p style={{ fontSize: "15px", color: "#6C757D", marginBottom: 0 }}>
              No notes yet. Add your first note above.
            </p>
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              style={{
                marginBottom: "16px",
                padding: "20px",
                backgroundColor: "#FFFFFF",
                border: "1px solid #E9ECEF",
                borderRadius: "8px",
                transition: "all 0.2s ease",
              }}
            >
              {editingNoteId === note.id ? (
                // Edit Mode
                <div>
                  <textarea
                    className="form-control mb-3"
                    rows={4}
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    maxLength={2000}
                    style={{
                      padding: "12px 16px",
                      fontSize: "14px",
                      border: "1px solid #DEE2E6",
                      borderRadius: "6px",
                      backgroundColor: "#FFFFFF",
                      color: "#212529",
                      lineHeight: "1.6",
                    }}
                  />
                  <div className="mb-3">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "12px 16px",
                        backgroundColor: "#F8F9FA",
                        border: "1px solid #DEE2E6",
                        borderRadius: "6px",
                      }}
                    >
                      <input
                        type="checkbox"
                        id={`edit-visible-${note.id}`}
                        checked={editCandidateVisible}
                        onChange={(e) =>
                          setEditCandidateVisible(e.target.checked)
                        }
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                          accentColor: "#3498DB",
                        }}
                      />
                      <label
                        htmlFor={`edit-visible-${note.id}`}
                        style={{
                          marginLeft: "12px",
                          marginBottom: 0,
                          fontSize: "14px",
                          color: "#495057",
                          fontWeight: 500,
                          cursor: "pointer",
                        }}
                      >
                        Visible to candidate
                      </label>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      onClick={() => handleUpdate(note.id)}
                      disabled={isSubmitting}
                      style={{
                        padding: "10px 24px",
                        fontSize: "14px",
                        fontWeight: 600,
                        borderRadius: "6px",
                        border: "none",
                        backgroundColor: isSubmitting ? "#ADB5BD" : "#27AE60",
                        color: "#FFFFFF",
                        transition: "all 0.2s ease",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                      }}
                      onMouseOver={(e) => {
                        if (!isSubmitting) {
                          e.currentTarget.style.backgroundColor = "#229954";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isSubmitting) {
                          e.currentTarget.style.backgroundColor = "#27AE60";
                        }
                      }}
                    >
                      <i
                        className="fi fi-rr-check"
                        style={{ marginRight: "6px" }}
                      ></i>
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSubmitting}
                      style={{
                        padding: "10px 24px",
                        fontSize: "14px",
                        fontWeight: 600,
                        borderRadius: "6px",
                        border: "1px solid #DEE2E6",
                        backgroundColor: "#FFFFFF",
                        color: "#6C757D",
                        transition: "all 0.2s ease",
                        cursor: isSubmitting ? "not-allowed" : "pointer",
                      }}
                      onMouseOver={(e) => {
                        if (!isSubmitting) {
                          e.currentTarget.style.backgroundColor = "#F8F9FA";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (!isSubmitting) {
                          e.currentTarget.style.backgroundColor = "#FFFFFF";
                        }
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: "#3498DB",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: "12px",
                        }}
                      >
                        <span
                          style={{
                            color: "#FFFFFF",
                            fontWeight: 600,
                            fontSize: "14px",
                          }}
                        >
                          {note.author.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#212529",
                            marginBottom: "2px",
                          }}
                        >
                          {note.author}
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#6C757D",
                            marginBottom: 0,
                          }}
                        >
                          {new Date(note.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      {note.candidateVisible && (
                        <span
                          style={{
                            padding: "4px 12px",
                            fontSize: "12px",
                            fontWeight: 600,
                            backgroundColor: "#3498DB",
                            color: "#FFFFFF",
                            borderRadius: "4px",
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <i
                            className="fi fi-rr-eye"
                            style={{ marginRight: "4px", fontSize: "11px" }}
                          ></i>
                          Visible
                        </span>
                      )}
                      <button
                        onClick={() => handleEdit(note)}
                        style={{
                          padding: "6px 12px",
                          fontSize: "13px",
                          fontWeight: 500,
                          border: "1px solid #DEE2E6",
                          backgroundColor: "#FFFFFF",
                          color: "#6C757D",
                          borderRadius: "4px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "#F8F9FA";
                          e.currentTarget.style.borderColor = "#3498DB";
                          e.currentTarget.style.color = "#3498DB";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "#FFFFFF";
                          e.currentTarget.style.borderColor = "#DEE2E6";
                          e.currentTarget.style.color = "#6C757D";
                        }}
                      >
                        <i
                          className="fi fi-rr-edit"
                          style={{ marginRight: "4px" }}
                        ></i>
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(note.id)}
                        style={{
                          padding: "6px 12px",
                          fontSize: "13px",
                          fontWeight: 500,
                          border: "1px solid #DEE2E6",
                          backgroundColor: "#FFFFFF",
                          color: "#6C757D",
                          borderRadius: "4px",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "#FFF5F5";
                          e.currentTarget.style.borderColor = "#E74C3C";
                          e.currentTarget.style.color = "#E74C3C";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "#FFFFFF";
                          e.currentTarget.style.borderColor = "#DEE2E6";
                          e.currentTarget.style.color = "#6C757D";
                        }}
                      >
                        <i
                          className="fi fi-rr-trash"
                          style={{ marginRight: "4px" }}
                        ></i>
                        Delete
                      </button>
                    </div>
                  </div>
                  <p
                    style={{
                      whiteSpace: "pre-wrap",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color: "#495057",
                      marginBottom: 0,
                      paddingLeft: "48px",
                    }}
                  >
                    {note.content}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotesSection;
