"use client";

import React, { useState } from "react";
import FormField from "@/components/common/FormField";
import SkillsSelectInner from "@/components/job/SkillsSelectInner/SkillsSelectInner";
import { PostJobData, PostJobForm } from "@/types/job/job";
import { DatePickerField } from "@/components/common/DatePickerField";

interface PostJobProps {
  onSubmit: (data: PostJobData) => void;
}

export default function PostJob({ onSubmit }: PostJobProps) {
  const [form, setForm] = useState<PostJobForm>({
    title: "",
    shortDescription: "",
    description: "",
    benefits: "",
    requirements: "",
    responsibilities: "",
    employmentType: "",
    experienceLevel: "",
    requiredExperience: "",
    salaryMin: "",
    salaryMax: "",
    currency: "VND",
    location: "",
    quantity: 1,
    expiresAt: "",
    educationLevel: "",
    companyNo: "",
    skillIds: [],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      salaryMin: Number(form.salaryMin),
      salaryMax: Number(form.salaryMax),
      expiresAt: new Date(form.expiresAt).toISOString(),
    });
  };

  return (
    <div className="min-vh-100 py-4" style={{ backgroundColor: "#F9FAFB" }}>
      <div className="container-fluid px-md-5">
        {/* HEADER SECTION */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1" style={{ color: "#111827" }}>
              Create a Job Post
            </h3>
            <p className="text-muted small mb-0">
              Fill in the details to reach the right candidates.
            </p>
          </div>
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-light border fw-medium text-secondary px-4"
            >
              Save Draft
            </button>
            <button
              form="job-form"
              type="submit"
              className="btn btn-primary fw-bold px-4"
              style={{ backgroundColor: "#3C65F5", border: "none" }}
            >
              Publish Job
            </button>
          </div>
        </div>

        <form id="job-form" onSubmit={handleSubmit}>
          <div className="row g-4">
            {/* LEFT SIDE: MAIN FORM */}
            <div className="col-xl-8 col-lg-7">
              <div className="vstack gap-4">
                {/* Information Card */}
                <div className="card border-0 shadow-sm rounded-3">
                  <div className="card-body p-4">
                    <div className="mb-4">
                      <label className="form-label fw-bold small text-muted text-uppercase mb-2">
                        Basic Info
                      </label>
                      <input
                        name="title"
                        className="form-control form-control-lg border-2 shadow-none mb-3"
                        placeholder="e.g. Senior Frontend Developer"
                        value={form.title}
                        onChange={handleChange}
                        style={{ borderRadius: "8px" }}
                        required
                      />
                      <FormField<PostJobForm>
                        label="Short Description"
                        name="shortDescription"
                        value={form.shortDescription}
                        onChange={handleChange}
                        rows={2}
                        placeholder="A catchy summary for candidates..."
                        required
                      />
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <FormField<PostJobForm>
                          label="Responsibilities"
                          name="responsibilities"
                          value={form.responsibilities}
                          onChange={handleChange}
                          rows={4}
                          required={true}
                        />
                      </div>
                      <div className="col-md-6">
                        <FormField<PostJobForm>
                          label="Requirements"
                          name="requirements"
                          value={form.requirements}
                          onChange={handleChange}
                          rows={4}
                          required={true}
                        />
                      </div>
                    </div>

                    <div className="row g-3 mb-4">
                      <div className="col-md-6">
                        <FormField<PostJobForm>
                          label="Benefits"
                          name="benefits"
                          value={form.benefits}
                          onChange={handleChange}
                          rows={4}
                          required={true}
                        />
                      </div>
                      <div className="col-md-6">
                        <FormField<PostJobForm>
                          label="Education Level"
                          name="educationLevel"
                          value={form.educationLevel}
                          onChange={handleChange}
                          rows={4}
                          required={true}
                        />
                      </div>
                    </div>

                    <FormField<PostJobForm>
                      label="Full Job Description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={6}
                      required={true}
                    />
                  </div>
                </div>

                {/* Skills Card */}
                <div className="card border-0 shadow-sm rounded-3">
                  <div className="card-body p-4">
                    <label className="form-label fw-bold small text-muted text-uppercase mb-3">
                      Target Skills <span className="text-danger"> *</span>
                    </label>
                    <SkillsSelectInner
                      value={form.skillIds}
                      onChange={(ids) =>
                        setForm((prev) => ({ ...prev, skillIds: ids }))
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: SIDEBAR SETTINGS */}
            <div className="col-xl-4 col-lg-5">
              <div className="sticky-top" style={{ top: "20px", zIndex: 10 }}>
                <div className="card border-0 shadow-sm rounded-3 mb-4 overflow-hidden">
                  <div className="card-body p-4 vstack gap-4">
                    {/* Salary Section */}
                    <div>
                      <label className="form-label small fw-bold text-muted text-uppercase mb-2">
                        Monthly Salary Range{" "}
                        <span className="text-danger"> *</span>
                      </label>
                      <div className="input-group border rounded-2 overflow-hidden shadow-none">
                        <input
                          type="number"
                          name="salaryMin"
                          className="form-control border-0 px-3"
                          placeholder="Min"
                          value={form.salaryMin}
                          onChange={handleChange}
                          required
                        />
                        <span className="bg-white border-0 px-1 opacity-25 d-flex align-items-center">
                          |
                        </span>
                        <input
                          type="number"
                          name="salaryMax"
                          className="form-control border-0 px-3"
                          placeholder="Max"
                          value={form.salaryMax}
                          onChange={handleChange}
                          required
                        />
                        <select
                          name="currency"
                          className="form-select border-0 bg-light fw-bold"
                          style={{ maxWidth: "90px" }}
                          value={form.currency}
                          onChange={handleChange}
                        >
                          <option value="VND">VND</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>
                    </div>

                    <DatePickerField
                      label="Application Deadline"
                      value={form.expiresAt}
                      onChange={(v) =>
                        setForm((prev) => ({ ...prev, expiresAt: v }))
                      }
                      required
                    />

                    {/* Quantity & Experience Combined Row */}
                    <div className="row g-0">
                      <div className="col-12">
                        <FormField<PostJobForm>
                          label="Quantity"
                          name="quantity"
                          value={form.quantity}
                          required={true}
                          onChange={handleChange}
                          type="number"
                        />
                      </div>

                      <div className="col-12">
                        <FormField<PostJobForm>
                          label="Experience Level"
                          name="experienceLevel"
                          value={form.experienceLevel}
                          required={true}
                          onChange={handleChange}
                          options={[
                            { label: "Fresher", value: "FRESHER" },
                            { label: "Junior", value: "JUNIOR" },
                            { label: "Middle", value: "MID" },
                            { label: "Senior", value: "SENIOR" },
                            { label: "Lead", value: "LEAD" },
                          ]}
                        />
                      </div>

                      <div className="col-12">
                        <FormField<PostJobForm>
                          label="Years of Experience"
                          name="requiredExperience"
                          value={form.requiredExperience}
                          onChange={handleChange}
                          placeholder="e.g. 2+ years"
                          required={true}
                        />
                      </div>
                    </div>

                    <hr className="my-0 opacity-10 mt-2 mb-2" />

                    <div className="vstack gap-3">
                      <FormField<PostJobForm>
                        label="Employment Type"
                        name="employmentType"
                        value={form.employmentType}
                        required={true}
                        onChange={handleChange}
                        options={[
                          { label: "Full-time", value: "FULL_TIME" },
                          { label: "Part-time", value: "PART_TIME" },
                          { label: "Contract", value: "CONTRACT" },
                          { label: "Internship", value: "INTERN" },
                          { label: "Remote", value: "REMOTE" },
                        ]}
                      />
                      <FormField<PostJobForm>
                        label="Work Location"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        placeholder="e.g. Hanoi, Remote"
                        required
                      />
                      <FormField<PostJobForm>
                        label="Company Ref No"
                        name="companyNo"
                        value={form.companyNo}
                        onChange={handleChange}
                        required={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Button */}
                <div className="d-lg-none mt-3">
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-bold shadow"
                  >
                    Publish Job Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
