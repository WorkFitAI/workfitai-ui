"use client";

import { Menu } from "@headlessui/react";
import Link from "next/link";
import VacancyChart from "@/components/elements/VacancyChart";
// import BrandSlider from "@/components/sliders/BrandSlider";

const metrics = [
  { label: "Interview Schedules", value: "1,568", trend: "+25%", direction: "up", icon: "/assets/imgs/page/dashboard/computer.svg" },
  { label: "Applied Jobs", value: "284", trend: "+5%", direction: "up", icon: "/assets/imgs/page/dashboard/bank.svg" },
  { label: "Task Bids Won", value: "136", trend: "+12%", direction: "up", icon: "/assets/imgs/page/dashboard/lamp.svg" },
  { label: "Application Sent", value: "985", trend: "+5%", direction: "up", icon: "/assets/imgs/page/dashboard/headphone.svg" },
];

const latestJobs = [
  {
    title: "Senior Full Stack Engineer, Creator Success",
    type: "Full time",
    time: "3 mins ago",
    location: "New York, US",
    tags: ["Figma", "Adobe XD"],
    rate: "$300",
    image: "/assets/imgs/page/dashboard/img1.png",
  },
  {
    title: "Lead Product/UX/UI Designer Role",
    type: "Full time",
    time: "12 mins ago",
    location: "Paris, France",
    tags: ["Figma", "Adobe XD", "PSD"],
    rate: "$650",
    image: "/assets/imgs/page/dashboard/img3.png",
  },
  {
    title: "Marketing Graphic Designer",
    type: "Full time",
    time: "30 mins ago",
    location: "Tokyo, Japan",
    tags: ["Illustrator", "Figma", "Photoshop"],
    rate: "$580",
    image: "/assets/imgs/page/dashboard/img4.png",
  },
];

const candidates = [
  { name: "Robert Fox", role: "UI/UX Designer", location: "Chicago, US", avatar: "/assets/imgs/page/dashboard/avata1.png" },
  { name: "Cody Fisher", role: "Network Engineer", location: "New York, US", avatar: "/assets/imgs/page/dashboard/avata2.png" },
  { name: "Jane Cooper", role: "Content Manager", location: "Chicago, US", avatar: "/assets/imgs/page/dashboard/avata3.png" },
  { name: "Jerome Bell", role: "Frontend Developer", location: "Chicago, US", avatar: "/assets/imgs/page/dashboard/avata4.png" },
];

const recruiters = [
  { name: "Robert Fox", location: "Red, CA", openJobs: 25, avatar: "/assets/imgs/page/dashboard/avata1.png" },
  { name: "Cody Fisher", location: "Chicago, US", openJobs: 25, avatar: "/assets/imgs/page/dashboard/avata2.png" },
  { name: "Jane Cooper", location: "Austin, TX", openJobs: 25, avatar: "/assets/imgs/page/dashboard/avata3.png" },
  { name: "Jerome Bell", location: "Remote", openJobs: 25, avatar: "/assets/imgs/page/dashboard/avata4.png" },
];

const topSearches = [
  { label: "Development", value: 1220, progress: 70 },
  { label: "Marketing", value: 920, progress: 50 },
  { label: "Finance", value: 853, progress: 40 },
];

const TrendBadge = ({ direction, children }: { direction: "up" | "down"; children: ReactNode }) => (
  <span className={`font-sm status ${direction}`}>{children}</span>
);

