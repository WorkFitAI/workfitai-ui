"use client";

import React from "react";

interface CompanySelectorProps {
  value: string | null; // companyId
  onChange: (companyId: string, companyName: string) => void;
  error?: string;
}

// Mock company list for now (replace with API call later)
const MOCK_COMPANIES = [
  { id: "comp_1", name: "TechCorp Inc.", logo: "🏢" },
  { id: "comp_2", name: "Global Solutions", logo: "🌍" },
  { id: "comp_3", name: "Innovative Systems", logo: "💡" },
  { id: "comp_4", name: "Future Works", logo: "🚀" },
];

export default function CompanySelector({
  value,
  onChange,
  error,
}: CompanySelectorProps) {
  return (
    <div className="form-group">
      <label className="form-label" htmlFor="company-select">
        Select Company *
      </label>
      <select
        className={`form-control ${error ? "is-invalid" : ""}`}
        id="company-select"
        value={value || ""}
        onChange={(e) => {
          const selectedId = e.target.value;
          const selectedCompany = MOCK_COMPANIES.find((c) => c.id === selectedId);
          if (selectedCompany) {
            onChange(selectedId, selectedCompany.name);
          } else {
            onChange("", "");
          }
        }}
        required
      >
        <option value="" disabled>
          Select your company...
        </option>
        {MOCK_COMPANIES.map((company) => (
          <option key={company.id} value={company.id}>
            {company.logo} {company.name}
          </option>
        ))}
      </select>
      <small className="text-muted">
        Select the company you work for. You will need approval from the company&apos;s HR Manager.
      </small>
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  );
}
