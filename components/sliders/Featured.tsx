"use client";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";

const FeaturedSlider = () => {
  return (
    <>
      <div className="swiper-container swiper-group-4">
        <Swiper
          slidesPerView={4}
          spaceBetween={30}
          loop={true}
          modules={[Navigation]}
          navigation={{
            prevEl: ".swiper-button-prev-4",
            nextEl: ".swiper-button-next-4",
          }}
          className="swiper-wrapper pb-10 pt-5"
        >
          <SwiperSlide>
            <div className="card-grid-2 hover-up wow animate__animated animate__fadeIn">
              <div className="card-grid-2-image-left">
                <span className="flash" />
                <div className="image-box">
                  <img src="/assets/imgs/brands/brand-6.png" alt="workfitAI" />
                </div>
                <div className="right-info">
                  <Link href="/company-details">
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
                  Recusandae architecto eveniet, dolor quo repellendus pariatur.
                </p>
                <div className="mt-30">
                  <Link href="/job-details">
                    <span className="btn btn-grey-small mr-5">PHP</span>
                  </Link>

                  <Link href="/job-details">
                    <span className="btn btn-grey-small mr-5">Android </span>
                  </Link>
                </div>
                <div className="card-2-bottom mt-30">
                  <div className="row">
                    <div className="col-lg-7 col-7">
                      <span className="card-text-price">$800</span>
                      <span className="text-muted">/Hour</span>
                    </div>
                    <div className="col-lg-5 col-5 text-end">
                      <Link href="/job-details">
                        <span className="btn btn-apply-now">Apply now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card-grid-2 hover-up wow animate__animated animate__fadeIn">
              <div className="card-grid-2-image-left">
                <span className="flash" />
                <div className="image-box">
                  <img src="/assets/imgs/brands/brand-4.png" alt="workfitAI" />
                </div>
                <div className="right-info">
                  <Link href="/company-details">
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
                  Recusandae architecto eveniet, dolor quo repellendus pariatur.
                </p>
                <div className="mt-30">
                  <Link href="/jobs-grid">
                    <span className="btn btn-grey-small mr-5">Typescript</span>
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
                      <Link href="/job-details">
                        <span className="btn btn-apply-now">Apply now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card-grid-2 hover-up wow animate__animated animate__fadeIn">
              <div className="card-grid-2-image-left">
                <span className="flash" />
                <div className="image-box">
                  <img src="/assets/imgs/brands/brand-8.png" alt="workfitAI" />
                </div>
                <div className="right-info">
                  <Link href="/company-details">
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
                  Recusandae architecto eveniet, dolor quo repellendus pariatur.
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
                      <Link href="/job-details">
                        <span className="btn btn-apply-now">Apply now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card-grid-2 hover-up wow animate__animated animate__fadeIn">
              <div className="card-grid-2-image-left">
                <span className="flash" />
                <div className="image-box">
                  <img src="/assets/imgs/brands/brand-4.png" alt="workfitAI" />
                </div>
                <div className="right-info">
                  <Link href="/company-details">
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
                  Recusandae architecto eveniet, dolor quo repellendus pariatur.
                </p>
                <div className="mt-30">
                  <Link href="/jobs-grid">
                    <span className="btn btn-grey-small mr-5">Typescript</span>
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
                      <Link href="/job-details">
                        <span className="btn btn-apply-now">Apply now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card-grid-2 hover-up wow animate__animated animate__fadeIn">
              <div className="card-grid-2-image-left">
                <span className="flash" />
                <div className="image-box">
                  <img src="/assets/imgs/brands/brand-6.png" alt="workfitAI" />
                </div>
                <div className="right-info">
                  <Link href="/company-details">
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
                  Recusandae architecto eveniet, dolor quo repellendus pariatur.
                </p>
                <div className="mt-30">
                  <Link href="/job-details">
                    <span className="btn btn-grey-small mr-5">PHP</span>
                  </Link>

                  <Link href="/job-details">
                    <span className="btn btn-grey-small mr-5">Android </span>
                  </Link>
                </div>
                <div className="card-2-bottom mt-30">
                  <div className="row">
                    <div className="col-lg-7 col-7">
                      <span className="card-text-price">$800</span>
                      <span className="text-muted">/Hour</span>
                    </div>
                    <div className="col-lg-5 col-5 text-end">
                      <Link href="/job-details">
                        <span className="btn btn-apply-now">Apply now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card-grid-2 hover-up wow animate__animated animate__fadeIn">
              <div className="card-grid-2-image-left">
                <span className="flash" />
                <div className="image-box">
                  <img src="/assets/imgs/brands/brand-4.png" alt="workfitAI" />
                </div>
                <div className="right-info">
                  <Link href="/company-details">
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
                  Recusandae architecto eveniet, dolor quo repellendus pariatur.
                </p>
                <div className="mt-30">
                  <Link href="/jobs-grid">
                    <span className="btn btn-grey-small mr-5">Typescript</span>
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
                      <Link href="/job-details">
                        <span className="btn btn-apply-now">Apply now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card-grid-2 hover-up wow animate__animated animate__fadeIn">
              <div className="card-grid-2-image-left">
                <span className="flash" />
                <div className="image-box">
                  <img src="/assets/imgs/brands/brand-8.png" alt="workfitAI" />
                </div>
                <div className="right-info">
                  <Link href="/company-details">
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
                  Recusandae architecto eveniet, dolor quo repellendus pariatur.
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
                      <Link href="/job-details">
                        <span className="btn btn-apply-now">Apply now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="card-grid-2 hover-up wow animate__animated animate__fadeIn">
              <div className="card-grid-2-image-left">
                <span className="flash" />
                <div className="image-box">
                  <img src="/assets/imgs/brands/brand-4.png" alt="workfitAI" />
                </div>
                <div className="right-info">
                  <Link href="/company-details">
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
                  Recusandae architecto eveniet, dolor quo repellendus pariatur.
                </p>
                <div className="mt-30">
                  <Link href="/jobs-grid">
                    <span className="btn btn-grey-small mr-5">Typescript</span>
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
                      <Link href="/job-details">
                        <span className="btn btn-apply-now">Apply now</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>

        <div className="swiper-button-next swiper-button-next-4" />
        <div className="swiper-button-prev swiper-button-prev-4" />
      </div>
    </>
  );
};

export default FeaturedSlider;
