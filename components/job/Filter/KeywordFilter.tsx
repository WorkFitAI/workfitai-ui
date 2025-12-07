import React from "react";

export default function KeywordFilter() {
  const keywords = [
    { name: "Software", count: 24, checked: true },
    { name: "Developer", count: 45 },
    { name: "Web", count: 57 },
  ];

  return (
    <div className="filter-block mb-30">
      <h5 className="medium-heading mb-10">Popular Keyword</h5>
      <div className="form-group">
        <ul className="list-checkbox">
          {keywords.map((item, idx) => (
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
