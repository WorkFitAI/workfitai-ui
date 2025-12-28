"use client";

import { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/redux/hooks";
import { selectAuthUser } from "@/redux/features/auth/authSlice";
import {
  fetchCompanyDetails,
  fetchCompanyJobs,
  updateCompany,
} from "@/lib/jobApi";
import { Company } from "@/types/job/company";
import Preloader from "@/app/loading";
import Link from "next/link";
import { Job } from "@/types/job/job";

export default function HRCompanyPage() {
  const user = useAppSelector(selectAuthUser);
  const companyNo = user?.companyId;

  const [activeIndex, setActiveIndex] = useState(1);
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Company>>({});
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!companyNo) {
      setLoading(false);
      return;
    }

    const fetchCompany = async () => {
      setLoading(true);
      try {
        const res = await fetchCompanyDetails(companyNo);
        setCompany(res.data ?? null);
        setFormData(res.data ?? {});
      } catch (error) {
        console.error("Error fetching company:", error);
        setCompany(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [companyNo]);

  useEffect(() => {
    if (!companyNo) return;

    const fetchJobs = async () => {
      setJobsLoading(true);
      try {
        const res = await fetchCompanyJobs(companyNo, 0, 20);
        setJobs(res.data?.result ?? []);
      } catch (error) {
        console.error("Error fetching company jobs:", error);
        setJobs([]);
      } finally {
        setJobsLoading(false);
      }
    };

    fetchJobs();
  }, [companyNo]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setLogoPreview(objectUrl);
    }
  };

  const handleSave = async () => {
    if (!companyNo) return;

    setSaveLoading(true);
    try {
      const data = new FormData();
      data.append("companyNo", companyNo);

      if (formData.name) data.append("name", formData.name);
      if (formData.description)
        data.append("description", formData.description);
      if (formData.websiteUrl) data.append("websiteUrl", formData.websiteUrl);
      if (formData.address) data.append("address", formData.address);
      if (formData.size) data.append("size", formData.size);

      if (logoFile) {
        data.append("logoFile", logoFile);
      }

      const res = await updateCompany(data);

      if (res.data) {
        setCompany(res.data);
        setFormData(res.data);
        setIsEditing(false);
        setLogoFile(null);
        setLogoPreview(null);
      }
    } catch (error) {
      console.error("Error updating company:", error);
      alert("Failed to update company details");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(company || {});
    setLogoFile(null);
    setLogoPreview(null);
  };

  if (loading) return <Preloader />;

  if (!company) {
    return (
      <section className="section-box mt-50 mb-50">
        <div className="container text-center">
          <h3>Company information not found</h3>
          <p className="text-muted">
            You are not associated with any company or the company data is
            missing.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div>
      <section className="section-box-2">
        <div className="container">
          <div
            className="banner-hero banner-image-single"
            style={{
              backgroundColor: "#3C65F5",
              minHeight: "180px",
              borderRadius: "12px",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background:
                  "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)",
              }}
            ></div>
          </div>
          <div
            className="box-company-profile"
            style={{
              paddingTop: "30px",
              paddingBottom: "10px",
              marginBottom: "-10px",
            }}
          >
            <div className="row">
              <div className="col-lg-2 col-md-3">
                <div className="image-compay position-relative">
                  <div
                    className="company-logo-wrapper"
                    style={{
                      width: "180px",
                      height: "180px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: "3px solid #f5f5f5",
                      backgroundColor: "#fff",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                  >
                    <img
                      src={
                        logoPreview ||
                        company.logoUrl ||
                        "/assets/imgs/page/company/company.png"
                      }
                      alt={company.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                  {isEditing && (
                    <button
                      className="btn btn-sm btn-primary mt-3"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        fontSize: "12px",
                        padding: "6px 12px",
                        borderRadius: "6px",
                      }}
                    >
                      <i className="fi-rr-camera mr-5"></i>
                      Change Logo
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="d-none"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              <div className="col-lg-6 col-md-5">
                {isEditing ? (
                  <div className="form-group mb-3">
                    <label className="form-label font-sm font-bold color-text-paragraph-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleInputChange}
                      style={{
                        borderRadius: "8px",
                        padding: "10px 15px",
                        border: "2px solid #e0e6f7",
                      }}
                    />
                  </div>
                ) : (
                  <h5 className="f-18 mb-2" style={{ fontWeight: 600 }}>
                    {company.name}
                  </h5>
                )}

                {isEditing ? (
                  <div className="form-group mb-3">
                    <label className="form-label font-sm font-bold color-text-paragraph-2">
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleInputChange}
                      placeholder="e.g. San Francisco, CA"
                      style={{
                        borderRadius: "8px",
                        padding: "10px 15px",
                        border: "2px solid #e0e6f7",
                      }}
                    />
                  </div>
                ) : (
                  company.address && (
                    <div className="mb-3">
                      <i className="fi-rr-marker mr-5 color-text-mutted"></i>
                      <span className="font-regular">{company.address}</span>
                    </div>
                  )
                )}

                {isEditing ? (
                  <div className="form-group mb-3">
                    <label className="form-label font-sm font-bold color-text-paragraph-2">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows={3}
                      value={formData.description || ""}
                      onChange={handleInputChange}
                      style={{
                        borderRadius: "8px",
                        padding: "10px 15px",
                        border: "2px solid #e0e6f7",
                      }}
                    />
                  </div>
                ) : (
                  <p
                    className="font-md color-text-paragraph-2 mb-0"
                    style={{
                      wordWrap: "break-word",
                      overflowWrap: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {company.description || "No description available"}
                  </p>
                )}
              </div>

              <div className="col-lg-4 col-md-4 text-lg-end">
                {isEditing ? (
                  <div className="d-flex flex-column align-items-end gap-3">
                    <div className="form-group w-100 text-start">
                      <label className="form-label font-sm font-bold color-text-paragraph-2">
                        Website URL
                      </label>
                      <input
                        type="url"
                        className="form-control"
                        name="websiteUrl"
                        value={formData.websiteUrl || ""}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                        style={{
                          borderRadius: "8px",
                          padding: "10px 15px",
                          border: "2px solid #e0e6f7",
                        }}
                      />
                    </div>
                    <div className="form-group w-100 text-start">
                      <label className="form-label font-sm font-bold color-text-paragraph-2">
                        Company Size
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="size"
                        value={formData.size || ""}
                        onChange={handleInputChange}
                        placeholder="e.g. 50-100 employees"
                        style={{
                          borderRadius: "8px",
                          padding: "10px 15px",
                          border: "2px solid #e0e6f7",
                        }}
                      />
                    </div>

                    <div className="d-flex gap-2 mt-2 w-100 justify-content-end">
                      <button
                        className="btn btn-grey-small hover-up"
                        onClick={handleCancel}
                        disabled={saveLoading}
                        style={{
                          padding: "10px 24px",
                          borderRadius: "8px",
                          fontWeight: 500,
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-default hover-up"
                        onClick={handleSave}
                        disabled={saveLoading}
                        style={{
                          padding: "10px 24px",
                          borderRadius: "8px",
                          fontWeight: 500,
                          boxShadow: "0 4px 12px rgba(60, 101, 245, 0.2)",
                        }}
                      >
                        {saveLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm mr-2"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="fi-rr-check mr-5"></i>
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex flex-column gap-2 align-items-end">
                    <button
                      className="btn btn-border hover-up"
                      onClick={() => setIsEditing(true)}
                      style={{
                        padding: "10px 24px",
                        borderRadius: "8px",
                        fontWeight: 500,
                        border: "2px solid #3C65F5",
                        color: "#3C65F5",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#3C65F5";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#3C65F5";
                      }}
                    >
                      <i className="fi-rr-edit mr-5"></i>
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="border-bottom" />
        </div>
      </section>

      {!isEditing && (
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
                      <p
                        style={{
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "normal",
                        }}
                      >
                        {company.description ||
                          "No detailed information available about this company."}
                      </p>
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
                              <div
                                className="card-grid-2 hover-up"
                                style={{
                                  borderRadius: "12px",
                                  border: "1px solid #e0e6f7",
                                  transition: "all 0.3s ease",
                                  cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = "#3C65F5";
                                  e.currentTarget.style.boxShadow =
                                    "0 8px 24px rgba(60, 101, 245, 0.12)";
                                  e.currentTarget.style.transform =
                                    "translateY(-2px)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = "#e0e6f7";
                                  e.currentTarget.style.boxShadow = "none";
                                  e.currentTarget.style.transform =
                                    "translateY(0)";
                                }}
                              >
                                <span className="flash" />
                                <div className="row">
                                  <div className="col-lg-6 col-md-6 col-sm-12">
                                    <div className="card-grid-2-image-left">
                                      <div
                                        className="image-box"
                                        style={{
                                          width: "50px",
                                          height: "50px",
                                          borderRadius: "8px",
                                          overflow: "hidden",
                                          border: "1px solid #e0e6f7",
                                        }}
                                      >
                                        <img
                                          src={
                                            company.logoUrl ||
                                            "/assets/imgs/page/job-single/thumb.png"
                                          }
                                          alt={company.name}
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            objectPosition: "center",
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
                                        <Link
                                          href={`/job-details/${job.postId}`}
                                        >
                                          <div className="btn btn-apply-now">
                                            View Details
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
                          <span className="card-location">
                            {company.address}
                          </span>
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
                            <i className="fi-rr-user" />
                          </div>
                          <div className="sidebar-text-info">
                            <span className="text-description">
                              Company Size
                            </span>
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
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
