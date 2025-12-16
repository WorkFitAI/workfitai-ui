"use client";

import { useState } from "react";
import { ReportedJob } from "@/types/job/report";
import ReportedJobRow from "./ReportedJobRow";
import ChangeReportStatusModal from "./ChangeReportStatusModal";
import ReportDetailModal from "./ReportDetailModal";
import DeleteJobConfirmModal from "@/components/common/DeleteJobConfirmModal";
import Pagination from "./Pagination";
import { toast } from "react-toastify";
import { deleteJob } from "@/lib/jobApi";

interface Props {
  jobs: ReportedJob[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onReload: () => void;
}

export default function ReportedJobTable({
  jobs,
  page,
  totalPages,
  onPageChange,
  onReload,
}: Props) {
  const [viewJob, setViewJob] = useState<ReportedJob | null>(null);
  const [statusJob, setStatusJob] = useState<ReportedJob | null>(null);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteJobId) return;

    try {
      await deleteJob(`/admin/jobs/${deleteJobId}`);
      toast.success("Job deleted successfully");
      setDeleteJobId(null);
      onReload();
    } catch (err) {
      console.error(err);
      toast.error("Delete job failed");
    }
  };

  return (
    <>
      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="mb-3">Reported Jobs</h5>

          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Job</th>
                <th>Company</th>
                <th>Status</th>
                <th>Reports</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job) => (
                <ReportedJobRow
                  key={job.jobId}
                  job={job}
                  onView={setViewJob}
                  onChangeStatus={setStatusJob}
                  onDelete={setDeleteJobId}
                />
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      </div>

      {/* VIEW REPORT */}
      {viewJob && (
        <ReportDetailModal job={viewJob} onClose={() => setViewJob(null)} />
      )}

      {/* CHANGE STATUS */}
      {statusJob && (
        <ChangeReportStatusModal
          jobId={statusJob.jobId}
          currentStatus={statusJob.status}
          onClose={() => setStatusJob(null)}
          onSuccess={onReload}
        />
      )}

      {/* DELETE CONFIRM */}
      <DeleteJobConfirmModal
        open={!!deleteJobId}
        jobId={deleteJobId}
        onClose={() => setDeleteJobId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
