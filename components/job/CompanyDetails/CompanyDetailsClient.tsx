"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Layout from "@/components/Layout/Layout";
import React, { useState, useEffect } from "react";
import { fetchCompanyDetails, fetchCompanyJobs } from "@/lib/jobApi";
import { Company } from "@/types/job/company";
import Preloader from "@/app/loading";
import type { Job, Meta } from "@/types/job/job";

interface Props {
  companyNo: string;
}

export default function CompanyDetailsClient({ companyNo }: Props) {
  const [activeIndex, setActiveIndex] = useState(1);
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(false);

  const handleOnClick = (index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    if (!companyNo) return;

    const fetchCompany = async () => {
      setLoading(true);
      try {
        const res = await fetchCompanyDetails(companyNo);
        console.log("Fetched company details:", res.data);
        setCompany(res.data ?? null);
      } catch (error) {
        console.error("Error fetching company:", error);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyNo]);

  // Fetch jobs for this company
  useEffect(() => {
    if (!company?.companyNo) return;

    const fetchJobs = async () => {
      setJobsLoading(true);
      try {
        const res = await fetchCompanyJobs(company.companyNo, 0, 20);
        console.log("Fetched company jobs:", res.data);
        setJobs(res.data?.result ?? []);
        setMeta(res.data?.meta ?? null);
      } catch (error) {
        console.error("Error fetching company jobs:", error);
        setJobs([]);
        setMeta(null);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, [company?.companyNo]);

  if (loading) return <Preloader />;
  if (!company) {
    return (
      <Layout>
        <div className="container mt-50 mb-50 text-center">
          <h3>Company not found</h3>
          <Link href="/">
            <span className="btn btn-default mt-20">Go Home</span>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <div>
      <section className="section-box-2">
        <div className="container">
          <div
            className="banner-hero banner-image-single"
            style={{ backgroundColor: "#3C65F5", minHeight: "200px", borderRadius: "8px" }}
          ></div>
          <div className="box-company-profile">
            <div className="row">
              <div className="col-lg-2 col-md-3">
                <div className="image-compay">
                  <img
                    src={
                      company.logoUrl || "/assets/imgs/page/company/company.png"
                    }
                    alt={company.name}
                    style={{
                      width: "190px",
                      height: "190px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-5 pl-20">
                <h5 className="f-8">{company.name}</h5>
                {company.address && (
                  <span className="card-location font-regular">
                    {company.address}
                  </span>
                )}
                <p className="mt-10 font-md color-text-paragraph-2">
                  {company.description || "No description available"}
                </p>
              </div>
              <div className="col-lg-4 col-md-4 text-lg-end">
                {company.websiteUrl && (
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="btn btn-call-icon btn-apply btn-apply-big mb-20">
                      Visit Website
                    </span>
                  </a>
                )}
                <div className="box-nav-tabs mt-10">
                  <ul className="nav justify-content-end" role="tablist">
                    <li>
                      <a
                        className={`btn btn-border aboutus-icon mr-15 mb-5 ${
                          activeIndex === 1 ? "active" : ""
                        }`}
                        onClick={() => handleOnClick(1)}
                      >
                         About us
                      </a> 
                    </li>
                    <li>
                      <a
                        className={`btn btn-border recruitment-icon mb-5 ${
                          activeIndex === 2 ? "active" : ""
                        }`}
                        onClick={() => handleOnClick(2)}
                      >
                        Recruitments
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="border-bottom pt-10 pb-10" />
        </div>
      </section>
      <section className="section-box mt-50">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-12 col-sm-12 col-12">
              <div className="content-single">
                <div className="tab-content">
                  <div
                    className={`tab-pane fade ${
                      activeIndex === 1 && "show active"
                    }`}
                  >
                    <h4>Welcome to {company.name}</h4>
                    <p>
                      {company.description ||
                        "No detailed information available about this company."}
                    </p>
                    {company.size && (
                      <>
                        <h4>Company Size</h4>
                        <p>{company.size} employees</p>
                      </>
                    )}
                  </div>
                  <div
                    className={`tab-pane fade ${
                      activeIndex === 2 && "show active"
                    }`}
                  >
                    <h4>Latest Job Openings</h4>
                    {jobsLoading ? (
                      <Preloader />
                    ) : jobs && jobs.length > 0 ? (
                      <div className="box-list-jobs display-list">
                        {jobs.map((job: Job) => (
                          <div className="col-xl-12 col-12" key={job.postId}>
                            <div className="card-grid-2 hover-up">
                              <span className="flash" />
                              <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-12">
                                  <div className="card-grid-2-image-left">
                                    <div className="image-box">
                                      <img
                                        src={
                                          company.logoUrl ||
                                          "/assets/imgs/page/job-single/thumb.png"
                                        }
                                        alt={company.name}
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          objectFit: "contain",
                                        }}
                                      />
                                    </div>
                                    <div className="right-info">
                                      <span className="name-job">
                                        {company.name}
                                      </span>
                                      <span className="location-small">
                                        {company.address || ""}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-lg-6 text-start text-md-end pr-60 col-md-6 col-sm-12">
                                  <div className="pl-15 mb-15 mt-30">
                                    {job?.skillNames?.map((skill, index) => (
                                      <span
                                        className="btn btn-grey-small mr-5"
                                        key={index}
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="card-block-info">
                                <h4 className="mt-0 pt-5 mb-5">
                                  <Link href={`/job-details/${job.postId}`}>
                                    <span>{job.title}</span>
                                  </Link>
                                </h4>
                                <div className="mt-5">
                                  <span className="card-briefcase">
                                    {job.employmentType}
                                  </span>
                                  <span className="card-time">
                                    Exp:{" "}
                                    {new Date(
                                      job.expiresAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="font-sm color-text-paragraph mt-10">
                                  {job.shortDescription}
                                </p>
                                <div className="card-2-bottom mt-20">
                                  <div className="row">
                                    <div className="col-lg-7 col-7">
                                      <span className="card-text-price">
                                        {job.salaryMin} - {job.salaryMax}
                                      </span>
                                      <span className="text-muted">
                                        {job.currency || ""}
                                      </span>
                                    </div>
                                    <div className="col-lg-5 col-5 text-end">
                                      <Link href={`/job-details/${job.postId}`}>
                                        <div className="btn btn-apply-now">
                                          Apply now
                                        </div>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p>No job openings at the moment.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12 col-12 pl-40 pl-lg-15 mt-lg-30">
              <div className="sidebar-border">
                <div className="sidebar-heading">
                  <div className="avatar-sidebar">
                    <div className="sidebar-info pl-0">
                      <span className="sidebar-company">{company.name}</span>
                      {company.address && (
                        <span className="card-location">{company.address}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="sidebar-list-job">
                  <ul>
                    <li>
                      <div className="sidebar-icon-item">
                        <i className="fi-rr-briefcase" />
                      </div>
                      <div className="sidebar-text-info">
                        <span className="text-description">Company</span>
                        <strong className="small-heading">
                          {company.name}
                        </strong>
                      </div>
                    </li>
                    {company.address && (
                      <li>
                        <div className="sidebar-icon-item">
                          <i className="fi-rr-marker" />
                        </div>
                        <div className="sidebar-text-info">
                          <span className="text-description">Location</span>
                          <strong className="small-heading">
                            {company.address}
                          </strong>
                        </div>
                      </li>
                    )}
                    {company.size && (
                      <li>
                        <div className="sidebar-icon-item">
                          <i className="fi-rr-users" />
                        </div>
                        <div className="sidebar-text-info">
                          <span className="text-description">Company Size</span>
                          <strong className="small-heading">
                            {company.size}
                          </strong>
                        </div>
                      </li>
                    )}
                    {company.websiteUrl && (
                      <li>
                        <div className="sidebar-icon-item">
                          <i className="fi-rr-globe" />
                        </div>
                        <div className="sidebar-text-info">
                          <span className="text-description">Website</span>
                          <strong className="small-heading">
                            <a
                              href={company.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Visit Website
                            </a>
                          </strong>
                        </div>
                      </li>
                    )}
                  </ul>
                </div>
                {company.websiteUrl && (
                  <div className="sidebar-list-job">
                    <div className="mt-30">
                      <a
                        href={company.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="btn btn-send-message">
                          Visit Website
                        </span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
