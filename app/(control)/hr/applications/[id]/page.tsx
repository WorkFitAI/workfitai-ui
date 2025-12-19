"use client";

import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchApplicationById,
  updateApplicationStatus,
  selectSelectedApplication,
  selectApplicationLoading,
} from "@/redux/features/application/applicationSlice";
import {
  getAllNotes,
  addNote,
  updateNote,
  deleteNote,
  downloadCV,
} from "@/lib/applicationApi";
import { showToast, getErrorMessage } from '@/lib/toast';

import StatusBadge from "@/components/application/StatusBadge";
import StatusTimeline from "@/components/application/StatusTimeline";
import NotesSection from "@/components/application/control/NotesSection";
import StatusUpdateForm from "@/components/application/control/StatusUpdateForm";
import { ApplicationStatus } from "@/types/application/application";
import type { Note } from "@/types/application/application";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ApplicationDetailPage({
  params,
}: PageProps): React.ReactElement {
  const dispatch = useAppDispatch();
  const application = useAppSelector(selectSelectedApplication);
  const loading = useAppSelector(selectApplicationLoading);
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [downloadingCV, setDownloadingCV] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  // Check if status is terminal
  const isTerminalStatus = (status: ApplicationStatus): boolean => {
    return [
      ApplicationStatus.HIRED,
      ApplicationStatus.REJECTED,
      ApplicationStatus.WITHDRAWN,
    ].includes(status);
  };

  useEffect(() => {
    params.then((p) => setApplicationId(p.id));
  }, [params]);

  useEffect(() => {
    if (!applicationId) return;

    dispatch(fetchApplicationById(applicationId));
    fetchNotes();
  }, [dispatch, applicationId]);

  const fetchNotes = async (): Promise<void> => {
    if (!applicationId) return;

    setNotesLoading(true);
    try {
      const data = await getAllNotes(applicationId);
      setNotes(data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setNotesLoading(false);
    }
  };

  const handleDownloadCV = async (): Promise<void> => {
    if (!applicationId) return;

    setDownloadingCV(true);
    try {
      const blob = await downloadCV(applicationId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = application?.cvFileName || 'cv.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      showToast.error(getErrorMessage(error));
    } finally {
      setDownloadingCV(false);
    }
  };

  const handleStatusUpdate = async (
    status: string,
    reason?: string
  ): Promise<void> => {
    if (!applicationId) return;

    try {
      await dispatch(
        updateApplicationStatus({
          id: applicationId,
          request: { status: status as ApplicationStatus, reason },
        })
      ).unwrap();
      showToast.success('Status updated successfully');
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const handleAddNote = async (
    content: string,
    candidateVisible: boolean
  ): Promise<void> => {
    if (!applicationId) return;

    try {
      const newNote = await addNote(applicationId, {
        content,
        candidateVisible,
      });
      setNotes([...notes, newNote]);
      showToast.success('Note added successfully');
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const handleUpdateNote = async (
    noteId: string,
    content: string,
    candidateVisible: boolean
  ): Promise<void> => {
    if (!applicationId) return;

    try {
      const updatedNote = await updateNote(applicationId, noteId, {
        content,
        candidateVisible,
      });
      setNotes(notes.map((note) => (note.id === noteId ? updatedNote : note)));
      showToast.success('Note updated successfully');
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const handleDeleteNote = async (noteId: string): Promise<void> => {
    if (!applicationId) return;
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await deleteNote(applicationId, noteId);
      setNotes(notes.filter((note) => note.id !== noteId));
      showToast.success('Note deleted successfully');
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  if (loading || !application) {
    return (
      <div className="section-box">
        <div className="container">
          <div className="panel-white text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">
                Loading application details...
              </span>
            </div>
            <p className="mt-3 text-muted">Loading application details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-box">
      <div className="container">
        {/* Page Header */}
        <div className="panel-white mb-4">
          <div className="panel-head">
            <div className="d-flex justify-content-between align-items-start mb-3">
              <div className="flex-grow-1">
                <h3
                  className="mb-2"
                  style={{
                    color: "#2D3E50",
                    fontWeight: 600,
                    fontSize: "24px",
                  }}
                >
                  {application.jobSnapshot.title}
                </h3>
                <p
                  className="mb-1"
                  style={{ color: "#6C757D", fontSize: "15px" }}
                >
                  <i
                    className="fi fi-rr-building"
                    style={{ marginRight: "8px" }}
                  ></i>
                  {application.jobSnapshot.companyName}
                </p>
                <p
                  className="mb-0"
                  style={{ color: "#ADB5BD", fontSize: "13px" }}
                >
                  <i
                    className="fi fi-rr-calendar"
                    style={{ marginRight: "8px" }}
                  ></i>
                  Submitted on{" "}
                  {new Date(
                    application.submittedAt || application.createdAt
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div style={{ minWidth: "140px" }}>
                <StatusBadge status={application.status} size="lg" />
              </div>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                paddingTop: "16px",
                borderTop: "1px solid #E9ECEF",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => setShowJobModal(true)}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                  fontWeight: 600,
                  borderRadius: "6px",
                  border: "1px solid #3498DB",
                  backgroundColor: "#FFFFFF",
                  color: "#3498DB",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#EBF5FB";
                  e.currentTarget.style.borderColor = "#2980B9";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#FFFFFF";
                  e.currentTarget.style.borderColor = "#3498DB";
                }}
              >
                <i className="fi fi-rr-briefcase"></i>
                View Job Details
              </button>

              {!isTerminalStatus(application.status) && (
                <button
                  onClick={() => setShowStatusModal(true)}
                  style={{
                    padding: "10px 20px",
                    fontSize: "14px",
                    fontWeight: 600,
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "#F39C12",
                    color: "#FFFFFF",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#E67E22";
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(243, 156, 18, 0.3)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#F39C12";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <i className="fi fi-rr-refresh"></i>
                  Change Status
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8">
            {/* Candidate Information Card */}
            <div className="panel-white mb-4">
              <div className="panel-head">
                <h5
                  className="mb-0"
                  style={{ color: "#2D3E50", fontWeight: 600 }}
                >
                  <i
                    className="fi fi-rr-user"
                    style={{ marginRight: "8px", color: "#3498DB" }}
                  ></i>
                  Candidate Information
                </h5>
              </div>
              <div className="panel-body">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="info-item">
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#6C757D",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                          fontWeight: 500,
                        }}
                      >
                        Full Name
                      </label>
                      <p
                        style={{
                          fontSize: "16px",
                          color: "#212529",
                          marginBottom: 0,
                          fontWeight: 500,
                        }}
                      >
                        {application.username}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#6C757D",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                          fontWeight: 500,
                        }}
                      >
                        Email Address
                      </label>
                      <p
                        style={{
                          fontSize: "16px",
                          color: "#3498DB",
                          marginBottom: 0,
                          fontWeight: 500,
                        }}
                      >
                        <i
                          className="fi fi-rr-envelope"
                          style={{ marginRight: "6px" }}
                        ></i>
                        {application.email}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className="info-item">
                      <label
                        style={{
                          display: "block",
                          fontSize: "12px",
                          color: "#6C757D",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginBottom: "8px",
                          fontWeight: 500,
                        }}
                      >
                        Resume / CV
                      </label>
                      <div
                        className="d-flex align-items-center"
                        style={{
                          padding: "16px",
                          backgroundColor: "#F8F9FA",
                          borderRadius: "6px",
                          border: "1px solid #E9ECEF",
                        }}
                      >
                        <div
                          style={{
                            width: "44px",
                            height: "44px",
                            backgroundColor: "#3498DB",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: "12px",
                            flexShrink: 0,
                          }}
                        >
                          <i
                            className="fi fi-rr-file-pdf"
                            style={{ fontSize: "20px", color: "#FFFFFF" }}
                          ></i>
                        </div>
                        <div className="flex-grow-1">
                          <p
                            style={{
                              fontSize: "14px",
                              fontWeight: 600,
                              color: "#212529",
                              marginBottom: "2px",
                            }}
                          >
                            {application.cvFileName}
                          </p>
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#6C757D",
                              marginBottom: 0,
                            }}
                          >
                            {(application.cvFileSize / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <button
                          onClick={handleDownloadCV}
                          disabled={downloadingCV}
                          style={{
                            padding: "8px 20px",
                            fontSize: "13px",
                            fontWeight: 600,
                            borderRadius: "5px",
                            border: "none",
                            backgroundColor: downloadingCV
                              ? "#ADB5BD"
                              : "#3498DB",
                            color: "#FFFFFF",
                            transition: "all 0.2s ease",
                            cursor: downloadingCV ? "not-allowed" : "pointer",
                          }}
                          onMouseOver={(e) => {
                            if (!downloadingCV) {
                              e.currentTarget.style.backgroundColor = "#2980B9";
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!downloadingCV) {
                              e.currentTarget.style.backgroundColor = "#3498DB";
                            }
                          }}
                        >
                          {downloadingCV ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                style={{ width: "12px", height: "12px" }}
                              ></span>
                              Downloading...
                            </>
                          ) : (
                            <>
                              <i
                                className="fi fi-rr-download"
                                style={{ marginRight: "5px" }}
                              ></i>
                              Download
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cover Letter Card */}
            {application.coverLetter && (
              <div className="panel-white mb-4">
                <div className="panel-head">
                  <h5
                    className="mb-0"
                    style={{ color: "#2D3E50", fontWeight: 600 }}
                  >
                    <i
                      className="fi fi-rr-edit"
                      style={{ marginRight: "8px", color: "#3498DB" }}
                    ></i>
                    Cover Letter
                  </h5>
                </div>
                <div className="panel-body">
                  <div
                    style={{
                      padding: "20px",
                      backgroundColor: "#F8F9FA",
                      borderRadius: "8px",
                      border: "1px solid #E9ECEF",
                      lineHeight: "1.6",
                    }}
                  >
                    <p
                      style={{
                        whiteSpace: "pre-wrap",
                        color: "#495057",
                        fontSize: "15px",
                        marginBottom: 0,
                      }}
                    >
                      {application.coverLetter}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notes Section */}
            <div className="panel-white">
              <div className="panel-head">
                <h5
                  className="mb-0"
                  style={{ color: "#2D3E50", fontWeight: 600 }}
                >
                  <i
                    className="fi fi-rr-comment"
                    style={{ marginRight: "8px", color: "#9B59B6" }}
                  ></i>
                  Internal Notes
                </h5>
              </div>
              <div className="panel-body">
                <NotesSection
                  notes={notes}
                  loading={notesLoading}
                  onAdd={handleAddNote}
                  onUpdate={handleUpdateNote}
                  onDelete={handleDeleteNote}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div
              className="panel-white"
              style={{ position: "sticky", top: "20px" }}
            >
              <div className="panel-head">
                <h5
                  className="mb-0"
                  style={{ color: "#2D3E50", fontWeight: 600 }}
                >
                  <i
                    className="fi fi-rr-time-past"
                    style={{ marginRight: "8px", color: "#27AE60" }}
                  ></i>
                  Application Timeline
                </h5>
              </div>
              <div className="panel-body">
                <StatusTimeline statusHistory={application.statusHistory} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setShowStatusModal(false)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              maxWidth: "600px",
              width: "100%",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "24px 28px",
                borderBottom: "1px solid #E9ECEF",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h4
                  style={{
                    margin: 0,
                    color: "#2D3E50",
                    fontWeight: 600,
                    marginBottom: "6px",
                  }}
                >
                  <i
                    className="fi fi-rr-refresh"
                    style={{ marginRight: "10px", color: "#F39C12" }}
                  ></i>
                  Change Application Status
                </h4>
                <p style={{ margin: 0, fontSize: "13px", color: "#6C757D" }}>
                  Current: <StatusBadge status={application.status} size="sm" />
                </p>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#F8F9FA",
                  color: "#6C757D",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#E74C3C";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#F8F9FA";
                  e.currentTarget.style.color = "#6C757D";
                }}
              >
                <i className="fi fi-rr-cross" style={{ fontSize: "16px" }}></i>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "28px" }}>
              <StatusUpdateForm
                currentStatus={application.status}
                onSubmit={async (status, reason) => {
                  await handleStatusUpdate(status, reason);
                  setShowStatusModal(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Job Snapshot Modal */}
      {showJobModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setShowJobModal(false)}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "12px",
              maxWidth: "800px",
              width: "100%",
              maxHeight: "90vh",
              overflow: "auto",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: "24px 28px",
                borderBottom: "1px solid #E9ECEF",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h4 style={{ margin: 0, color: "#2D3E50", fontWeight: 600 }}>
                <i
                  className="fi fi-rr-briefcase"
                  style={{ marginRight: "10px", color: "#3498DB" }}
                ></i>
                Job Details
              </h4>
              <button
                onClick={() => setShowJobModal(false)}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#F8F9FA",
                  color: "#6C757D",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#E74C3C";
                  e.currentTarget.style.color = "#FFFFFF";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#F8F9FA";
                  e.currentTarget.style.color = "#6C757D";
                }}
              >
                <i className="fi fi-rr-cross" style={{ fontSize: "16px" }}></i>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "28px" }}>
              {/* Job Title & Company */}
              <div style={{ marginBottom: "24px" }}>
                <h3
                  style={{
                    color: "#2D3E50",
                    fontWeight: 600,
                    marginBottom: "8px",
                  }}
                >
                  {application.jobSnapshot.title}
                </h3>
                <p
                  style={{
                    color: "#6C757D",
                    fontSize: "16px",
                    marginBottom: "4px",
                  }}
                >
                  <i
                    className="fi fi-rr-building"
                    style={{ marginRight: "8px" }}
                  ></i>
                  {application.jobSnapshot.companyName}
                </p>
                <p
                  style={{
                    color: "#ADB5BD",
                    fontSize: "14px",
                    marginBottom: 0,
                  }}
                >
                  <i
                    className="fi fi-rr-marker"
                    style={{ marginRight: "8px" }}
                  ></i>
                  {application.jobSnapshot.companyAddress}
                </p>
              </div>

              {/* Job Status & Stats */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  flexWrap: "wrap",
                  marginBottom: "24px",
                }}
              >
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    backgroundColor:
                      application.jobSnapshot.status === "PUBLISHED"
                        ? "#27AE60"
                        : "#95A5A6",
                    color: "#FFFFFF",
                  }}
                >
                  {application.jobSnapshot.status}
                </span>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 500,
                    backgroundColor: "#F8F9FA",
                    color: "#495057",
                  }}
                >
                  <i
                    className="fi fi-rr-users"
                    style={{ marginRight: "6px" }}
                  ></i>
                  {application.jobSnapshot.totalApplications} Application(s)
                </span>
                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "13px",
                    fontWeight: 500,
                    backgroundColor: "#F8F9FA",
                    color: "#495057",
                  }}
                >
                  <i
                    className="fi fi-rr-user-add"
                    style={{ marginRight: "6px" }}
                  ></i>
                  {application.jobSnapshot.quantity} Position(s)
                </span>
              </div>

              {/* Short Description */}
              {application.jobSnapshot.shortDescription && (
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#F8F9FA",
                    borderRadius: "8px",
                    marginBottom: "24px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#495057",
                      marginBottom: 0,
                      fontStyle: "italic",
                    }}
                  >
                    {application.jobSnapshot.shortDescription}
                  </p>
                </div>
              )}

              {/* Job Details Grid */}
              <div className="row g-4" style={{ marginBottom: "24px" }}>
                <div className="col-md-6">
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E9ECEF",
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6C757D",
                        marginBottom: "6px",
                      }}
                    >
                      <i
                        className="fi fi-rr-briefcase"
                        style={{ marginRight: "6px" }}
                      ></i>
                      EMPLOYMENT TYPE
                    </p>
                    <p
                      style={{
                        fontSize: "15px",
                        color: "#212529",
                        fontWeight: 600,
                        marginBottom: 0,
                      }}
                    >
                      {application.jobSnapshot.employmentType.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E9ECEF",
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6C757D",
                        marginBottom: "6px",
                      }}
                    >
                      <i
                        className="fi fi-rr-graduation-cap"
                        style={{ marginRight: "6px" }}
                      ></i>
                      EXPERIENCE LEVEL
                    </p>
                    <p
                      style={{
                        fontSize: "15px",
                        color: "#212529",
                        fontWeight: 600,
                        marginBottom: 0,
                      }}
                    >
                      {application.jobSnapshot.experienceLevel}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E9ECEF",
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6C757D",
                        marginBottom: "6px",
                      }}
                    >
                      <i
                        className="fi fi-rr-book"
                        style={{ marginRight: "6px" }}
                      ></i>
                      EDUCATION LEVEL
                    </p>
                    <p
                      style={{
                        fontSize: "15px",
                        color: "#212529",
                        fontWeight: 600,
                        marginBottom: 0,
                      }}
                    >
                      {application.jobSnapshot.educationLevel}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E9ECEF",
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6C757D",
                        marginBottom: "6px",
                      }}
                    >
                      <i
                        className="fi fi-rr-marker"
                        style={{ marginRight: "6px" }}
                      ></i>
                      LOCATION
                    </p>
                    <p
                      style={{
                        fontSize: "15px",
                        color: "#212529",
                        fontWeight: 600,
                        marginBottom: 0,
                      }}
                    >
                      {application.jobSnapshot.location}
                    </p>
                  </div>
                </div>
                <div className="col-md-12">
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E9ECEF",
                      borderRadius: "8px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#6C757D",
                        marginBottom: "6px",
                      }}
                    >
                      <i
                        className="fi fi-rr-usd-circle"
                        style={{ marginRight: "6px" }}
                      ></i>
                      SALARY RANGE
                    </p>
                    <p
                      style={{
                        fontSize: "16px",
                        color: "#27AE60",
                        fontWeight: 700,
                        marginBottom: 0,
                      }}
                    >
                      {application.jobSnapshot.salaryMin.toLocaleString()} -{" "}
                      {application.jobSnapshot.salaryMax.toLocaleString()}{" "}
                      {application.jobSnapshot.currency}
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {application.jobSnapshot.skillNames &&
                application.jobSnapshot.skillNames.length > 0 && (
                  <div style={{ marginBottom: "24px" }}>
                    <h6
                      style={{
                        color: "#2D3E50",
                        fontWeight: 600,
                        marginBottom: "12px",
                      }}
                    >
                      <i
                        className="fi fi-rr-lightbulb"
                        style={{ marginRight: "8px", color: "#F39C12" }}
                      ></i>
                      Required Skills
                    </h6>
                    <div
                      style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                    >
                      {application.jobSnapshot.skillNames.map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            padding: "6px 14px",
                            backgroundColor: "#3498DB",
                            color: "#FFFFFF",
                            borderRadius: "20px",
                            fontSize: "13px",
                            fontWeight: 500,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Job Description */}
              <div style={{ marginBottom: "24px" }}>
                <h6
                  style={{
                    color: "#2D3E50",
                    fontWeight: 600,
                    marginBottom: "12px",
                  }}
                >
                  <i
                    className="fi fi-rr-document"
                    style={{ marginRight: "8px", color: "#9B59B6" }}
                  ></i>
                  Job Description
                </h6>
                <div
                  style={{
                    padding: "16px",
                    backgroundColor: "#F8F9FA",
                    borderRadius: "8px",
                    border: "1px solid #E9ECEF",
                  }}
                >
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#495057",
                      lineHeight: "1.7",
                      marginBottom: 0,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {application.jobSnapshot.description}
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="row g-3">
                <div className="col-md-4">
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#6C757D",
                      marginBottom: "4px",
                    }}
                  >
                    <i
                      className="fi fi-rr-calendar-plus"
                      style={{ marginRight: "6px" }}
                    ></i>
                    Created Date
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#495057",
                      fontWeight: 500,
                      marginBottom: 0,
                    }}
                  >
                    {new Date(
                      application.jobSnapshot.createdDate
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="col-md-4">
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#6C757D",
                      marginBottom: "4px",
                    }}
                  >
                    <i
                      className="fi fi-rr-calendar-clock"
                      style={{ marginRight: "6px" }}
                    ></i>
                    Expires At
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#E74C3C",
                      fontWeight: 500,
                      marginBottom: 0,
                    }}
                  >
                    {new Date(
                      application.jobSnapshot.expiresAt
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="col-md-4">
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#6C757D",
                      marginBottom: "4px",
                    }}
                  >
                    <i
                      className="fi fi-rr-user"
                      style={{ marginRight: "6px" }}
                    ></i>
                    Created By
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "#495057",
                      fontWeight: 500,
                      marginBottom: 0,
                    }}
                  >
                    {application.jobSnapshot.createdBy}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: "20px 28px",
                borderTop: "1px solid #E9ECEF",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={() => setShowJobModal(false)}
                style={{
                  padding: "10px 28px",
                  fontSize: "14px",
                  fontWeight: 600,
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "#3498DB",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#2980B9";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#3498DB";
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
