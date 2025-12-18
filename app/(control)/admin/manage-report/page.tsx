"use client";

import { useEffect, useState } from "react";
import ReportedJobTable from "@/components/report/ReportedJobTable";
import { getReportedJobs } from "@/lib/reportApi";
import { ReportedJob, ReportStatus } from "@/types/job/report";
import { toast } from "react-toastify";
import ReportStatusFilter from "@/components/report/ReportStatusFilter";
import Preloader from "@/components/elements/control/Preloader";

export default function ManageJobReportClient() {
  const [jobs, setJobs] = useState<ReportedJob[]>([]);
  const [page, setPage] = useState(1); // FE dùng 1-based
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ReportStatus | undefined>(undefined);

  const fetchReportedJobs = async () => {
    try {
      setLoading(true);
      const res = await getReportedJobs({ page, pageSize: 2, status });
      console.log("Fetched reported jobs:", res);
      setJobs(res.data?.result ?? []);
      setTotalPages(res.data?.meta.pages ?? 1);
    } catch (err) {
      console.error("Error fetching reported jobs:", err);
      toast.error("Failed to load reported jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedJobs();
  }, [page, status]);

  const handleStatusChange = (newStatus: ReportStatus | undefined) => {
    setStatus(newStatus);
    setPage(1); // reset page khi filter thay đổi
  };

  const handleReload = () => fetchReportedJobs();

  return (
    <div className="container mt-4">
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <ReportStatusFilter value={status} onChange={handleStatusChange} />
        <div>
          Page {page} / {totalPages}
        </div>
      </div>

      <ReportedJobTable
        jobs={jobs}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        onReload={handleReload}
      />

      {loading && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-light bg-opacity-50">
          <div className="spinner-border text-primary" role="status">
            <Preloader />
          </div>
        </div>
      )}
    </div>
  );
}
