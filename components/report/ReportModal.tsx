"use client";

import { useState, useRef } from "react";
import { toast } from "react-toastify";
import { createReport } from "@/lib/reportApi";
import { ReqCreateReport } from "@/types/job/report";
import { BsPlusLg, BsX } from "react-icons/bs";

interface ReportModalProps {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function ReportModal({
  jobId,
  isOpen,
  onClose,
  onSuccess,
}: ReportModalProps) {
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    setFiles((prev) => [...prev, ...selectedFiles]);

    // reset input để có thể chọn lại cùng file
    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Report content is required");
      return;
    }

    setLoading(true);
    try {
      const data: ReqCreateReport = {
        jobId,
        reportContent: content,
      };

      await createReport(data, files);

      toast.success("Report submitted");
      setContent("");
      setFiles([]);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      toast.error(err?.message || "Submit failed");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(4px)",
          zIndex: 1040,
        }}
      />

      {/* MODAL */}
      <div className="modal fade show d-block" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content rounded-4 shadow-lg">
            {/* HEADER */}
            <div className="modal-header">
              <h5 className="modal-title fw-bold">Report Job</h5>
            </div>

            {/* BODY */}
            <div className="modal-body">
              {/* TEXT */}
              <textarea
                className="form-control mb-3"
                rows={4}
                placeholder="What is the problem?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              {/* IMAGE HEADER */}
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold">Images</span>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <BsPlusLg size={12} /> Add image
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handleAddImages}
              />

              {/* PREVIEW GRID */}
              {files.length > 0 && (
                <div className="row g-2">
                  {files.map((file, index) => (
                    <div key={index} className="col-4">
                      <div className="position-relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="img-fluid rounded-3"
                          style={{
                            height: 120,
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <button
                          className="btn btn-sm btn-dark position-absolute top-0 end-0 m-1"
                          onClick={() => removeImage(index)}
                        >
                          <BsX size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FOOTER */}
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
