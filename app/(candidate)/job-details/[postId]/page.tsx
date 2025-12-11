/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import FeaturedSlider from "@/components/sliders/Featured";

import { getJobs } from "@/lib/jobApi";

const formatVietnam = (isoString: string) => {
  const d = new Date(isoString);
  return (
    d.getDate().toString().padStart(2, "0") +
    "/" +
    (d.getMonth() + 1).toString().padStart(2, "0") +
    "/" +
    d.getFullYear() +
    " " +
    d.getHours().toString().padStart(2, "0") +
    ":" +
    d.getMinutes().toString().padStart(2, "0")
  );
};

interface Company {
  companyNo: string;
  name: string;
  description: string;
  address: string;
  websiteUrl: string | null;
  logoUrl: string | null;
  size: string | null;
}

interface JobDetails {
  postId: string;
  title: string;
  description: string;
  employmentType: string;
  experienceLevel: string;
  requiredExperience: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  expiresAt: string;
  status: string;
  educationLevel: string;
  requirements: string;
  responsibilities: string;
  benefits: string;
  skillNames: string[];
  location: string | null;
  company: Company;
  bannerUrl: string | null;
  createdDate: string;
  lastModifiedDate: string;
}

// 3. Định nghĩa kiểu dữ liệu cho phản hồi API
interface ApiResponse {
  data: JobDetails;
  message: string;
  status: number;
  timestamp: string;
}

interface Props {
  params: { postId: string };
}

