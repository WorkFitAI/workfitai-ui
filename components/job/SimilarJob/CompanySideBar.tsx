import Image from "next/image";
import Link from "next/link";
import { JobDetail } from "@/types/job/job";

interface Props {
  job: JobDetail;
}

export default function CompanySidebar({ job }: Props) {
  if (!job || !job.company) return null;

  return (
    <div className="sidebar-border">
      <div className="sidebar-heading">
        <div className="avatar-sidebar">
          <figure>
            <Image
              src={
                job.company.logoUrl || "/assets/imgs/page/job-single/thumb.png"
              }
              alt="company logo"
              width={80}
              height={80}
              priority
              unoptimized
              style={{ objectFit: "contain" }}
            />
          </figure>

          <div className="sidebar-info">
            <span className="sidebar-company">{job?.company?.name}</span>

            <span className="card-location">{job?.location || "N/A"}</span>

            <Link href="#">
              <span className="link-underline mt-15">
                {job?.quantity} Open position(s)
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
  );
}
