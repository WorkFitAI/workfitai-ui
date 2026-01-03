"use client";

import React, { useRef, useState } from "react";

interface UploadCVModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

const UploadCVModal = ({
  isOpen,
  onClose,
  onUpload,
  isUploading,
}: UploadCVModalProps): React.ReactElement | null => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (file: File): void => {
    setError(null);

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async (): Promise<void> => {
    if (!selectedFile) return;

    try {
      await onUpload(selectedFile);
      // Reset on success
      setSelectedFile(null);
      setError(null);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload CV");
    }
  };

  const handleClose = (): void => {
    if (!isUploading) {
      setSelectedFile(null);
      setError(null);
      onClose();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Upload CV</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              disabled={isUploading}
              aria-label="Close"
            ></button>
          </div>

          <div className="modal-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                <i className="fi fi-rr-exclamation me-2"></i>
                {error}
              </div>
            )}

            <div
              className={`upload-area border rounded p-4 text-center ${
                dragActive ? "border-primary bg-light" : "border-dashed"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                borderStyle: dragActive ? "solid" : "dashed",
                borderWidth: "2px",
                cursor: "pointer",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
                disabled={isUploading}
              />

              {selectedFile ? (
                <div>
                  <i
                    className="fi fi-rr-check-circle text-success"
                    style={{ fontSize: "48px" }}
                  ></i>
                  <h6 className="mt-3">{selectedFile.name}</h6>
                  <p className="text-muted mb-0">
                    {formatFileSize(selectedFile.size)}
                  </p>
                  <button
                    type="button"
                    className="btn btn-sm btn-link text-danger mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                    }}
                    disabled={isUploading}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div>
                  <i
                    className="fi fi-rr-cloud-upload text-brand-1"
                    style={{ fontSize: "48px" }}
                  ></i>
                  <h6 className="mt-3">
                    {dragActive
                      ? "Drop your CV here"
                      : "Click or drag to upload"}
                  </h6>
                  <p className="text-muted mb-0">PDF files only, max 10MB</p>
                </div>
              )}
            </div>

            <div className="mt-3">
              <p className="text-muted mb-2" style={{ fontSize: "14px" }}>
                <strong>Tips for a great CV:</strong>
              </p>
              <ul className="text-muted" style={{ fontSize: "14px" }}>
                <li>Keep it concise (1-2 pages)</li>
                <li>Include relevant work experience</li>
                <li>Highlight your skills and achievements</li>
                <li>Use a clear, professional format</li>
              </ul>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={isUploading}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-brand-1"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              {isUploading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="fi fi-rr-upload me-2"></i>
                  Upload
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCVModal;
