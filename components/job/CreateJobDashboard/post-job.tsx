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
    <div className="container py-5">
      <form
        onSubmit={handleSubmit}
        className="mx-auto"
        style={{ maxWidth: 900 }}
      >
        {/* ================= BASIC INFO ================= */}
        <h5 className="mb-3">Basic Information</h5>

        <FormField<PostJobForm>
          label="Job title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <FormField<PostJobForm>
          label="Short description"
          name="shortDescription"
          value={form.shortDescription}
          onChange={handleChange}
          rows={3}
          required
        />

        {/* ================= DESCRIPTION ================= */}

        <FormField<PostJobForm>
          label="Job description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={6}
          required
        />

        <FormField<PostJobForm>
          label="Responsibilities"
          name="responsibilities"
          value={form.responsibilities}
          onChange={handleChange}
          rows={4}
        />

        <FormField<PostJobForm>
          label="Requirements"
          name="requirements"
          value={form.requirements}
          onChange={handleChange}
          rows={4}
        />

        <FormField<PostJobForm>
          label="Benefits"
          name="benefits"
          value={form.benefits}
          onChange={handleChange}
          rows={4}
        />

        {/* ================= JOB DETAILS ================= */}
        <div className="row">
          <div className="col-md-6 d-flex flex-column">
            <FormField<PostJobForm>
              label="Employment type"
              name="employmentType"
              value={form.employmentType}
              onChange={handleChange}
              required
              options={[
                { label: "Full-time", value: "FULL_TIME" },
                { label: "Part-time", value: "PART_TIME" },
                { label: "Contract", value: "CONTRACT" },
                { label: "Internship", value: "INTERNSHIP" },
                { label: "Remote", value: "REMOTE" },
              ]}
            />
          </div>

          <div className="col-md-6 d-flex flex-column">
            <FormField<PostJobForm>
              label="Experience level"
              name="experienceLevel"
              value={form.experienceLevel}
              onChange={handleChange}
              required
              options={[
                { label: "Intern", value: "INTERN" },
                { label: "Junior", value: "JUNIOR" },
                { label: "Middle", value: "MID" },
                { label: "Senior", value: "SENIOR" },
                { label: "Lead", value: "LEAD" },
              ]}
            />
          </div>
        </div>

        <FormField<PostJobForm>
          label="Required experience"
          name="requiredExperience"
          value={form.requiredExperience}
          onChange={handleChange}
          placeholder="e.g. 2+ years"
        />

        <FormField<PostJobForm>
          label="Education level"
          name="educationLevel"
          value={form.educationLevel}
          onChange={handleChange}
        />

        {/* ================= SALARY ================= */}
        <h5 className="mt-4 mb-3">Salary</h5>

        <div className="row">
          <div className="col-md-4">
            <FormField<PostJobForm>
              label="Salary min"
              name="salaryMin"
              value={form.salaryMin}
              onChange={handleChange}
              type="number"
              required
            />
          </div>

          <div className="col-md-4">
            <FormField<PostJobForm>
              label="Salary max"
              name="salaryMax"
              value={form.salaryMax}
              onChange={handleChange}
              type="number"
              required
            />
          </div>

          <div className="col-md-4">
            <FormField<PostJobForm>
              label="Currency"
              name="currency"
              value={form.currency}
              onChange={handleChange}
              options={[
                { label: "VND", value: "VND" },
                { label: "USD", value: "USD" },
              ]}
            />
          </div>
        </div>

        {/* ================= LOCATION ================= */}
        <h5 className="mt-4 mb-3">Location & Company</h5>

        <FormField<PostJobForm>
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <div className="row">
          <div className="col-md-6">
            <FormField<PostJobForm>
              label="Quantity"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              type="number"
              required
            />
          </div>

          <div className="col-md-6">
            <DatePickerField
              label="Expire date"
              value={form.expiresAt}
              onChange={(v) => setForm((prev) => ({ ...prev, expiresAt: v }))}
              required
            />
          </div>
        </div>

        <FormField<PostJobForm>
          label="Company No"
          name="companyNo"
          value={form.companyNo}
          onChange={handleChange}
          required
        />

        {/* ================= SKILLS ================= */}
        <h5 className="mt-4 mb-3">
          Skills <span className="text-danger">*</span>
        </h5>

        <SkillsSelectInner
          value={form.skillIds}
          onChange={(ids) => setForm((prev) => ({ ...prev, skillIds: ids }))}
        />

        {/* ================= SUBMIT ================= */}
        <button className="btn btn-primary mt-4">Create Job</button>
      </form>
    </div>
  );
}
