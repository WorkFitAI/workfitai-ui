import Link from "next/link";
import Image from "next/image";
import { getJobs } from "@/lib/jobApi";
import { JobDetail } from "@/types/job/job";

interface Props {
  postId: string;
}

export default async function SimilarJobs({ postId }: Props) {
  const resSimilar = await getJobs<JobDetail[]>(
    `/public/jobs/similar/${postId}`
  );
  const similarJobs = resSimilar.data;

  if (!similarJobs || similarJobs.length === 0) return null;

  return (
    <div className="sidebar-border">
      <h6 className="f-18">Similar jobs</h6>
      <div className="sidebar-list-job">
        <ul>
          {similarJobs.map((job) => (
            <li key={job.postId}>
              <div className="card-list-4 hover-up">
                {/* Avatar company */}
                <div className="image">
                  <Link href={`/job-details/${job.postId}`}>
                    <span>
                      <Image
                        src={
                          job.company?.logoUrl ||
                          "/assets/imgs/page/job-single/thumb.png"
                        }
                        alt={job.company?.name || "Company"}
                        width={50}
                        height={50}
                        unoptimized
                        style={{
                          maxWidth: "50px",
                          maxHeight: "50px",
                          objectFit: "contain",
                          borderRadius: "10px",
                        }}
                      />
                    </span>
                  </Link>
                </div>

                <div className="info-text">
                  <h5 className="font-md font-bold color-brand-1">
                    <Link href={`/job-details/${job.postId}`}>
                      <span>{job.title}</span>
                    </Link>
                  </h5>

                  <div className="mt-0">
                    <span className="card-briefcase">{job.employmentType}</span>
                    <span className="card-time">
                      <span>
                        {new Date(job.createdDate).toLocaleDateString()}
                      </span>
                    </span>
                  </div>

                  <div className="mt-5">
                    <div className="row">
                      <div className="col-6">
                        <h6 className="card-price">
                          {job.salaryMin} - {job.salaryMax} {job.currency}
                        </h6>
                      </div>
                      <div className="col-6 text-end">
                        <span className="card-briefcase">
                          {job.company?.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    {job.skillNames?.slice(0, 3).map((sk, index) => (
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
  );
}
