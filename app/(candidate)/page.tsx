"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAllJobs } from "@/redux/features/job/jobListSlice";
import { selectUserRole } from "@/redux/features/auth/authSlice";
import type { Job } from "@/types/job/job";
import { useRouter } from "next/navigation";
import { addFilterValue } from "@/redux/features/job/jobFilterSlice";
import { fetchRecommendations } from "@/lib/jobApi";

export default function Home() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const role = useAppSelector(selectUserRole);
  const { jobs: allJobs, loading: allJobsLoading } = useAppSelector(
    (state) => state.jobList
  );
  const [searchKeyword, setSearchKeyword] = useState("");
  const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [useFallbackJobs, setUseFallbackJobs] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (role === "CANDIDATE") {
      const loadRecommendations = async () => {
        setLoadingRecommendations(true);
        setUseFallbackJobs(false);
        try {
          const response = await fetchRecommendations(10);
          if (
            response.data?.recommendations &&
            response.data.totalResults > 0
          ) {
            // Map recommendations to Job array
            const jobs = response.data.recommendations.map((rec) => rec.job);
            setRecommendedJobs(jobs);
            setUseFallbackJobs(false);
          } else {
            // No recommendations returned, fallback to fetching all jobs
            console.log("No recommendations available, fetching all jobs");
            setUseFallbackJobs(true);
            dispatch(
              fetchAllJobs({
                page: 1,
                size: 8,
                sort: "Newest Post",
                role: "USER",
              })
            );
          }
        } catch (error) {
          console.error("Failed to load recommendations:", error);
          // Fallback to fetching all jobs if recommendations fail
          setUseFallbackJobs(true);
          dispatch(
            fetchAllJobs({
              page: 1,
              size: 8,
              sort: "Newest Post",
              role: "USER",
            })
          );
        } finally {
          setLoadingRecommendations(false);
        }
      };

      loadRecommendations();
    } else {
      // For non-candidates (Guest, HR, Admin), fetch standard job list
      dispatch(
        fetchAllJobs({
          page: 1,
          size: 8,
          sort: "Newest Post",
          role: role as "USER" | "HR" | "ADMIN" | "HR_MANAGER",
        })
      );
    }
  }, [dispatch, role]);

  // Determine which jobs to display based on role
  const displayJobs =
    mounted && role === "CANDIDATE"
      ? useFallbackJobs
        ? allJobs
        : recommendedJobs
      : allJobs;
  const isLoading =
    mounted && role === "CANDIDATE"
      ? useFallbackJobs
        ? allJobsLoading
        : loadingRecommendations
      : allJobsLoading;
  const sectionTitle =
    mounted && role === "CANDIDATE"
      ? useFallbackJobs
        ? "Newest Jobs"
        : "Recommended for You"
      : "Jobs of the day";
  const sectionSubtitle =
    mounted && role === "CANDIDATE"
      ? useFallbackJobs
        ? "Latest job opportunities updated daily"
        : "Jobs tailored to your skills and experience"
      : "Search and connect with the right candidates faster.";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (searchKeyword.trim()) {
      // Add the title filter to Redux state
      dispatch(addFilterValue({ field: "title", value: searchKeyword.trim() }));
      // Redirect to jobs-list page
      router.push("/jobs-list");
    } else {
      // If no keyword, just go to jobs-list
      router.push("/jobs-list");
    }
  };

  return (
    <>
      <div className="bg-homepage1" />
      <section className="section-box">
        <div className="banner-hero hero-1">
          <div className="banner-inner">
            <div className="row">
              <div className="col-xl-8 col-lg-12">
                <div className="block-banner">
                  <h1 className="heading-banner wow animate__animated animate__fadeInUp">
                    The <span className="color-brand-2">Easiest Way</span>
                    <br className="d-none d-lg-block" />
                    to Get Your New Job
                  </h1>
                  <div
                    className="banner-description mt-20 wow animate__animated animate__fadeInUp"
                    data-wow-delay=".1s"
                  >
                    Each month, more than 3 million job seekers turn to{" "}
                    <br className="d-none d-lg-block" />
                    website in their search for work, making over 140,000{" "}
                    <br className="d-none d-lg-block" />
                    applications every single day
                  </div>
                  <div
                    className="form-find mt-40 wow animate__animated animate__fadeIn"
                    data-wow-delay=".2s"
                  >
                    <form onSubmit={handleSearch}>
                      <input
                        className="form-input input-keysearch mr-10"
                        type="text"
                        placeholder="Your keyword... "
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="btn btn-default btn-find font-sm"
                      >
                        Search
                      </button>
                    </form>
                  </div>
                  <div
                    className="list-tags-banner mt-60 wow animate__animated animate__fadeInUp"
                    data-wow-delay=".3s"
                  >
                    <strong>Popular Searches:</strong>
                    <Link href="#">Designer,</Link>
                    <Link href="#">Web,</Link>
                    <Link href="#">IOS,</Link>
                    <Link href="#">Developer,</Link>
                    <Link href="#">PHP,</Link>
                    <Link href="#">Senior,</Link>
                    <Link href="#">Engineer,</Link>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-12 d-none d-xl-block col-md-6">
                <div className="banner-imgs">
                  <div className="block-1 shape-1">
                    <img
                      className="img-responsive"
                      alt="workfitAI"
                      src="/assets/imgs/page/homepage1/banner1.png"
                    />
                  </div>
                  <div className="block-2 shape-2">
                    <img
                      className="img-responsive"
                      alt="workfitAI"
                      src="/assets/imgs/page/homepage1/banner2.png"
                    />
                  </div>
                  <div className="block-3 shape-3">
                    <img
                      className="img-responsive"
                      alt="workfitAI"
                      src="/assets/imgs/page/homepage1/icon-top-banner.png"
                    />
                  </div>
                  <div className="block-4 shape-3">
                    <img
                      className="img-responsive"
                      alt="workfitAI"
                      src="/assets/imgs/page/homepage1/icon-bottom-banner.png"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="mt-100" />
      <section className="section-box mt-50">
        <div className="container">
          <div className="text-center">
            <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">
              {sectionTitle}
            </h2>
            <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">
              {sectionSubtitle}{" "}
            </p>
          </div>
          <div className="mt-70">
            {mounted && role === "CANDIDATE" && !useFallbackJobs ? (
              /* Recommended Jobs - Enhanced Design */
              <div className="row">
                {isLoading ? (
                  <div className="col-12 text-center">
                    <p>Loading recommendations...</p>
                  </div>
                ) : displayJobs.length > 0 ? (
                  displayJobs.slice(0, 8).map((job: Job) => (
                    <div
                      className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12"
                      key={job.postId}
                    >
                      <div
                        className="card-grid-2 hover-up"
                        style={{
                          backgroundColor: "#F8F9FA",
                          border: "2px solid #3498DB",
                          borderRadius: "12px",
                          position: "relative",
                          padding: "25px",
                        }}
                      >
                        {/* Recommended Badge */}
                        <div
                          style={{
                            position: "absolute",
                            top: "15px",
                            right: "15px",
                            backgroundColor: "#3498DB",
                            color: "white",
                            padding: "5px 15px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                          Recommended
                        </div>

                        <div className="row">
                          {/* Company Logo Section */}
                          <div className="col-md-3 col-sm-12 text-center mb-3 mb-md-0">
                            <div
                              style={{
                                backgroundColor: "white",
                                borderRadius: "10px",
                                padding: "15px",
                                border: "1px solid #E9ECEF",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Image
                                src={
                                  job.company?.logoUrl ||
                                  "/assets/imgs/brands/brand-1.png"
                                }
                                alt={job.company?.name || "Company"}
                                width={80}
                                height={80}
                                unoptimized
                                style={{
                                  maxWidth: "80px",
                                  maxHeight: "80px",
                                  objectFit: "contain",
                                  marginBottom: "10px",
                                }}
                              />
                              <Link href={`/company/${job.company?.companyNo}`}>
                                <span
                                  style={{
                                    fontSize: "13px",
                                    color: "#2D3E50",
                                    fontWeight: "600",
                                    textAlign: "center",
                                    display: "block",
                                  }}
                                >
                                  {job.company?.name || "Unknown Company"}
                                </span>
                              </Link>
                            </div>
                          </div>

                          {/* Job Details Section */}
                          <div className="col-md-9 col-sm-12">
                            <div
                              className="card-block-info"
                              style={{ padding: "0" }}
                            >
                              <h5 style={{ marginBottom: "10px" }}>
                                <Link href={`/job-details/${job.postId}`}>
                                  <span
                                    style={{
                                      color: "#2D3E50",
                                      fontWeight: "700",
                                    }}
                                  >
                                    {job.title}
                                  </span>
                                </Link>
                              </h5>

                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "10px",
                                  marginBottom: "15px",
                                  alignItems: "center",
                                }}
                              >
                                <span
                                  style={{
                                    fontSize: "13px",
                                    color: "#6C757D",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                  }}
                                >
                                  <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                  </svg>
                                  {job.location || "N/A"}
                                </span>
                                <span
                                  style={{
                                    backgroundColor: "#3498DB",
                                    color: "white",
                                    padding: "3px 10px",
                                    borderRadius: "5px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                  }}
                                >
                                  {job.employmentType}
                                </span>
                                <span
                                  style={{
                                    fontSize: "12px",
                                    color: "#E74C3C",
                                    fontWeight: "600",
                                  }}
                                >
                                  Exp:{" "}
                                  {new Date(job.expiresAt).toLocaleDateString()}
                                </span>
                              </div>

                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "#495057",
                                  marginBottom: "15px",
                                  lineHeight: "1.6",
                                }}
                              >
                                {job.shortDescription}
                              </p>

                              {/* Skills */}
                              <div style={{ marginBottom: "15px" }}>
                                {job.skillNames
                                  ?.slice(0, 4)
                                  .map((skill, index) => (
                                    <span
                                      key={index}
                                      style={{
                                        display: "inline-block",
                                        backgroundColor: "white",
                                        border: "1px solid #CED4DA",
                                        color: "#495057",
                                        padding: "5px 12px",
                                        borderRadius: "20px",
                                        fontSize: "12px",
                                        marginRight: "8px",
                                        marginBottom: "8px",
                                        fontWeight: "500",
                                      }}
                                    >
                                      {skill}
                                    </span>
                                  ))}
                              </div>

                              {/* Salary and Action */}
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  paddingTop: "15px",
                                  borderTop: "1px solid #DEE2E6",
                                }}
                              >
                                <div>
                                  <span
                                    style={{
                                      fontSize: "18px",
                                      fontWeight: "700",
                                      color: "#27AE60",
                                    }}
                                  >
                                    {job.salaryMin} - {job.salaryMax}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "14px",
                                      color: "#6C757D",
                                      marginLeft: "5px",
                                    }}
                                  >
                                    {job.currency || ""}
                                  </span>
                                </div>
                                <Link href={`/job-details/${job.postId}`}>
                                  <span
                                    style={{
                                      backgroundColor: "#3498DB",
                                      color: "white",
                                      padding: "10px 25px",
                                      borderRadius: "8px",
                                      fontSize: "14px",
                                      fontWeight: "600",
                                      cursor: "pointer",
                                      transition: "all 0.3s ease",
                                      display: "inline-block",
                                    }}
                                    onMouseOver={(e) => {
                                      e.currentTarget.style.backgroundColor =
                                        "#2D3E50";
                                    }}
                                    onMouseOut={(e) => {
                                      e.currentTarget.style.backgroundColor =
                                        "#3498DB";
                                    }}
                                  >
                                    Apply Now
                                  </span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center">
                    <p>No recommendations available</p>
                  </div>
                )}
              </div>
            ) : (
              /* Standard Jobs Grid - Original Design */
              <div className="row">
                {isLoading ? (
                  <div className="col-12 text-center">
                    <p>Loading jobs...</p>
                  </div>
                ) : displayJobs.length > 0 ? (
                  displayJobs.slice(0, 8).map((job: Job) => (
                    <div
                      className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                      key={job.postId}
                    >
                      <div className="card-grid-2 hover-up">
                        <div className="card-grid-2-image-left">
                          <span className="flash" />
                          <div className="image-box">
                            <Image
                              src={
                                job.company?.logoUrl ||
                                "/assets/imgs/brands/brand-1.png"
                              }
                              alt={job.company?.name || "Company"}
                              width={60}
                              height={60}
                              unoptimized
                              style={{
                                maxWidth: "60px",
                                maxHeight: "60px",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                          <div className="right-info">
                            <Link href={`/company/${job.company?.companyNo}`}>
                              <span className="name-job">
                                {job.company?.name || "Unknown Company"}
                              </span>
                            </Link>
                            <span className="location-small">
                              {job.location || "N/A"}
                            </span>
                          </div>
                        </div>
                        <div className="card-block-info">
                          <h6>
                            <Link href={`/job-details/${job.postId}`}>
                              <span>{job.title}</span>
                            </Link>
                          </h6>
                          <div className="mt-5">
                            <span className="card-briefcase">
                              {job.employmentType}
                            </span>
                            <span className="card-time">
                              Exp:{" "}
                              {new Date(job.expiresAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="font-sm color-text-paragraph mt-15">
                            {job.shortDescription}
                          </p>
                          <div className="mt-30">
                            {job.skillNames?.slice(0, 3).map((skill, index) => (
                              <Link href="/jobs-list" key={index}>
                                <span className="btn btn-grey-small mr-5">
                                  {skill}
                                </span>
                              </Link>
                            ))}
                          </div>
                          <div className="card-2-bottom mt-30">
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
                  ))
                ) : (
                  <div className="col-12 text-center">
                    <p>No jobs available</p>
                  </div>
                )}
              </div>
            )}
            <div className="text-center mt-40">
              <Link href="/jobs-list">
                <span className="btn btn-brand-1 btn-icon-load mt--30 hover-up">
                  Load More Jobs
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section-box overflow-visible mt-100 mb-100">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-sm-12">
              <div className="box-image-job">
                <img
                  className="img-job-1"
                  alt="workfitAI"
                  src="/assets/imgs/page/homepage1/img-chart.png"
                />
                <img
                  className="img-job-2"
                  alt="workfitAI"
                  src="/assets/imgs/page/homepage1/controlcard.png"
                />
                <figure className="wow animate__animated animate__fadeIn">
                  <img
                    alt="workfitAI"
                    src="/assets/imgs/page/homepage1/img1.png"
                  />
                </figure>
              </div>
            </div>
            <div className="col-lg-6 col-sm-12">
              <div className="content-job-inner">
                <span className="color-text-mutted text-32">
                  Millions Of Jobs.{" "}
                </span>
                <h2 className="text-52 wow animate__animated animate__fadeInUp">
                  Find The One That’s{" "}
                  <span className="color-brand-2">Right</span> For You
                </h2>
                <div className="mt-40 pr-50 text-md-lh28 wow animate__animated animate__fadeInUp">
                  Search all the open positions on the web. Get your own
                  personalized salary estimate. Read reviews on over 600,000
                  companies worldwide. The right job is out there.
                </div>
                <div className="mt-40">
                  <div className="wow animate__animated animate__fadeInUp">
                    <Link href="/jobs-list">
                      <span className="btn btn-default">Search Jobs</span>
                    </Link>

                    <Link href="/page-about">
                      <span className="btn btn-link">Learn More</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-box overflow-visible mt-50 mb-50">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="text-center">
                <h1 className="color-brand-2">
                  <span className="count">25</span>
                  <span> K+</span>
                </h1>
                <h5>Completed Cases</h5>
                <p className="font-sm color-text-paragraph mt-10">
                  We always provide people a{" "}
                  <br className="d-none d-lg-block" />
                  complete solution upon focused of
                  <br className="d-none d-lg-block" /> any business
                </p>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="text-center">
                <h1 className="color-brand-2">
                  <span className="count">17</span>
                  <span> +</span>
                </h1>
                <h5>Our Office</h5>
                <p className="font-sm color-text-paragraph mt-10">
                  We always provide people a{" "}
                  <br className="d-none d-lg-block" />
                  complete solution upon focused of{" "}
                  <br className="d-none d-lg-block" />
                  any business
                </p>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="text-center">
                <h1 className="color-brand-2">
                  <span className="count">86</span>
                  <span> +</span>
                </h1>
                <h5>Skilled People</h5>
                <p className="font-sm color-text-paragraph mt-10">
                  We always provide people a{" "}
                  <br className="d-none d-lg-block" />
                  complete solution upon focused of{" "}
                  <br className="d-none d-lg-block" />
                  any business
                </p>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="text-center">
                <h1 className="color-brand-2">
                  <span className="count">28</span>
                  <span> +</span>
                </h1>
                <h5>CHappy Clients</h5>
                <p className="font-sm color-text-paragraph mt-10">
                  We always provide people a{" "}
                  <br className="d-none d-lg-block" />
                  complete solution upon focused of{" "}
                  <br className="d-none d-lg-block" />
                  any business
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section-box mt-50 mb-20">
        <div className="container">
          <div className="box-newsletter">
            <div className="row">
              <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                <img
                  src="/assets/imgs/template/newsletter-left.png"
                  alt="WorkfitAI"
                />
              </div>
              <div className="col-lg-12 col-xl-6 col-12">
                <h2 className="text-md-newsletter text-center">
                  New Things Will Always
                  <br /> Update Regularly
                </h2>
                <div className="box-form-newsletter mt-40">
                  <form className="form-newsletter">
                    <input
                      className="input-newsletter"
                      type="text"
                      placeholder="Enter your email here"
                    />
                    <button className="btn btn-default font-heading icon-send-letter">
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                <img
                  src="/assets/imgs/template/newsletter-right.png"
                  alt="WorkfitAI"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
