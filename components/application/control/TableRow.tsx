"use client";

import React from "react";
import type { Application } from "@/types/application/application";
import StatusBadge from "@/components/application/StatusBadge";
import TableActions from "./TableActions";
import type { Column } from "./TableHeader";

interface TableRowProps {
  application: Application;
  columns: Column[];
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onRowAction?: (action: string, applicationId: string) => void;
  onStatusUpdated?: () => void;
  hrList?: string[];
}

const TableRow = ({
  application,
  columns,
  selected,
  onRowAction,
  onStatusUpdated,
  hrList = [],
}: TableRowProps): React.ReactElement => {
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name: string): string => {
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const renderCellContent = (column: Column): React.ReactNode => {
    if (column.render) {
      return column.render(application);
    }

    switch (column.id) {
      case "candidate":
        return (
          <div className="candidate-info">
            <div className="candidate-avatar">
              {getInitials(application.username)}
            </div>
            <div className="candidate-details">
              <span className="candidate-name">{application.username}</span>
              <span className="candidate-email">{application.email}</span>
            </div>
          </div>
        );

      case "job":
        return (
          <div className="job-info">
            <span className="job-title">{application.jobSnapshot.title}</span>
            <span className="job-company">
              {application.jobSnapshot.companyName}
            </span>
          </div>
        );

      case "status":
        return <StatusBadge status={application.status} />;

      case "submittedAt":
        return (
          <span className="date-cell">
            {formatDate(application.submittedAt || application.createdAt)}
          </span>
        );

      case "assignedTo":
        return (
          application.assignedTo || (
            <span style={{ color: "#a0abb8", fontStyle: "italic" }}>
              Unassigned
            </span>
          )
        );

      case "actions":
        return (
          <TableActions
            application={application}
            onAction={onRowAction}
            onStatusUpdated={onStatusUpdated}
            hrList={hrList}
          />
        );

      default:
        return null;
    }
  };

  return (
    <tr className={selected ? "selected" : ""}>
      {columns.map((column) => (
        <td key={column.id} className={column.align ? column.align : ""}>
          {renderCellContent(column)}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
