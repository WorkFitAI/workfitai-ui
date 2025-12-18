"use client";

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchApplicationById,
  updateApplicationStatus,
  selectSelectedApplication,
  selectApplicationLoading
} from '@/redux/features/application/applicationSlice';
import {
  getAllNotes,
  addNote,
  updateNote,
  deleteNote,
  downloadCV
} from '@/lib/applicationApi';
import { showToast, getErrorMessage } from '@/lib/toast';

import StatusBadge from '@/components/application/StatusBadge';
import StatusTimeline from '@/components/application/StatusTimeline';
import NotesSection from '@/components/application/control/NotesSection';
import StatusUpdateForm from '@/components/application/control/StatusUpdateForm';
import type { Note, ApplicationStatus } from '@/types/application/application';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ApplicationDetailPage({ params }: PageProps): React.ReactElement {
  const dispatch = useAppDispatch();
  const application = useAppSelector(selectSelectedApplication);
  const loading = useAppSelector(selectApplicationLoading);
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [downloadingCV, setDownloadingCV] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setApplicationId(p.id));
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
      console.error('Failed to fetch notes:', error);
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

  const handleStatusUpdate = async (status: string, reason?: string): Promise<void> => {
    if (!applicationId) return;

    try {
      await dispatch(updateApplicationStatus({
        id: applicationId,
        request: { status: status as ApplicationStatus, reason }
      })).unwrap();
      showToast.success('Status updated successfully');
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const handleAddNote = async (content: string, candidateVisible: boolean): Promise<void> => {
    if (!applicationId) return;

    try {
      const newNote = await addNote(applicationId, { content, candidateVisible });
      setNotes([...notes, newNote]);
      showToast.success('Note added successfully');
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const handleUpdateNote = async (noteId: string, content: string, candidateVisible: boolean): Promise<void> => {
    if (!applicationId) return;

    try {
      const updatedNote = await updateNote(applicationId, noteId, { content, candidateVisible });
      setNotes(notes.map(note => note.id === noteId ? updatedNote : note));
      showToast.success('Note updated successfully');
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const handleDeleteNote = async (noteId: string): Promise<void> => {
    if (!applicationId) return;
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      await deleteNote(applicationId, noteId);
      setNotes(notes.filter(note => note.id !== noteId));
      showToast.success('Note deleted successfully');
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  if (loading || !application) {
    return (
      <>
        <div className="col-lg-12">
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="col-lg-8">
        {/* Application Info Card */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h4 className="mb-2">{application.jobSnapshot.title}</h4>
                <h6 className="text-muted">{application.jobSnapshot.companyName}</h6>
              </div>
              <StatusBadge status={application.status} size="lg" />
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <p className="mb-2">
                  <strong>Candidate:</strong> {application.username}
                </p>
                <p className="mb-2">
                  <strong>Email:</strong> {application.email}
                </p>
                <p className="mb-2">
                  <strong>Location:</strong> {application.jobSnapshot.location}
                </p>
              </div>
              <div className="col-md-6">
                <p className="mb-2">
                  <strong>Submitted:</strong>{' '}
                  {new Date(application.submittedAt || application.createdAt).toLocaleString()}
                </p>
                <p className="mb-2">
                  <strong>Assigned To:</strong>{' '}
                  {application.assignedTo || <span className="text-muted">Unassigned</span>}
                </p>
              </div>
            </div>

            {/* CV Download */}
            <div className="mb-4">
              <h6>Resume/CV</h6>
              <div className="d-flex align-items-center gap-3">
                <i className="fi fi-rr-document text-primary display-6"></i>
                <div className="flex-grow-1">
                  <p className="mb-1"><strong>{application.cvFileName}</strong></p>
                  <p className="text-muted mb-0">
                    {(application.cvFileSize / 1024).toFixed(2)} KB
                  </p>
                </div>
                <button
                  className="btn btn-outline-primary"
                  onClick={handleDownloadCV}
                  disabled={downloadingCV}
                >
                  {downloadingCV ? 'Downloading...' : 'Download CV'}
                </button>
              </div>
            </div>

            {/* Cover Letter */}
            {application.coverLetter && (
              <div>
                <h6>Cover Letter</h6>
                <p className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>
                  {application.coverLetter}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Status Update Form */}
        <div className="card mb-4">
          <div className="card-body">
            <h6 className="mb-3">Update Status</h6>
            <StatusUpdateForm
              currentStatus={application.status}
              onSubmit={handleStatusUpdate}
            />
          </div>
        </div>

        {/* Notes Section */}
        <div className="card">
          <div className="card-body">
            <h6 className="mb-3">Notes</h6>
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
        <div className="card">
          <div className="card-body">
            <h6 className="mb-3">Application Timeline</h6>
            <StatusTimeline statusHistory={application.statusHistory} />
          </div>
        </div>
      </div>
    </>
  );
}
