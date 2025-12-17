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
  // Helper để update từng field
  const updateJobField = <K extends keyof JobDetail>(
    field: K,
    value: JobDetail[K]
  ) => {
    onChange({ ...job, [field]: value });
  };

  return (
    <div className="content-single">
      {/* Title */}
      <h4>Title</h4>
      <input
        type="text"
        value={job.title ?? ""}
        onChange={(e) => updateJobField("title", e.target.value)}
        className="form-control"
        placeholder="Enter job title"
      />
      {/* Company */}
      <h4>Welcome to {job.company?.name || "Company"}</h4>
      <ParagraphEditor
        value={job.company?.description ?? ""}
        onChange={(val) =>
          onChange({
            ...job,
            company: {
              ...(job.company ?? {}),
              description: val,
            },
          })
        }
      />

      {/* Job Description */}
      <h4>Job Description</h4>
      <ParagraphEditor
        value={job.description ?? ""}
        onChange={(val) => updateJobField("description", val)}
      />
      {/* Short Description */}
      <h4>Short Description</h4>
      <input
        type="text"
        value={job.shortDescription ?? ""}
        onChange={(e) => updateJobField("shortDescription", e.target.value)}
        className="form-control"
        placeholder="Enter job title"
      />
      {/* Education Level */}
      <h4>Education Level</h4>
      <ParagraphEditor
        value={job.educationLevel ?? ""}
        onChange={(val) => updateJobField("educationLevel", val)}
      />
      {/* Skills */}
      <h4>Essential Knowledge, Skills</h4>
      <SkillsSelect
        value={job.skillNames ?? []}
        onChange={(val) => updateJobField("skillNames", val)}
      />
      {/* Preferred Experience */}
      <h4>Preferred Experience</h4>
      <ParagraphEditor
        value={job.requirements ?? ""}
        onChange={(val) => updateJobField("requirements", val)}
      />
      {/* Responsibilities */}
      <h4>Responsibilities</h4>
      <ParagraphEditor
        value={job.responsibilities ?? ""}
        onChange={(val) => updateJobField("responsibilities", val)}
      />
      {/* Benefits */}
      <h4>What We Offer</h4>
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
          <h4>Location</h4>
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
          <h4>Currency</h4>
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
          <h4>Job Type</h4>
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
          <h4>Experience Level</h4>
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
          <h4>Salary Min</h4>
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
          <h4>Salary Max</h4>
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
          <h4>Opening Positions</h4>
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
          <h4>Expires Date</h4>
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
