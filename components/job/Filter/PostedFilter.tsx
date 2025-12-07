import React from "react";

export default function PostedFilter() {
  const posted = [
    { name: "All", count: 78, checked: true },
    { name: "1 day", count: 65 },
    { name: "7 days", count: 24 },
    { name: "30 days", count: 56 },
  ];

  return (
    <div className="filter-block mb-30">
      <h5 className="medium-heading mb-10">Job Posted</h5>
      <div className="form-group">
        <ul className="list-checkbox">
          {posted.map((item, idx) => (
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
