"use client";

import React, { useState } from "react";
import type { CV } from "@/types/cv";
import { downloadCV } from "@/lib/cvApi";
import { showToast } from "@/lib/toast";

interface CVCardProps {
  cv: CV;
  onDelete: (cvId: string) => void;
  isDeleting: boolean;
}

const CVCard = ({
  cv,
  onDelete,
  isDeleting,
}: CVCardProps): React.ReactElement => {
  const [downloading, setDownloading] = useState(false);

  const formatDate = (dateString: string): string => {
    // Parse custom format: "2025-12-19 14:41:54 PM"
    // Remove the duplicate PM/AM and parse
    const cleanedDate = dateString.replace(/\s+(AM|PM)$/, "");
    const date = new Date(cleanedDate);

    // If still invalid, try manual parsing
    if (isNaN(date.getTime())) {
      const match = dateString.match(
        /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})/
      );
      if (match) {
        const [, year, month, day, hour, minute, second] = match;
        const parsedDate = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hour),
          parseInt(minute),
          parseInt(second)
        );
        return parsedDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return dateString; // Fallback to original string
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownload = async (): Promise<void> => {
    try {
      setDownloading(true);
      const blob = await downloadCV(cv.objectName);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = cv.objectName || `CV_${cv.cvId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      showToast.success('CV downloaded successfully!');
    } catch (error) {
      console.error("Failed to download CV:", error);
      showToast.error("Failed to download CV. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleDelete = (): void => {
    if (confirm("Are you sure you want to delete this CV?")) {
      onDelete(cv.cvId);
    }
  };

  const truncateSummary = (text: string, maxLength = 200): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <div className="card card-style-1 hover-up">
      <div className="card-body">
        <div className="row">
          <div className="col-lg-9">
            <div className="d-flex align-items-start mb-3">
              <div className="icon-cv me-3">
                <i
                  className="fi fi-rr-document text-brand-1"
                  style={{ fontSize: "32px" }}
                ></i>
              </div>
              <div className="flex-grow-1">
                <h5 className="mb-2">{cv.headline || "Uploaded CV"}</h5>
                <div className="d-flex gap-3 text-muted mb-2">
                  <span>
                    <i className="fi fi-rr-calendar me-1"></i>
                    Uploaded {formatDate(cv.createdAt)}
                  </span>
                  {cv.updatedAt && (
                    <span>
                      <i className="fi fi-rr-edit me-1"></i>
                      Updated {formatDate(cv.updatedAt)}
                    </span>
                  )}
                  <span>
                    <i className="fi fi-rr-tag me-1"></i>
                    {cv.templateType}
                  </span>
                </div>

                {cv.summary && (
                  <p className="text-muted mb-2" style={{ fontSize: "14px" }}>
                    {truncateSummary(cv.summary)}
                  </p>
                )}

                {/* Display sections info */}
                <div className="d-flex gap-2 flex-wrap">
                  {cv.sections.experience.length > 0 && (
                    <span className="badge bg-light text-dark">
                      {cv.sections.experience.length} Experience(s)
                    </span>
                  )}
                  {cv.sections.education.length > 0 && (
                    <span className="badge bg-light text-dark">
                      {cv.sections.education.length} Education(s)
                    </span>
                  )}
                  {cv.sections.skills.length > 0 && (
                    <span className="badge bg-light text-dark">
                      {cv.sections.skills.length} Skill(s)
                    </span>
                  )}
                  {cv.sections.projects.length > 0 && (
                    <span className="badge bg-light text-dark">
                      {cv.sections.projects.length} Project(s)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-3 text-lg-end">
            <div className="d-flex flex-lg-column gap-3">
              {/* Download Button */}
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="btn btn-sm btn-brand-1"
              >
                <i className="fi fi-rr-download me-1"></i>
                {downloading ? "Downloading..." : "Download"}
              </button>

              {/* Delete Button */}
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="btn btn-sm btn-outline-danger"
              >
                <i className="fi fi-rr-trash me-1"></i>
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVCard;
