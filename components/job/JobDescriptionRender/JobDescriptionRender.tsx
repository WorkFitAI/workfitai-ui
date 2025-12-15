"use client";

import React from "react";
import { JobDetail } from "@/types/job/job";
import RichTextRender from "@/components/common/RichTextRender";

interface JobDescriptionRenderProps {
  job: JobDetail;
}

const JobDescriptionRender: React.FC<JobDescriptionRenderProps> = ({ job }) => {
  return (
    <div className="content-single">
      {/* Company */}
      <h4>Welcome to {job?.company?.name || "Company"}</h4>
      <p>{job?.company?.description || "No company description available."}</p>

      {/* Job Description */}
      {job?.description && (
        <>
          <h4>Description</h4>
          <RichTextRender content={job.description} />
        </>
      )}

      {/* Education Level */}
      {job?.educationLevel && (
        <>
          <h4>Education Level</h4>
          <RichTextRender content={job.educationLevel} />
        </>
      )}

      {/* Preferred Experience */}
      {job?.requirements && (
        <>
          <h4>Preferred Experience</h4>
          <RichTextRender content={job.requirements} />
        </>
      )}

      {/* Responsibilities */}
      {job?.responsibilities && (
        <>
          <h4>Responsibilities</h4>
          <RichTextRender content={job.responsibilities} />
        </>
      )}

      {/* Benefits */}
      {job?.benefits && (
        <>
          <h4>What We Offer</h4>
          <RichTextRender content={job.benefits} />
        </>
      )}
    </div>
  );
};

export default JobDescriptionRender;
