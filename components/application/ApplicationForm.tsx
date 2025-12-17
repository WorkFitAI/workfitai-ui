"use client";

import React, { useState } from 'react';
import { useAppSelector } from '@/redux/hooks';
import type { CreateApplicationRequest } from '@/types/application/application';

interface ApplicationFormProps {
  jobId: string;
  onSubmit: (data: CreateApplicationRequest) => Promise<void>;
  onCancel: () => void;
}

const ApplicationForm = ({ jobId, onSubmit, onCancel }: ApplicationFormProps): React.ReactElement => {
  const { user } = useAppSelector(state => state.auth);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Valid email is required';
    }

    if (!cvFile) {
      newErrors.cvFile = 'CV file is required';
    } else {
      const allowedTypes = ['application/pdf', 'application/msword',
                           'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(cvFile.type)) {
        newErrors.cvFile = 'Only PDF, DOC, DOCX files are allowed';
      }
      if (cvFile.size > 10 * 1024 * 1024) {
        newErrors.cvFile = 'File size must be less than 10MB';
      }
    }

    if (coverLetter.length > 5000) {
      newErrors.coverLetter = 'Cover letter must be less than 5000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    console.log('Submitting application with:', { jobId, email, cvFile, coverLetter });

    if (!validateForm() || !cvFile) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        jobId,
        email,
        cvPdfFile: cvFile,
        coverLetter: coverLetter || undefined
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
      setErrors(prev => ({ ...prev, cvFile: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="application-form">
      <h5 className="mb-4">Submit Application</h5>

      {/* Email */}
      <div className="mb-3">
        <label className="form-label">Email Address *</label>
        <input
          type="email"
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      {/* CV Upload */}
      <div className="mb-3">
        <label className="form-label">Upload CV *</label>
        <input
          type="file"
          className={`form-control ${errors.cvFile ? 'is-invalid' : ''}`}
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          required
        />
        <div className="form-text">PDF, DOC, or DOCX format. Max size: 10MB</div>
        {errors.cvFile && <div className="invalid-feedback">{errors.cvFile}</div>}
        {cvFile && (
          <div className="mt-2 text-success">
            <i className="fi fi-rr-check-circle me-2"></i>
            {cvFile.name} ({(cvFile.size / 1024).toFixed(2)} KB)
          </div>
        )}
      </div>

      {/* Cover Letter */}
      <div className="mb-3">
        <label className="form-label">Cover Letter (Optional)</label>
        <textarea
          className={`form-control ${errors.coverLetter ? 'is-invalid' : ''}`}
          rows={6}
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Tell us why you're a great fit for this position..."
          maxLength={5000}
        />
        <div className="form-text">
          {coverLetter.length}/5000 characters
        </div>
        {errors.coverLetter && <div className="invalid-feedback">{errors.coverLetter}</div>}
      </div>

      {/* Actions */}
      <div className="d-flex gap-2">
        <button
          type="submit"
          className="btn btn-brand-1"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Submitting...
            </>
          ) : (
            <>
              <i className="fi fi-rr-paper-plane me-2"></i>
              Submit Application
            </>
          )}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;
