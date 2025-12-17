"use client";
import Link from "next/link";
import FeaturedSlider from "@/components/sliders/Featured";
import Image from "next/image";

import { getJobs } from "@/lib/jobApi";
import SimilarJobs from "@/components/job/SimilarJob/SimilarJobs";
import CompanySidebar from "@/components/job/SimilarJob/CompanySideBar";

import ApplySection from "@/components/application/ApplySection";

import { JobDetail } from "@/types/job/job";
import JobStatusBadge from "@/components/job/JobStatusAction/JobStatusBadge";
import BannerUploader from "@/components/job/Banner/BannerUploader";
import JobDescriptionRender from "@/components/job/JobDescriptionRender/JobDescriptionRender";
import { useEffect, useState } from "react";
import { selectUserRole } from "@/redux/features/auth/authSlice";
import { useSelector } from "react-redux";
import JobDescriptionEditorClient from "../JobDescriptionEditor/JobDescriptionEditorClient";
import Preloader from "@/app/loading";
interface Props {
  postId: string;
}

export default function JobDetailsClient({ postId }: Props) {
  const role = useSelector(selectUserRole);
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    const fetchJob = async () => {
      const endpoint =
        role === "HR" || role === "HR_MANAGER"
          ? `/hr/jobs/${postId}`
          : `/public/jobs/${postId}`;
      setLoading(true);
      getJobs<JobDetail>(endpoint)
        .then((res) => setJob(res.data ?? null))
        .finally(() => setLoading(false));
    };

    fetchJob();
  }, [postId, role]);

  if (loading) return <Preloader />;
  if (!job) return <div>Job not found</div>;

  return (
    <>
      <div>
        <section className="section-box-2">
          <div className="container">
            <div className="banner-hero banner-image-single">
              {role === "HR" || role === "HR_MANAGER" ? (
                <BannerUploader
                  jobId={job.postId}
                  initialUrl={
                    job?.bannerUrl || "/assets/imgs/page/job-single/thumb.png"
                  }
                />
              ) : (
                <Image
                  src={
                    job?.bannerUrl || "/assets/imgs/page/job-single/thumb.png"
                  }
                  alt="job banner"
                  priority
                  unoptimized
                  width={500}
                  height={400}
                />
              )}
            </div>
            {/* Title, Job Type, Create Time, Apply Button */}
            <div className="row mt-10">
              <div className="col-lg-8 col-md-12">
                <h3>{job?.title}</h3>
                <div className="mt-0 mb-15">
                  <span className="card-briefcase">{job?.employmentType}</span>
                  <span className="card-time">
                    {new Date(job?.createdDate).toLocaleDateString()}
                  </span>
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
                {/* Job Overview */}
                <div className="job-overview">
                  <h5 className="border-bottom pb-15 mb-30">
                    Employment Information{" "}
                    <JobStatusBadge status={job.status} />
                  </h5>
                  <div className="row">
                    <div className="col-md-6 d-flex">
                      <div className="sidebar-icon-item">
                        <img
                          src="/assets/imgs/page/job-single/industry.svg"
                          alt="jobBox"
                        />
                      </div>
                      <div className="sidebar-text-info ml-10">
                        <span className="text-description industry-icon mb-10">
                          Skills
                        </span>
                        <strong className="small-heading">
                          {job?.skillNames.join(", ")}
                        </strong>
                      </div>
                    </div>
                    <div className="col-md-6 d-flex mt-sm-15">
                      <div className="sidebar-icon-item">
                        <img
                          src="/assets/imgs/page/job-single/job-level.svg"
                          alt="jobBox"
                        />
                      </div>
                      <div className="sidebar-text-info ml-10">
                        <span className="text-description joblevel-icon mb-10">
                          Job level
                        </span>
                        <strong className="small-heading">
                          {job?.experienceLevel}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-25">
                    <div className="col-md-6 d-flex mt-sm-15">
                      <div className="sidebar-icon-item">
                        <img
                          src="/assets/imgs/page/job-single/salary.svg"
                          alt="jobBox"
                        />
                      </div>
                      <div className="sidebar-text-info ml-10">
                        <span className="text-description salary-icon mb-10">
                          Salary
                        </span>
                        <strong className="small-heading">
                          {job?.salaryMin} - {job?.salaryMax}
                        </strong>
                      </div>
                    </div>
                    <div className="col-md-6 d-flex">
                      <div className="sidebar-icon-item">
                        <img
                          src="/assets/imgs/page/job-single/experience.svg"
                          alt="jobBox"
                        />
                      </div>
                      <div className="sidebar-text-info ml-10">
                        <span className="text-description experience-icon mb-10">
                          Experience
                        </span>
                        <strong className="small-heading">
                          {job?.requiredExperience
                            ? job?.requiredExperience
                            : "N/A"}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-25">
                    <div className="col-md-6 d-flex mt-sm-15">
                      <div className="sidebar-icon-item">
                        <img
                          src="/assets/imgs/page/job-single/job-type.svg"
                          alt="jobBox"
                        />
                      </div>
                      <div className="sidebar-text-info ml-10">
                        <span className="text-description jobtype-icon mb-10">
                          Job type
                        </span>
                        <strong className="small-heading">
                          {job?.employmentType}
                        </strong>
                      </div>
                    </div>
                    <div className="col-md-6 d-flex mt-sm-15">
                      <div className="sidebar-icon-item">
                        <img
                          src="/assets/imgs/page/job-single/deadline.svg"
                          alt="jobBox"
                        />
                      </div>
                      <div className="sidebar-text-info ml-10">
                        <span className="text-description mb-10">Deadline</span>
                        <strong className="small-heading">
                          {new Date(job?.expiresAt).toLocaleDateString()}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="row mt-25">
                    <div className="col-md-6 d-flex mt-sm-15">
                      <div className="sidebar-icon-item">
                        <img
                          src="/assets/imgs/page/job-single/updated.svg"
                          alt="jobBox"
                        />
                      </div>
                      <div className="sidebar-text-info ml-10">
                        <span className="text-description jobtype-icon mb-10">
                          Updated
                        </span>
                        <strong className="small-heading">
                          {job?.lastModifiedDate
                            ? new Date(
                                job?.lastModifiedDate
                              ).toLocaleDateString()
                            : "N/A"}
                        </strong>
                      </div>
                    </div>
                    <div className="col-md-6 d-flex mt-sm-15">
                      <div className="sidebar-icon-item">
                        <img
                          src="/assets/imgs/page/job-single/location.svg"
                          alt="jobBox"
                        />
                      </div>
                      <div className="sidebar-text-info ml-10">
                        <span className="text-description mb-10">Location</span>
                        <strong className="small-heading">
                          {job?.location ? job?.location : "N/A"}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Job Description */}
                {role === "HR" || role === "HR_MANAGER" ? (
                  <JobDescriptionEditorClient job={job} />
                ) : (
                  <JobDescriptionRender job={job} />
                )}
                {/* Author */}
                <div className="author-single">
                  <span>{job?.company.name}</span>
                </div>
                {/* Apply Job & Share */}
                <div className="single-apply-jobs">
                  <div className="row align-items-center">
                    <div className="col-md-5">
                      <Link href="#">
                        <span className="btn btn-default mr-15">Apply now</span>
                      </Link>

                      <Link href="#">
                        <span className="btn btn-border">Save job</span>
                      </Link>
                    </div>
                    <div className="col-md-7 text-lg-end social-share">
                      <h6 className="color-text-paragraph-2 d-inline-block d-baseline mr-10">
                        Share this
                      </h6>
                      <Link href="#">
                        <span className="mr-5 d-inline-block d-middle">
                          <img
                            alt="jobBox"
                            src="/assets/imgs/template/icons/share-fb.svg"
                          />
                        </span>
                      </Link>

                      <Link href="#">
                        <span className="mr-5 d-inline-block d-middle">
                          <img
                            alt="jobBox"
                            src="/assets/imgs/template/icons/share-tw.svg"
                          />
                        </span>
                      </Link>

                      <Link href="#">
                        <span className="mr-5 d-inline-block d-middle">
                          <img
                            alt="jobBox"
                            src="/assets/imgs/template/icons/share-red.svg"
                          />
                        </span>
                      </Link>

                      <Link href="#">
                        <span className="d-inline-block d-middle">
                          <img
                            alt="jobBox"
                            src="/assets/imgs/template/icons/share-whatsapp.svg"
                          />
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              {/* Similar Jobs */}
              <div className="col-lg-4 col-md-12 col-sm-12 col-12 pl-40 pl-lg-15 mt-lg-30">
                <CompanySidebar job={job} />

                <ApplySection jobId={job.postId} />

                <SimilarJobs postId={job.postId} />
              </div>
            </div>
          </div>
        </section>

        {/* Featured Jobs */}
        <section className="section-box mt-50 mb-50">
          <div className="container">
            <div className="text-left">
              <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">
                Featured Jobs
              </h2>
              <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">
                Get the latest news, updates and tips
              </p>
            </div>
            <div className="mt-50">
              <div className="box-swiper style-nav-top">
                <FeaturedSlider />
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
                    alt="joxBox"
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
                    alt="joxBox"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