export default function AdminDashboardPage() {
  return (
    <>
      <div className="section-box">
        <div className="container">
          <div className="row">
            {metrics.map((metric) => (
              <div key={metric.label} className="col-xxl-3 col-xl-6 col-lg-6 col-md-4 col-sm-6">
                <div className="card-style-1 hover-up">
                  <div className="card-image">
                    <img src={metric.icon} alt="jobBox" />
                  </div>
                  <div className="card-info">
                    <div className="card-title">
                      <h3>
                        {metric.value}
                        <TrendBadge direction={metric.direction}>
                          {metric.trend}
                        </TrendBadge>
                      </h3>
                    </div>
                    <p className="color-text-paragraph-2">{metric.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-box">
        <div className="container">
          <div className="panel-white">
            <div className="panel-head">
              <h5>Vacancy Stats</h5>
              <Menu as="div">
                <Menu.Button as="a" className="menudrop" />
                <Menu.Items as="ul" className="dropdown-menu dropdown-menu-light dropdown-menu-end show" style={{ right: "0", left: "auto" }}>
                  <li>
                    <Link className="dropdown-item active" href="#">
                      Add new
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Actions
                    </Link>
                  </li>
                </Menu.Items>
              </Menu>
            </div>
            <div className="panel-body">
              <VacancyChart />
            </div>
          </div>
        </div>
      </div>

      <div className="section-box">
        <div className="container">
          <div className="row">
            <div className="col-xxl-8 col-xl-7 col-lg-7">
              <div className="panel-white">
                <div className="panel-head">
                  <h5>Latest Jobs</h5>
                  <Menu as="div">
                    <Menu.Button as="a" className="menudrop" />
                    <Menu.Items as="ul" className="dropdown-menu dropdown-menu-light dropdown-menu-end show" style={{ right: "0", left: "auto" }}>
                      <li>
                        <Link className="dropdown-item active" href="#">
                          Add new
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="#">
                          Settings
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="#">
                          Actions
                        </Link>
                      </li>
                    </Menu.Items>
                  </Menu>
                </div>
                <div className="panel-body">
                  {latestJobs.map((job) => (
                    <div key={job.title} className="card-style-2 hover-up">
                      <div className="card-head">
                        <div className="card-image">
                          <img src={job.image} alt="jobBox" />
                        </div>
                        <div className="card-title">
                          <h6>{job.title}</h6>
                          <span className="job-type">{job.type}</span>
                          <span className="time-post">{job.time}</span>
                          <span className="location">{job.location}</span>
                        </div>
                      </div>
                      <div className="card-tags">
                        {job.tags.map((tag) => (
                          <a key={tag} className="btn btn-tag">
                            {tag}
                          </a>
                        ))}
                      </div>
                      <div className="card-price">
                        <strong>{job.rate}</strong>
                        <span className="hour">/Hour</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-xxl-4 col-xl-5 col-lg-5">
              <div className="panel-white">
                <div className="panel-head">
                  <h5>Top Candidates</h5>
                  <Menu as="div">
                    <Menu.Button as="a" className="menudrop" />
                    <Menu.Items as="ul" className="dropdown-menu dropdown-menu-light dropdown-menu-end show" style={{ right: "0", left: "auto" }}>
                      <li>
                        <Link className="dropdown-item active" href="#">
                          Add new
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="#">
                          Settings
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="#">
                          Actions
                        </Link>
                      </li>
                    </Menu.Items>
                  </Menu>
                </div>
                <div className="panel-body">
                  {candidates.map((candidate) => (
                    <div key={candidate.name} className="card-style-3 hover-up">
                      <div className="card-image online">
                        <img src={candidate.avatar} alt={candidate.name} />
                      </div>
                      <div className="card-title">
                        <h6>{candidate.name}</h6>
                        <span className="job-position">{candidate.role}</span>
                      </div>
                      <div className="card-location">
                        <span className="location">{candidate.location}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-box">
        <div className="container">
          <div className="panel-white">
            <div className="panel-head">
              <h5>Top Recruiters</h5>
              <Menu as="div">
                <Menu.Button as="a" className="menudrop" />
                <Menu.Items as="ul" className="dropdown-menu dropdown-menu-light dropdown-menu-end show" style={{ right: "0", left: "auto" }}>
                  <li>
                    <Link className="dropdown-item active" href="#">
                      Add new
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Actions
                    </Link>
                  </li>
                </Menu.Items>
              </Menu>
            </div>
            <div className="panel-body">
              <div className="row">
                {recruiters.map((recruiter) => (
                  <div key={recruiter.name} className="col-lg-6 col-md-6 pr-5 pl-5">
                    <div className="card-style-4 hover-up">
                      <div className="d-flex">
                        <div className="card-image">
                          <img src={recruiter.avatar} alt={recruiter.name} />
                        </div>
                        <div className="card-title">
                          <h6>{recruiter.name}</h6>
                          <img src="/assets/imgs/page/dashboard/star.svg" alt="rating" />
                          <img src="/assets/imgs/page/dashboard/star.svg" alt="rating" />
                          <img src="/assets/imgs/page/dashboard/star.svg" alt="rating" />
                          <img src="/assets/imgs/page/dashboard/star-none.svg" alt="rating" />
                          <img src="/assets/imgs/page/dashboard/star-none.svg" alt="rating" />
                          <span className="font-xs color-text-mutted">(65)</span>
                        </div>
                      </div>
                      <div className="card-location d-flex">
                        <span className="location">{recruiter.location}</span>
                        <span className="jobs-number">{recruiter.openJobs} Open Jobs</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="section-box">
        <div className="container">
          <div className="panel-white">
            <div className="panel-head">
              <h5>Queries by search</h5>
              <Menu as="div">
                <Menu.Button as="a" className="menudrop" />
                <Menu.Items as="ul" className="dropdown-menu dropdown-menu-light dropdown-menu-end show" style={{ right: "0", left: "auto" }}>
                  <li>
                    <Link className="dropdown-item active" href="#">
                      Add new
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Actions
                    </Link>
                  </li>
                </Menu.Items>
              </Menu>
            </div>
            <div className="panel-body">
              {topSearches.map((search) => (
                <div key={search.label} className="card-style-5 hover-up">
                  <div className="card-title">
                    <h6 className="font-sm">{search.label}</h6>
                  </div>
                  <div className="card-progress">
                    <div className="number font-sm">{search.value}</div>
                    <div className="progress">
                      <div className="progress-bar" style={{ width: `${search.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="section-box">
          <div className="container">
            <div className="panel-white pt-30 pb-30 pl-15 pr-15">
              <div className="box-swiper">
                <div className="swiper-container swiper-group-10">
                  {/* <BrandSlider /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
