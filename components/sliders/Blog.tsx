"use client";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";

const BlogSlider = () => {
  return (
    <>
      <div className="swiper-container swiper-group-3 swiper">
        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          modules={[Navigation]}
          className="swiper-wrapper pb-70 pt-5"
        >
          <SwiperSlide>
            <div className="swiper-slide">
              <div className="card-grid-3 hover-up wow animate__animated animate__fadeIn">
                <div className="text-center card-grid-3-image">
                  <Link href="#">
                    <span>
                      <figure>
                        <img
                          alt="workfitAI"
                          src="/assets/imgs/page/homepage1/img-news1.png"
                        />
                      </figure>
                    </span>
                  </Link>
                </div>
                <div className="card-block-info">
                  <div className="tags mb-15">
                    <Link href="/blog-grid">
                      <span className="btn btn-tag">News</span>
                    </Link>
                  </div>
                  <h5>
                    <Link href="/blog-grid">
                      <span>
                        21 Job Interview Tips: How To Make a Great Impression
                      </span>
                    </Link>
                  </h5>
                  <p className="mt-10 color-text-paragraph font-sm">
                    Our mission is to create the world&amp;rsquo;s most
                    sustainable healthcare company by creating high-quality
                    healthcare products in iconic, sustainable packaging.
                  </p>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <div className="d-flex">
                          <img
                            className="img-rounded"
                            src="/assets/imgs/page/homepage1/user1.png"
                            alt="workfitAI"
                          />
                          <div className="info-right-img">
                            <span className="font-sm font-bold color-brand-1 op-70">
                              Sarah Harding
                            </span>
                            <br />
                            <span className="font-xs color-text-paragraph-2">
                              06 September
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 text-end col-6 pt-15">
                        <span className="color-text-paragraph-2 font-xs">
                          8 mins to read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="swiper-slide">
              <div className="card-grid-3 hover-up wow animate__animated animate__fadeIn">
                <div className="text-center card-grid-3-image">
                  <Link href="#">
                    <span>
                      <figure>
                        <img
                          alt="workfitAI"
                          src="/assets/imgs/page/homepage1/img-news2.png"
                        />
                      </figure>
                    </span>
                  </Link>
                </div>
                <div className="card-block-info">
                  <div className="tags mb-15">
                    <Link href="/blog-grid">
                      <span className="btn btn-tag">Events</span>
                    </Link>
                  </div>
                  <h5>
                    <Link href="/blog-grid">
                      <span>
                        39 Strengths and Weaknesses To Discuss in a Job
                        Interview
                      </span>
                    </Link>
                  </h5>
                  <p className="mt-10 color-text-paragraph font-sm">
                    Our mission is to create the world&amp;rsquo;s most
                    sustainable healthcare company by creating high-quality
                    healthcare products in iconic, sustainable packaging.
                  </p>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <div className="d-flex">
                          <img
                            className="img-rounded"
                            src="/assets/imgs/page/homepage1/user2.png"
                            alt="workfitAI"
                          />
                          <div className="info-right-img">
                            <span className="font-sm font-bold color-brand-1 op-70">
                              Steven Jobs
                            </span>
                            <br />
                            <span className="font-xs color-text-paragraph-2">
                              06 September
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 text-end col-6 pt-15">
                        <span className="color-text-paragraph-2 font-xs">
                          6 mins to read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="swiper-slide">
              <div className="card-grid-3 hover-up wow animate__animated animate__fadeIn">
                <div className="text-center card-grid-3-image">
                  <Link href="#">
                    <span>
                      <figure>
                        <img
                          alt="workfitAI"
                          src="/assets/imgs/page/homepage1/img-news3.png"
                        />
                      </figure>
                    </span>
                  </Link>
                </div>
                <div className="card-block-info">
                  <div className="tags mb-15">
                    <Link href="/blog-grid">
                      <span className="btn btn-tag">News</span>
                    </Link>
                  </div>
                  <h5>
                    <Link href="/blog-grid">
                      <span>
                        Interview Question: Why Dont You Have a Degree?
                      </span>
                    </Link>
                  </h5>
                  <p className="mt-10 color-text-paragraph font-sm">
                    Learn how to respond if an interviewer asks you why you dont
                    have a degree, and read example answers that can help you
                    craft
                  </p>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <div className="d-flex">
                          <img
                            className="img-rounded"
                            src="/assets/imgs/page/homepage1/user3.png"
                            alt="workfitAI"
                          />
                          <div className="info-right-img">
                            <span className="font-sm font-bold color-brand-1 op-70">
                              Wiliam Kend
                            </span>
                            <br />
                            <span className="font-xs color-text-paragraph-2">
                              06 September
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 text-end col-6 pt-15">
                        <span className="color-text-paragraph-2 font-xs">
                          9 mins to read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="swiper-slide">
              <div className="card-grid-3 hover-up wow animate__animated animate__fadeIn">
                <div className="text-center card-grid-3-image">
                  <Link href="#">
                    <span>
                      <figure>
                        <img
                          alt="workfitAI"
                          src="/assets/imgs/page/homepage1/img-news1.png"
                        />
                      </figure>
                    </span>
                  </Link>
                </div>
                <div className="card-block-info">
                  <div className="tags mb-15">
                    <Link href="/blog-grid">
                      <span className="btn btn-tag">News</span>
                    </Link>
                  </div>
                  <h5>
                    <Link href="/blog-grid">
                      <span>
                        21 Job Interview Tips: How To Make a Great Impression
                      </span>
                    </Link>
                  </h5>
                  <p className="mt-10 color-text-paragraph font-sm">
                    Our mission is to create the world&amp;rsquo;s most
                    sustainable healthcare company by creating high-quality
                    healthcare products in iconic, sustainable packaging.
                  </p>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <div className="d-flex">
                          <img
                            className="img-rounded"
                            src="/assets/imgs/page/homepage1/user1.png"
                            alt="workfitAI"
                          />
                          <div className="info-right-img">
                            <span className="font-sm font-bold color-brand-1 op-70">
                              Sarah Harding
                            </span>
                            <br />
                            <span className="font-xs color-text-paragraph-2">
                              06 September
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 text-end col-6 pt-15">
                        <span className="color-text-paragraph-2 font-xs">
                          8 mins to read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="swiper-slide">
              <div className="card-grid-3 hover-up wow animate__animated animate__fadeIn">
                <div className="text-center card-grid-3-image">
                  <Link href="#">
                    <span>
                      <figure>
                        <img
                          alt="workfitAI"
                          src="/assets/imgs/page/homepage1/img-news2.png"
                        />
                      </figure>
                    </span>
                  </Link>
                </div>
                <div className="card-block-info">
                  <div className="tags mb-15">
                    <Link href="/blog-grid">
                      <span className="btn btn-tag">Events</span>
                    </Link>
                  </div>
                  <h5>
                    <Link href="/blog-grid">
                      <span>
                        39 Strengths and Weaknesses To Discuss in a Job
                        Interview
                      </span>
                    </Link>
                  </h5>
                  <p className="mt-10 color-text-paragraph font-sm">
                    Our mission is to create the world&amp;rsquo;s most
                    sustainable healthcare company by creating high-quality
                    healthcare products in iconic, sustainable packaging.
                  </p>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <div className="d-flex">
                          <img
                            className="img-rounded"
                            src="/assets/imgs/page/homepage1/user2.png"
                            alt="workfitAI"
                          />
                          <div className="info-right-img">
                            <span className="font-sm font-bold color-brand-1 op-70">
                              Steven Jobs
                            </span>
                            <br />
                            <span className="font-xs color-text-paragraph-2">
                              06 September
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 text-end col-6 pt-15">
                        <span className="color-text-paragraph-2 font-xs">
                          6 mins to read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="swiper-slide">
              <div className="card-grid-3 hover-up wow animate__animated animate__fadeIn">
                <div className="text-center card-grid-3-image">
                  <Link href="#">
                    <span>
                      <figure>
                        <img
                          alt="workfitAI"
                          src="/assets/imgs/page/homepage1/img-news3.png"
                        />
                      </figure>
                    </span>
                  </Link>
                </div>
                <div className="card-block-info">
                  <div className="tags mb-15">
                    <Link href="/blog-grid">
                      <span className="btn btn-tag">News</span>
                    </Link>
                  </div>
                  <h5>
                    <Link href="/blog-grid">
                      <span>
                        Interview Question: Why Dont You Have a Degree?
                      </span>
                    </Link>
                  </h5>
                  <p className="mt-10 color-text-paragraph font-sm">
                    Learn how to respond if an interviewer asks you why you dont
                    have a degree, and read example answers that can help you
                    craft
                  </p>
                  <div className="card-2-bottom mt-20">
                    <div className="row">
                      <div className="col-lg-6 col-6">
                        <div className="d-flex">
                          <img
                            className="img-rounded"
                            src="/assets/imgs/page/homepage1/user3.png"
                            alt="workfitAI"
                          />
                          <div className="info-right-img">
                            <span className="font-sm font-bold color-brand-1 op-70">
                              Wiliam Kend
                            </span>
                            <br />
                            <span className="font-xs color-text-paragraph-2">
                              06 September
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 text-end col-6 pt-15">
                        <span className="color-text-paragraph-2 font-xs">
                          9 mins to read
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
      <div className="swiper-button-next" />
      <div className="swiper-button-prev" />
    </>
  );
};

export default BlogSlider;
