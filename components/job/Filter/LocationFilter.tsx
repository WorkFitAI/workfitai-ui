import React from "react";

export default function LocationFilter() {
  return (
    <div className="filter-block mb-30">
      <div className="form-group select-style select-style-icon">
        <select className="form-control form-icons select-active">
          <option>New York, US</option>
          <option>London</option>
          <option>Paris</option>
          <option>Berlin</option>
        </select>
        <i className="fi-rr-marker" />
      </div>
    </div>
  );
}
