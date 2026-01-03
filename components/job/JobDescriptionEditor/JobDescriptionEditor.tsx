"use client";

import React from "react";
import { JobDetail } from "@/types/job/job";
import ParagraphEditor from "@/components/editor/ParagraphEditor";
import dynamic from "next/dynamic";

// Dynamic import để tránh SSR (hydration mismatch)
const SkillsSelect = dynamic(
  () => import("@/components/job/SkillsSelect/SkillsSelect"),
  { ssr: false }
);

import ExperienceLevelSelect from "@/components/job/ExperienceLevelSelect/ExperienceLevelSelect";
import JobTypeSelect from "@/components/job/JobTypeSelect/JobTypeSelect";
import OpeningPositionSelect from "@/components/job/OpeningPositionSelect/OpeningPositionSelect";
import LocationSelect from "../LocationSelect/LocationSelect";
import ExpiresAtInput from "../ExpiresAtInput/ExpiresAtInput";
import NumberInput from "../NumberInput/NumberInput";
import CurrencySelect from "../CurrencySelect/CurrencySelect";

interface JobDescriptionEditorProps {
  job: JobDetail;
  onChange: (job: JobDetail) => void;
}

const JobDescriptionEditor: React.FC<JobDescriptionEditorProps> = ({
  job,
  onChange,
}) => {
  const updateJobField = <K extends keyof JobDetail>(
    field: K,
    value: JobDetail[K]
  ) => {
    onChange({ ...job, [field]: value });
  };

  return (
    <div className="content-single">
      {/* Title */}
      <h5>Title</h5>
      <input
        type="text"
        value={job.title ?? ""}
        onChange={(e) => updateJobField("title", e.target.value)}
        className="form-control"
        placeholder="Enter job title"
      />

      {/* Job Description */}
      <h5>Job Description</h5>
      <ParagraphEditor
        value={job.description ?? ""}
        onChange={(val) => updateJobField("description", val)}
      />
      {/* Short Description */}
      <h5>Short Description</h5>
      <input
        type="text"
        value={job.shortDescription ?? ""}
        onChange={(e) => updateJobField("shortDescription", e.target.value)}
        className="form-control"
        placeholder="Enter job title"
      />
      {/* Education Level */}
      <h5>Education Level</h5>
      <ParagraphEditor
        value={job.educationLevel ?? ""}
        onChange={(val) => updateJobField("educationLevel", val)}
      />
      {/* Skills */}
      <h5>Essential Knowledge, Skills</h5>
      <SkillsSelect
        value={job.skillNames ?? []}
        onChange={(val) => updateJobField("skillNames", val)}
      />

      {/* Experience Requirements */}
      <h5>Requirements</h5>
      <ParagraphEditor
        value={job.requirements ?? ""}
        onChange={(val) => updateJobField("requirements", val)}
      />
      {/* Responsibilities */}
      <h5>Responsibilities</h5>
      <ParagraphEditor
        value={job.responsibilities ?? ""}
        onChange={(val) => updateJobField("responsibilities", val)}
      />
      {/* Benefits */}
      <h5>What We Offer</h5>
      <ParagraphEditor
        value={job.benefits ?? ""}
        onChange={(val) => updateJobField("benefits", val)}
      />
      {/* Location & Currency */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "flex-start",
        }}
      >
        {/* Location */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
          }}
        >
          <h5>Location</h5>
          <LocationSelect
            value={job.location ?? ""}
            onChange={(val) => updateJobField("location", val)}
          />
        </div>

        {/* Currency */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
          }}
        >
          <h5>Currency</h5>
          <CurrencySelect
            value={job.currency ?? ""}
            onChange={(val) => updateJobField("currency", val)}
          />
        </div>
      </div>
      {/* Job Type + Experience Level */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
          }}
        >
          {/* JobType */}
          <h5>Job Type</h5>
          <JobTypeSelect
            value={job.employmentType ?? ""}
            onChange={(val) => updateJobField("employmentType", val)}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
          }}
        >
          <h5>Experience Level</h5>
          <ExperienceLevelSelect
            value={job.experienceLevel ?? ""}
            onChange={(val) => updateJobField("experienceLevel", val)}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "flex-start",
        }}
      >
        {/* Salary Min */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
          }}
        >
          <h5>Salary Min</h5>
          <NumberInput
            value={job.salaryMin ?? ""}
            min={0}
            onChange={(val) => updateJobField("salaryMin", val)}
            placeholder="Minimum salary"
          />
        </div>

        {/* Salary Max */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
          }}
        >
          <h5>Salary Max</h5>
          <NumberInput
            value={job.salaryMax ?? ""}
            min={job.salaryMin ?? 0}
            onChange={(val) => updateJobField("salaryMax", val)}
            placeholder="Maximum salary"
          />
        </div>
      </div>
      {/* Opening Positions + Expires At inline */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
          }}
        >
          <h5>Opening Positions</h5>
          <OpeningPositionSelect
            value={job.quantity ?? ""}
            onChange={(val) => updateJobField("quantity", val)}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flex: 1,
          }}
        >
          <h5>Expires Date</h5>
          <ExpiresAtInput
            value={job.expiresAt ?? ""}
            onChange={(val) => updateJobField("expiresAt", val)}
          />
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionEditor;
