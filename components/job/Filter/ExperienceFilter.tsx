import React from "react";

export default function ExperienceFilter() {
  const levels = [
    { name: "Internship", count: 56 },
    { name: "Entry Level", count: 87 },
    { name: "Associate", count: 24, checked: true },
    { name: "Mid Level", count: 45 },
    { name: "Director", count: 76 },
    { name: "Executive", count: 89 },
  ];

  return (
    <div className="filter-block mb-30">
      <h5 className="medium-heading mb-10">Experience Level</h5>
      <div className="form-group">
        <ul className="list-checkbox">
          {levels.map((item, idx) => (
            <li key={idx}>
              <label className="cb-container">
                <input type="checkbox" defaultChecked={item.checked || false} />
                <span className="text-small">{item.name}</span>
                <span className="checkmark" />
              </label>
              <span className="number-item">{item.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
