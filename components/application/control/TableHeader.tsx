"use client";

import React from "react";
import type { Application } from "@/types/application/application";

export interface Column {
  id: string;
  label: string;
  sortable: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (application: Application) => React.ReactNode;
}

interface TableHeaderProps {
  columns: Column[];
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSort?: (field: string) => void;
  selectedCount: number;
  totalCount: number;
  onSelectAll: (checked: boolean) => void;
}

const TableHeader = ({
  columns,
  sortBy,
  sortOrder,
  onSort
}: TableHeaderProps): React.ReactElement => {

  const handleSort = (columnId: string): void => {
    if (onSort) {
      onSort(columnId);
    }
  };

  return (
    <thead>
      <tr>
        {columns.map((column) => {
          const isActiveSortColumn = sortBy === column.id;
          return (
            <th
              key={column.id}
              className={column.align || "left"}
              style={{
                width: column.width,
                position: "relative",
              }}
            >
              {column.sortable && onSort ? (
                <button
                  onClick={() => handleSort(column.id)}
                  aria-label={`Sort by ${column.label}`}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "8px 12px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: isActiveSortColumn ? "#3498DB" : "#495057",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    transition: "all 0.2s ease",
                    borderRadius: "6px",
                    width: "100%",
                    textAlign: "left",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#F8F9FA";
                    if (!isActiveSortColumn) {
                      e.currentTarget.style.color = "#2D3E50";
                    }
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    if (!isActiveSortColumn) {
                      e.currentTarget.style.color = "#495057";
                    }
                  }}
                >
                  <span>{column.label}</span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      fontSize: "16px",
                      marginLeft: "auto",
                      opacity: isActiveSortColumn ? 1 : 0.3,
                      transition: "opacity 0.2s ease",
                    }}
                  >
                    {isActiveSortColumn ? (
                      sortOrder === "asc" ? (
                        <i
                          className="fi fi-rr-arrow-small-up"
                          style={{ fontWeight: "bold" }}
                        ></i>
                      ) : (
                        <i
                          className="fi fi-rr-arrow-small-down"
                          style={{ fontWeight: "bold" }}
                        ></i>
                      )
                    ) : (
                      <i className="fi fi-rr-sort-alt"></i>
                    )}
                  </span>
                </button>
              ) : (
                <span
                  style={{
                    padding: "8px 12px",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "#495057",
                    display: "block",
                  }}
                >
                  {column.label}
                </span>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
