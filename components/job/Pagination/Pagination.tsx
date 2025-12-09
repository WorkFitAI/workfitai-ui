"use client";
import React, { useMemo } from "react";
import "./scss/pagination.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  console.log(
    "Pagination - currentPage:",
    currentPage,
    "totalPages:",
    totalPages
  );
  const pageLinks = useMemo(() => {
    const maxVisiblePages = 7;
    const siblingCount = 1;
    let pages: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const left = Math.max(2, currentPage - siblingCount);
      const right = Math.min(totalPages - 1, currentPage + siblingCount);

      pages.push(1);
      if (left > 2) pages.push("...");
      for (let i = left; i <= right; i++) pages.push(i);
      if (right < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  return (
    <div className="mf-pagination">
      <ul className="mf-page-list">
        <li>
          <button
            className="mf-page-prev"
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          ></button>
        </li>

        {pageLinks.map((p, idx) =>
          p === "..." ? (
            <li key={`dots-${idx}`} className="mf-page-dots">
              ...
            </li>
          ) : (
            <li key={p}>
              <button
                className={`mf-page-number ${
                  p === currentPage ? "mf-active" : ""
                }`}
                onClick={() => onPageChange(p as number)}
              >
                {p}
              </button>
            </li>
          )
        )}

        <li>
          <button
            className="mf-page-next"
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            disabled={currentPage === totalPages}
          ></button>
        </li>
      </ul>
    </div>
  );
};

export default Pagination;
