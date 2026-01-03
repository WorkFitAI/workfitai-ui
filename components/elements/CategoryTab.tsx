"use client";
import React, { useState } from "react";
import Link from "next/link";

const CategoryTab = () => {
  const [active, setActive] = useState(1);

  const handleOnClick = (index: number) => {
    setActive(index);
  };
  return (
    <>
      <div className="list-tabs mt-40  text-center">
        <ul className="nav nav-tabs" role="tablist">
          <li>
            <span
              className={active === 1 ? "active" : ""}
              onClick={() => handleOnClick(1)}
            >
              <img
                src="/assets/imgs/page/homepage1/management.svg"
                alt="workfitAI"
              />{" "}
              Management
            </span>
          </li>
          <li>
            <span
              className={active === 2 ? "active" : ""}
              onClick={() => handleOnClick(2)}
            >
              <img
                src="/assets/imgs/page/homepage1/marketing.svg"
                alt="workfitAI"
              />{" "}
              Marketing &amp; Sale
            </span>
          </li>
          <li>
            <span
              className={active === 3 ? "active" : ""}
              onClick={() => handleOnClick(3)}
            >
              <img
                src="/assets/imgs/page/homepage1/finance.svg"
                alt="workfitAI"
              />{" "}
              Finance
            </span>
          </li>
          <li>
            <span
              className={active === 4 ? "active" : ""}
              onClick={() => handleOnClick(4)}
            >
              <img
                src="/assets/imgs/page/homepage1/human.svg"
                alt="workfitAI"
              />{" "}
              Human Resource
            </span>
          </li>
          <li>
            <span
              className={active === 5 ? "active" : ""}
              onClick={() => handleOnClick(5)}
            >
              <img
                src="/assets/imgs/page/homepage1/retail.svg"
                alt="workfitAI"
              />{" "}
              Retail &amp; Products
            </span>
          </li>
          <li>
            <span
              className={active === 6 ? "active" : ""}
              onClick={() => handleOnClick(6)}
            >
              <img
                src="/assets/imgs/page/homepage1/content.svg"
                alt="workfitAI"
              />{" "}
              Content Writer
            </span>
          </li>
        </ul>
      </div>
      <div className="tab-content mt-70" id="myTabContent-1">
        <div className={`tab-pane fade ${active == 1 && "show active"}`}>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-1.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">LinkedIn</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>UI / UX Designer fulltime</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Adobe XD</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-2.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Adobe Ilustrator</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Full Stack Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">React</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">NodeJS</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-3.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Bing Search</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Java Software Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Python</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">AWS</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-4.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Dailymotion</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Frontend Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">
                        Typescript
                      </span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Java</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-5.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Linkedin</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>React Native Web Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Angular</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-6.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Quora JSC</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Senior System Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">PHP</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Android</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-7.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Nintendo</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Products Manager</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">ASP .Net</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-8.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Periscope</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Lead Quality Control QA</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">iOS</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Laravel</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Golang</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`tab-pane fade ${active == 2 && "show active"}`}>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-7.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Nintendo</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Products Manager</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">ASP .Net</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-4.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Dailymotion</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Frontend Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">
                        Typescript
                      </span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Java</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-5.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Linkedin</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>React Native Web Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Angular</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-8.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Periscope</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Lead Quality Control QA</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">iOS</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Laravel</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Golang</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-1.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">LinkedIn</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>UI / UX Designer fulltime</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Adobe XD</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-2.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Adobe Ilustrator</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Full Stack Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">React</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">NodeJS</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-3.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Bing Search</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Java Software Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Python</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">AWS</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-6.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Quora JSC</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Senior System Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">PHP</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Android</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`tab-pane fade ${active == 3 && "show active"}`}>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-4.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Dailymotion</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Frontend Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">
                        Typescript
                      </span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Java</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-5.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Linkedin</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>React Native Web Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Angular</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-6.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Quora JSC</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Senior System Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">PHP</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Android</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-7.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Nintendo</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Products Manager</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">ASP .Net</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-8.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Periscope</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Lead Quality Control QA</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">iOS</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Laravel</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Golang</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-1.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">LinkedIn</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>UI / UX Designer fulltime</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Adobe XD</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-2.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Adobe Ilustrator</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Full Stack Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">React</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">NodeJS</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-3.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Bing Search</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Java Software Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Python</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">AWS</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`tab-pane fade ${active == 4 && "show active"}`}>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-7.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Nintendo</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Products Manager</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">ASP .Net</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-8.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Periscope</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Lead Quality Control QA</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">iOS</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Laravel</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Golang</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-4.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Dailymotion</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Frontend Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">
                        Typescript
                      </span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Java</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-5.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Linkedin</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>React Native Web Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Angular</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-6.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Quora JSC</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Senior System Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">PHP</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Android</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-1.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">LinkedIn</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>UI / UX Designer fulltime</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Adobe XD</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-2.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Adobe Ilustrator</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Full Stack Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">React</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">NodeJS</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-3.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Bing Search</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Java Software Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Python</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">AWS</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`tab-pane fade ${active == 5 && "show active"}`}>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-8.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Periscope</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Lead Quality Control QA</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">iOS</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Laravel</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Golang</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-1.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">LinkedIn</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>UI / UX Designer fulltime</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Adobe XD</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-4.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Dailymotion</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Frontend Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">
                        Typescript
                      </span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Java</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-5.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Linkedin</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>React Native Web Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Angular</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-6.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Quora JSC</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Senior System Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">PHP</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Android</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-7.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Nintendo</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Products Manager</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">ASP .Net</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-2.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Adobe Ilustrator</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Full Stack Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">React</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">NodeJS</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-3.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Bing Search</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Java Software Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Python</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">AWS</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={`tab-pane fade ${active == 6 && "show active"}`}>
          <div className="row">
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-8.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Periscope</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Lead Quality Control QA</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">iOS</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Laravel</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Golang</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-1.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">LinkedIn</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>UI / UX Designer fulltime</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Adobe XD</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-2.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Adobe Ilustrator</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Full Stack Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">React</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">NodeJS</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-3.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Bing Search</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Java Software Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Python</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">AWS</span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Photoshop</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-4.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Dailymotion</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Frontend Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">
                        Typescript
                      </span>
                    </Link>

                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Java</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-5.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Linkedin</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>React Native Web Developer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Fulltime</span>
                    <span className="card-time">
                      4<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur
                  </p>
                  <div className="mt-30">
                    <Link href="/jobs-grid">
                      <span className="btn btn-grey-small mr-5">Angular</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$500</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-6.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Quora JSC</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Senior System Engineer</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Part time</span>
                    <span className="card-time">
                      5<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">PHP</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Android</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$800</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
              <div className="card-grid-2 hover-up">
                <div className="card-grid-2-image-left">
                  <span className="flash" />
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-7.png" alt="workfitAI" />
                  </div>
                  <div className="right-info">
                    <Link href="company-details">
                      <span className="name-job">Nintendo</span>
                    </Link>
                    <span className="location-small">New York, US</span>
                  </div>
                </div>
                <div className="card-block-info">
                  <h6>
                    <Link href="/job-details">
                      <span>Products Manager</span>
                    </Link>
                  </h6>
                  <div className="mt-5">
                    <span className="card-briefcase">Full time</span>
                    <span className="card-time">
                      6<span> minutes ago</span>
                    </span>
                  </div>
                  <p className="font-sm color-text-paragraph mt-15">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                    Recusandae architecto eveniet, dolor quo repellendus
                    pariatur.
                  </p>
                  <div className="mt-30">
                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">ASP .Net</span>
                    </Link>

                    <Link href="/job-details">
                      <span className="btn btn-grey-small mr-5">Figma</span>
                    </Link>
                  </div>
                  <div className="card-2-bottom mt-30">
                    <div className="row">
                      <div className="col-lg-7 col-7">
                        <span className="card-text-price">$250</span>
                        <span className="text-muted">/Hour</span>
                      </div>
                      <div className="col-lg-5 col-5 text-end">
                        <div
                          className="btn btn-apply-now"
                          data-bs-toggle="modal"
                          data-bs-target="#ModalApplyJobForm"
                        >
                          Apply now
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryTab;
