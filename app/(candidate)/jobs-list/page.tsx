"use client";
import React, { useEffect } from "react";
import HeroBanner from "@/components/job/Banner/HeroBanner";
import JobFilterSidebar from "@/components/job/Filter/JobFilterSidebar";
import Pagination from "@/components/job/Pagination/Pagination";
import { fetchAllJobs } from "@/redux/features/job/jobListSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Preloader from "@/app/loading";
import { setShowSize, setSortBy } from "@/redux/features/job/jobFilterSlice";
import FilterDropdown from "@/components/job/Dropdown/FilterDropdown";
import Link from "next/link";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";
import type { Job } from "@/types/job/job";

export default function JobList() {
  const dispatch = useAppDispatch();

  const { showSize, sortBy, filter } = useAppSelector(
    (state) => state.jobFilter
  );
  const { jobs, meta, loading } = useAppSelector((state) => state.jobList);

  const [currentPage, setCurrentPage] = React.useState(1);

  const showOptions = [10, 12, 20];
  const sortOptions = ["Newest Post", "Oldest Post", "Rating Post"];

  const debouncedFilter = useDebounce(filter, 400);
  const debouncedSort = useDebounce(sortBy, 300);
  const debouncedShowSize = useDebounce(showSize, 300);

  useEffect(() => {
    dispatch(
      fetchAllJobs({
        page: currentPage,
        size: debouncedShowSize,
        filter: debouncedFilter,
        sort: debouncedSort,
      })
    );
  }, [
    dispatch,
    currentPage,
    debouncedFilter,
    debouncedSort,
    debouncedShowSize,
  ]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sortBy, showSize]); // Đảm bảo khi filter, sortBy hoặc showSize thay đổi thì trang hiện tại sẽ về 1

  if (loading) return <Preloader />;

  return (
    <>
      <HeroBanner />

      <section className="section-box mt-30">
        <div className="container">
          <div className="row flex-row-reverse">
            <div className="col-lg-9 col-md-12 col-sm-12 col-12 float-right">
              <div className="content-page">
                {/* Box filters */}
                <div className="box-filters-job">
                  <div className="row">
                    <div className="col-xl-6 col-lg-5">
                      <span className="text-small text-showing">
                        Showing <strong>1-{jobs.length}</strong> of{" "}
                        <strong>{meta?.total ?? 0}</strong> jobs
                      </span>
                    </div>

                    <div className="col-xl-6 col-lg-7 text-lg-end mt-sm-15">
                      <div className="d-flex align-items-center gap-3">
                        {/* Show Dropdown */}
                        <FilterDropdown
                          label="Show:"
                          value={showSize}
                          options={showOptions}
                          onChange={(val) => dispatch(setShowSize(val))}
                        />

                        {/* Sort Dropdown */}
                        <FilterDropdown
                          label="Sort by:"
                          value={sortBy}
                          options={sortOptions}
                          onChange={(val) => dispatch(setSortBy(val))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Rows */}
                <div className="row display-list">
                  {jobs?.map((job: Job) => (
                    <div className="col-xl-12 col-12" key={job?.postId}>
                      <div className="card-grid-2 hover-up">
                        <span className="flash" />

                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="card-grid-2-image-left">
                              <div className="image-box">
                                <Image
                                  src={
                                    job?.company?.logoUrl ||
                                    "/assets/imgs/page/job-single/thumb.png"
                                  }
                                  alt={job?.company?.name || "Company"}
                                  width={60}
                                  height={70}
                                  unoptimized
                                  style={{
                                    maxWidth: "60px",
                                    maxHeight: "70px",
                                    objectFit: "contain",
                                    borderRadius: "10px",
                                  }}
                                />
                              </div>
                              <div className="right-info">
                                <span className="name-job">
                                  {job?.company?.name || "Unknown Company"}
                                </span>
                                <span className="location-small">
                                  {job?.company?.address || null}
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
                          <h6>
                            <Link href={`/job-details/${job?.postId}`}>
                              <span>{job?.title}</span>
                            </Link>
                          </h6>

                          <p>{job?.shortDescription}</p>

                          <div className="mt-5">
                            <span className="card-briefcase">
                              {job?.employmentType}
                            </span>
                            <span className="card-time">
                              Exp:{" "}
                              {new Date(job?.expiresAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="card-2-bottom mt-20">
                            <div className="row">
                              <div className="col-lg-7 col-7">
                                <span className="card-text-price">
                                  {job?.salaryMin} - {job?.salaryMax}{" "}
                                  {job?.currency}
                                </span>
                              </div>

                              <div className="col-lg-5 col-5 text-end">
                                <Link href={`/job-details/${job?.postId}`}>
                                  <div
                                    className="btn btn-apply-now"
                                    data-bs-toggle="modal"
                                    data-bs-target="#ModalApplyJobForm"
                                  >
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
                {/* End Job Rows */}

                {/* Pagination */}
                {meta && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={meta?.pages || 1}
                    onPageChange={(p) => setCurrentPage(p)}
                  />
                )}
              </div>
            </div>

            {/* Sidebar */}
            <JobFilterSidebar />
          </div>
        </div>
      </section>
    </>
  );
}
