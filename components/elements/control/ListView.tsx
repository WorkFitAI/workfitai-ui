import { Job } from "@/types";

type ListViewProps = {
  job: Job;
};

export default function ListView({ job }: ListViewProps) {
  return (
    <div className="card-style-2 hover-up">
      <div className="card-head">
        <div className="card-image">
          <img src={`/assets/imgs/brands/${job.img}`} alt="jobBox" />
        </div>
        <div className="card-title">
          <h6>{job.title}</h6>
          <span className="job-type">{job.type}</span>
          <span className="time-post">{job.date} mins ago</span>
          <span className="location">New York, US</span>
        </div>
      </div>
      <div className="card-tags">
        {job.tags.map((item) => (
          <a className="btn btn-tag" key={item}>
            {item}
          </a>
        ))}
      </div>
      <div className="card-price">
        <strong>${job.salary}</strong>
        <span className="hour">/Hour</span>
      </div>
    </div>
  );
}
