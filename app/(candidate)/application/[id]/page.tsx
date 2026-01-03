"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  fetchApplicationById,
  withdrawApplication,
  selectSelectedApplication,
  selectApplicationLoading
} from '@/redux/features/application/applicationSlice';
import { getPublicNotes } from '@/lib/applicationApi';
import StatusBadge from '@/components/application/StatusBadge';
import StatusTimeline from '@/components/application/StatusTimeline';
import type { Note } from '@/types/application/application';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ApplicationDetailPage({ params }: PageProps): React.ReactElement {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const application = useAppSelector(selectSelectedApplication);
  const loading = useAppSelector(selectApplicationLoading);
  const [publicNotes, setPublicNotes] = useState<Note[]>([]);
  const [withdrawing, setWithdrawing] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    params.then(p => setApplicationId(p.id));
  }, [params]);

  useEffect(() => {
    if (!applicationId) return;

    dispatch(fetchApplicationById(applicationId));

    // Fetch public notes
    getPublicNotes(applicationId)
      .then(setPublicNotes)
      .catch(() => {});
  }, [dispatch, applicationId]);

  const handleWithdraw = async (): Promise<void> => {
    if (!applicationId) return;

    if (!confirm('Are you sure you want to withdraw this application? This action cannot be undone.')) {
      return;
    }

    setWithdrawing(true);
    try {
      await dispatch(withdrawApplication(applicationId)).unwrap();
      alert('Application withdrawn successfully');
      router.push('/my-applications');
    } catch {
      alert('Failed to withdraw application');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading || !application) {
    return (
      <div className="section-box mt-80">
        <div className="container">
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  const canWithdraw = !['HIRED', 'REJECTED', 'WITHDRAWN'].includes(application.status);

  return (
    <div className="section-box mt-20">
      <div className="container">
        <div className="row">
          <div className="col-lg-8">
            {/* Application Info */}
            <div className="card card-style-1 mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-4">
                  <div>
                    <h3 className="mb-2">{application.jobSnapshot.title}</h3>
                    <h5 className="text-muted mb-3">
                      {application.jobSnapshot.companyName}
                    </h5>
                  </div>
                  <StatusBadge status={application.status} size="lg" />
                </div>

                <div className="row mb-4">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>Location:</strong>{" "}
                      {application.jobSnapshot.location}
                    </p>
                    <p className="mb-2">
                      <strong>Employment Type:</strong>{" "}
                      {application.jobSnapshot.employmentType}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>Experience Level:</strong>{" "}
                      {application.jobSnapshot.experienceLevel}
                    </p>
                    <p className="mb-2">
                      <strong>Applied:</strong>{" "}
                      {new Date(
                        application.submittedAt || application.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>

                {application.coverLetter && (
                  <div>
                    <h6>Cover Letter</h6>
                    <p
                      className="text-muted"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {application.coverLetter}
                    </p>
                  </div>
                )}

                {canWithdraw && (
                  <div className="mt-4">
                    <button
                      className="btn btn-outline-danger"
                      onClick={handleWithdraw}
                      disabled={withdrawing}
                    >
                      {withdrawing ? "Withdrawing..." : "Withdraw Application"}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* CV Info */}
            <div className="card card-style-1 mb-4">
              <div className="card-body">
                <h6 className="mb-3">Resume/CV</h6>
                <div className="d-flex align-items-center">
                  <i className="fi fi-rr-document text-primary display-6 me-3"></i>
                  <div>
                    <p className="mb-1">
                      <strong>{application.cvFileName}</strong>
                    </p>
                    <p className="text-muted mb-0">
                      {(application.cvFileSize / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Public Notes */}
            {publicNotes.length > 0 && (
              <div className="card card-style-1 mb-4">
                <div className="card-body">
                  <h6 className="mb-3">Messages from Recruiter</h6>
                  {publicNotes.map((note) => (
                    <div key={note.id} className="mb-3 pb-3 border-bottom">
                      <div className="d-flex justify-content-between mb-2">
                        <strong>{note.author}</strong>
                        <small className="text-muted">
                          {new Date(note.createdAt).toLocaleString()}
                        </small>
                      </div>
                      <p className="mb-0" style={{ whiteSpace: "pre-wrap" }}>
                        {note.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Status History */}
            <div className="card card-style-1">
              <div className="card-body">
                <h6 className="mb-3">Application Timeline</h6>
                <StatusTimeline statusHistory={application.statusHistory} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
