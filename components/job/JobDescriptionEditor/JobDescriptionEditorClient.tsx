"use client";

import { useState, useEffect } from "react";
import { JobDetail } from "@/types/job/job";
import dynamic from "next/dynamic";
import { putJob } from "@/lib/jobApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ReqUpdateJobDTO } from "@/types/job/job";
import { Skill } from "@/types/job/skill";
import { getSkills, ApiResponse } from "@/lib/skillApi";
import { SkillDataResponse } from "@/types/job/skill";
import JobStatusAction from "@/components/job/JobStatusAction/JobStatusAction";

const JobDescriptionEditor = dynamic(() => import("./JobDescriptionEditor"), {
  ssr: false,
});

interface Props {
  job: JobDetail;
  onChange: (job: JobDetail) => void;
}

export default function JobDescriptionEditorClient({ job, onChange }: Props) {
  const [jobState, setJobState] = useState<JobDetail>(job);
  const [saving, setSaving] = useState(false);
  const [skillsList, setSkillsList] = useState<Skill[]>([]);

  // Fetch skill list on mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res: ApiResponse<SkillDataResponse> =
          await getSkills<SkillDataResponse>(`/public/skills`);

        const skillsArray = Array.isArray(res.data?.result)
          ? res.data.result
          : [];
        setSkillsList(skillsArray); // lưu vào state
      } catch (err) {
        console.error("Failed to fetch skills:", err);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    setJobState(job);
  }, [job]);

  // Map JobDetail -> ReqUpdateJobDTO
  const mapJobToReqDTO = (job: JobDetail): ReqUpdateJobDTO => ({
    jobId: job.postId,
    title: job.title,
    description: job.description,
    shortDescription: job.shortDescription,
    benefits: job.benefits,
    requirements: job.requirements,
    responsibilities: job.responsibilities,
    requiredExperience: job.requiredExperience,
    employmentType: job.employmentType,
    experienceLevel: job.experienceLevel,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    currency: job.currency,
    location: job.location,
    quantity: job.quantity,
    expiresAt: job.expiresAt,
    educationLevel: job.educationLevel,
    companyNo: job.company?.companyNo || "",
    skillIds:
      job.skillNames
        ?.map((name) => skillsList.find((s) => s.name === name)?.skillId)
        .filter((id): id is string => !!id) || [],
    status: job.status,
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const dto = mapJobToReqDTO(jobState);
      await putJob(`/hr/jobs`, { body: dto });
      onChange(jobState);
      toast.success("Job updated successfully!");
    } catch (err) {
      console.error(err);
      const msg =
        (err instanceof Error ? err.message : "Failed to update job.") ||
        "Failed to update job.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <JobStatusAction
          jobId={jobState.postId}
          currentStatus={jobState.status}
          onStatusChanged={(newStatus) => {
            // update local state form
            setJobState((prev) => ({ ...prev, status: newStatus }));

            // update state cha để JobStatusBadge render lại
            onChange({ ...jobState, status: newStatus });
          }}
        />
      </div>

      <JobDescriptionEditor job={jobState} onChange={setJobState} />

      <button
        onClick={handleSave}
        disabled={saving}
        className="btn mt-4"
        style={{
          backgroundColor: "#3C65F5",
          borderColor: "#3C65F5",
          color: "white",
        }}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}
