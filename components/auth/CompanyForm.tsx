"use client";

import React from "react";
import FormInput from "./FormInput";

export interface CompanyFormData {
  companyNo: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  address: string;
  size?: string;
}

interface CompanyFormProps {
  value: CompanyFormData;
  onChange: (data: CompanyFormData) => void;
  errors?: Partial<Record<keyof CompanyFormData, string>>;
}

export default function CompanyForm({
  value,
  onChange,
  errors,
}: CompanyFormProps) {
  const handleChange = (field: keyof CompanyFormData, val: string) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div className="company-form">
      <h4 className="mb-20 text-brand-1">Company Information</h4>

      <FormInput
        id="companyNo"
        label="Company Number"
        value={value.companyNo}
        onChange={(val) => handleChange("companyNo", val)}
        required
        placeholder="123456789"
        helpText="Enter your company's registration number or tax ID"
        error={errors?.companyNo}
      />

      <FormInput
        id="companyName"
        label="Company Name"
        value={value.name}
        onChange={(val) => handleChange("name", val)}
        required
        placeholder="Acme Inc."
        error={errors?.name}
      />

      <div className="row">
        <div className="col-md-6">
          <FormInput
            id="websiteUrl"
            label="Website URL"
            value={value.websiteUrl || ""}
            onChange={(val) => handleChange("websiteUrl", val)}
            placeholder="https://example.com"
            error={errors?.websiteUrl}
          />
        </div>
        <div className="col-md-6">
          <div className="form-group">
            <label className="form-label" htmlFor="companySize">
              Company Size
            </label>
            <select
              className="form-control"
              id="companySize"
              value={value.size || ""}
              onChange={(e) => handleChange("size", e.target.value)}
            >
              <option value="" disabled>
                Select size...
              </option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501+">501+ employees</option>
            </select>
          </div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="address">
          Address *
        </label>
        <textarea
          className={`form-control ${errors?.address ? "is-invalid" : ""}`}
          id="address"
          rows={3}
          value={value.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="123 Business St, City, Country"
          required
        />
        {errors?.address && (
          <div className="invalid-feedback d-block">{errors.address}</div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Description
        </label>
        <textarea
          className="form-control"
          id="description"
          rows={3}
          value={value.description || ""}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Tell us about your company..."
        />
      </div>
    </div>
  );
}
