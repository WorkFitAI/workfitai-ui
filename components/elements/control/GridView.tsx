import Link from "next/link";
import { useState } from "react";

import { Job } from "@/types";

import Modal from "./Modal";

type GridViewProps = {
  job: Job;
};

export default function GridView({ job }: GridViewProps) {
  const [modalToggle, setModalToggle] = useState<boolean>(false);
  const handleModal = () => setModalToggle((prev) => !prev);

  return (
    <>
      <div className="card-grid-2 hover-up">
        <div className="card-grid-2-image-left">
          <span className="flash" />
          <div className="image-box">
            <img src={`/assets/imgs/brands/${job.img}`} alt="jobBox" />
          </div>
          <div className="right-info">
            <Link className="name-job" href="/company-details">
              {job.company}
            </Link>
            <span className="location-small">New York, US</span>
          </div>
        </div>
        <div className="card-block-info">
          <h6>
            <Link href="/job-details">{job.title}</Link>
          </h6>
          <div className="mt-5">
            <span className="card-briefcase">{job.type} </span>
            <span className="card-time">
              {job.date}
              <span> minutes ago</span>
            </span>
          </div>
          <p className="font-sm color-text-paragraph mt-15">{job.desc}</p>
          <div className="mt-30">
            {job.tags.map((item) => (
              <Link className="btn btn-grey-small mr-5" href="#" key={item}>
                {item}
              </Link>
            ))}
          </div>
          <div className="card-2-bottom mt-30">
            <div className="row">
              <div className="col-lg-7 col-7">
                <span className="card-text-price">${job.salary}</span>
                <span className="text-muted">/Hour</span>
              </div>
              <div className="col-lg-5 col-5 text-end">
                <div className="btn btn-apply-now" onClick={handleModal}>
                  Apply now
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal modalToggle={modalToggle} handleModal={handleModal} />
    </>
  );
}