export default async function JobDetails(props: Props) {
  const { postId } = await props.params;

  const res = await getJobs<ApiResponse>(`/public/jobs/${postId}`);
  const resSimilar = await getJobs<ApiResponse>(
    `/public/jobs/similar/${postId}`
  );

  if (!res.data) {
    return <h1>Công việc không tồn tại.</h1>;
  }

  const job = res.data;
  const similarJobs = resSimilar.data;
  return (
    <>
      <div>
        <section className="section-box-2">
          <div className="container">
            <div className="banner-hero banner-image-single">
              {job.bannerUrl ? (
                <img src={job.bannerUrl} alt="jobBox" />
              ) : (
                <img
                  src="/assets/imgs/page/job-single/thumb.png"
                  alt="jobBox"
                />
              )}
            </div>
            {/* Title, Job Type, Create Time, Apply Button */}
            <div className="row mt-10">
              <div className="col-lg-8 col-md-12">
                <h3>{job.title}</h3>
                <div className="mt-0 mb-15">
                  <span className="card-briefcase">{job.employmentType}</span>
                  <span className="card-time">
                    {formatVietnam(job.createdDate)}
                  </span>
                </div>
              </div>
              <div className="col-lg-4 col-md-12 text-lg-end">
                <div
                  className="btn btn-apply-icon btn-apply btn-apply-big hover-up"
                  data-bs-toggle="modal"
                  data-bs-target="#ModalApplyJobForm"
                >
                  Apply now
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
                    Employment Information
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
                          {job.skillNames.join(", ")}
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
                          {job.experienceLevel}
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
                          {job.salaryMin} - {job.salaryMax}
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
                          {job.requiredExperience
                            ? job.requiredExperience
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
                          {job.employmentType}
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
                          {formatVietnam(job.expiresAt)}
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
                          {job.lastModifiedDate
                            ? formatVietnam(job.lastModifiedDate)
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
                          {job.location ? job.location : "N/A"}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Job Description */}
                <div className="content-single">
                  {/* Company */}
                  <h4>Welcome to {job.company?.name || "Company"}</h4>
                  <p>
                    {job.company?.description ||
                      "No company description available."}
                  </p>

                  {/* Job Description */}
                  <p>{job.description}</p>

                  {/* Education Level */}
                  {job.educationLevel && (
                    <>
                      <h4>Education Level</h4>
                      <p>{job.educationLevel}</p>
                    </>
                  )}

                  {/* Skills + Experience Level */}
                  {job.skillNames && job.skillNames.length > 0 && (
                    <>
                      <h4>Essential Knowledge, Skills</h4>
                      {job.skillNames.map((skill: string, index: number) => (
                        <p key={index}>{skill}</p>
                      ))}

                      {job.experienceLevel && (
                        <>
                          <h4>Experience Level</h4>
                          <p>{job.experienceLevel}</p>
                        </>
                      )}
                    </>
                  )}

                  {/* Preferred Experience */}
                  {job.requirements && (
                    <>
                      <h4>Preferred Experience</h4>
                      {job.requirements
                        .split("\n")
                        .map((req: string, index: number) => (
                          <p key={index}>{req}</p>
                        ))}
                    </>
                  )}

                  {/* Responsibility */}
                  {job.responsibilities && (
                    <>
                      <h4>Responsibilities</h4>
                      {job.responsibilities
                        .split("\n")
                        .map((resp: string, index: number) => (
                          <p key={index}>{resp}</p>
                        ))}
                    </>
                  )}

                  {/* Benefits */}
                  {job.benefits && (
                    <>
                      <h4>What We Offer</h4>
                      {job.benefits
                        .split("\n")
                        .map((benefit: string, index: number) => (
                          <p key={index}>{benefit}</p>
                        ))}
                    </>
                  )}
                </div>
                {/* Author */}
                <div className="author-single">
                  <span>{job.company.name}</span>
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
                <div className="sidebar-border">
                  <div className="sidebar-heading">
                    <div className="avatar-sidebar">
                      <figure>
                        <img
                          src={job.company?.logoUrl}
                          alt={job.company?.name || "Company"}
                          style={{
                            maxWidth: "60px",
                            maxHeight: "70px",
                            objectFit: "contain",
                            borderRadius: "10px",
                          }}
                        />
                      </figure>
                      <div className="sidebar-info">
                        <span className="sidebar-company">
                          {job.company.name}
                        </span>
                        <span className="card-location">
                          {job.location ? job.location : "N/A"}
                        </span>
                        <Link href="#">
                          <span className="link-underline mt-15">
                            {job.quantity} Open position(s)
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="sidebar-list-job">
                    <div className="box-map">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.3150609575905!2d-87.6235655!3d41.886080899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2ca8b34afe61%3A0x6caeb5f721ca846!2s205%20N%20Michigan%20Ave%20Suit%20810%2C%20Chicago%2C%20IL%2060601%2C%20Hoa%20K%E1%BB%B3!5e0!3m2!1svi!2s!4v1658551322537!5m2!1svi!2s"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                    <ul className="ul-disc">
                      <li>{job.company.address}</li>
                      <li>Phone: (123) 456-7890</li>
                      <li>Email: contact@Evara.com</li>
                    </ul>
                  </div>
                </div>
                <div className="sidebar-border">
                  <h6 className="f-18">Similar jobs</h6>
                  <div className="sidebar-list-job">
                    <ul>
                      {similarJobs.map((job: any) => (
                        <li key={job.postId}>
                          <div className="card-list-4 hover-up">
                            {/* Avatar company */}
                            <div className="image">
                              <Link href={`/job-details/${job.postId}`}>
                                <span>
                                  {job.company.logoUrl ? (
                                    <img
                                      src={job.company?.logoUrl}
                                      alt={job.company?.name || "Company"}
                                      style={{
                                        maxWidth: "50px",
                                        maxHeight: "50px",
                                        objectFit: "contain",
                                        borderRadius: "10px",
                                      }}
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl">
                                      {job.company.name.charAt(0)}
                                    </div>
                                  )}
                                </span>
                              </Link>
                            </div>

                            <div className="info-text">
                              {/* Job title */}
                              <h5 className="font-md font-bold color-brand-1">
                                <Link href={`/job-details/${job.postId}`}>
                                  <span>{job.title}</span>
                                </Link>
                              </h5>

                              <div className="mt-0">
                                <span className="card-briefcase">
                                  {job.employmentType}
                                </span>

                                <span className="card-time">
                                  <span>{formatVietnam(job.createdDate)}</span>
                                </span>
                              </div>

                              <div className="mt-5">
                                <div className="row">
                                  <div className="col-6">
                                    <h6 className="card-price">
                                      {job.salaryMin} - {job.salaryMax}{" "}
                                      {job.currency}
                                    </h6>
                                  </div>
                                  <div className="col-6 text-end">
                                    <span className="card-briefcase">
                                      {job.company.name}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Skills */}
                              <div className="mt-2">
                                {job.skillNames
                                  .slice(0, 3)
                                  .map((sk: string, index: number) => (
                                    <span
                                      key={sk + index}
                                      className="badge bg-light text-dark me-1"
                                    >
                                      {sk}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
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
