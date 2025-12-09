"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getJobs } from "@/lib/jobApi";

// ----- Interfaces -----
interface Company {
  companyNo: string;
  name: string;
  address: string;
  logoUrl: string | null;
}

interface Job {
  postId: string;
  title: string;
  shortDescription: string;
  employmentType: string;
  salaryMin: number;
  salaryMax: number;
  skillNames: string[];
  company: Company;
}

interface ApiResponse {
  result: Job[];
  message: string;
  status: number;
  timestamp: string;
  totalPages: number; // giả sử API trả luôn total pages
}

// ----- Component -----
const JobSlider = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await getJobs<ApiResponse>(
          `/public/jobs/featured?page=${page}`
        );
        setJobs(res.data.result || []);
        setTotalPages(res.data.meta.pages || 1);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [page]);

  const handlePrev = () => setPage((p) => Math.max(0, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  if (loading) return <div>Loading jobs...</div>;
  if (!jobs.length) return <div>No featured jobs available</div>;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        style={{
          display: "flex",
          gap: "16px", // khoảng cách giữa các card
          overflowX: "auto",
          padding: "16px 0",
        }}
      >
        {jobs.map((job) => (
          <div
            key={job.postId}
            style={{
              flex: "0 0 auto",
              width: "310px", // card rộng hơn
              height: "350px", // card cao hơn
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between", // đẩy salary + apply xuống dưới
              border: "1px solid #ddd",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              transition: "box-shadow 0.2s",
            }}
          >
            <div>
              {/* Company */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <img
                  src={job.company.logoUrl || "/assets/imgs/brands/default.png"}
                  alt={job.company.name}
                  style={{
                    width: "64px",
                    height: "64px",
                    objectFit: "scale-down",
                    borderRadius: "6px",
                  }}
                />
                <div style={{ marginLeft: "12px" }}>
                  <Link href={`/company-details/${job.company.companyNo}`}>
                    <span style={{ fontWeight: 600, fontSize: "14px" }}>
                      {job.company.name}
                    </span>
                  </Link>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#666",
                      marginTop: "2px",
                    }}
                  >
                    {job.company.address}
                  </div>
                </div>
              </div>

              {/* Job title */}
              <h6
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  margin: "0 0 8px 0",
                }}
              >
                <Link href={`/job-details/${job.postId}`}>{job.title}</Link>
              </h6>
              <div
                style={{
                  fontSize: "13px",
                  color: "#444",
                  marginBottom: "12px",
                }}
              >
                {job.employmentType}
              </div>

              {/* Skills */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "6px",
                  marginBottom: "12px",
                }}
              >
                {job.skillNames.map((skill, idx) => (
                  <Link key={idx} href={`/jobs?skill=${skill}`}>
                    <span
                      style={{
                        backgroundColor: "#f0f0f0",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        cursor: "pointer",
                      }}
                    >
                      {skill}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Salary + Apply luôn ở dưới */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "auto",
              }}
            >
              <div>
                <span style={{ fontWeight: 600 }}>${job.salaryMin}</span>
                <span style={{ fontSize: "15px", color: "#666" }}> ~ </span>
                <span style={{ fontWeight: 600 }}>${job.salaryMax}</span>
              </div>
              <Link href={`/job-details/${job.postId}`}>
                <button
                  style={{
                    backgroundColor: "#2563eb",
                    color: "#fff",
                    padding: "8px 25px",
                    border: "none",
                    borderRadius: "12px",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "all 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget;
                    btn.style.backgroundColor = "#1d4ed8";
                    btn.style.transform = "translateY(-2px)";
                    btn.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget;
                    btn.style.backgroundColor = "#2563eb";
                    btn.style.transform = "translateY(0)";
                    btn.style.boxShadow = "none";
                  }}
                >
                  Apply
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "16px",
          gap: "12px",
        }}
      >
        <button
          onClick={handlePrev}
          disabled={page === 0}
          style={{
            padding: "8px 14px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            cursor: page === 0 ? "not-allowed" : "pointer",
            opacity: page === 0 ? 0.5 : 1,
          }}
        >
          Prev
        </button>
        <span style={{ fontSize: "14px" }}>
          Page {page + 1} / {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={page === totalPages - 1}
          style={{
            padding: "8px 14px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            cursor: page === totalPages - 1 ? "not-allowed" : "pointer",
            opacity: page === totalPages - 1 ? 0.5 : 1,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default JobSlider;
