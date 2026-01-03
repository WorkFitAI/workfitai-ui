"use client";

import Pagination from "@/components/common/Pagination";

export interface CrudColumn<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
}

interface Props<T> {
  title: string;
  data: T[];
  columns: CrudColumn<T>[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function CrudTable<T>({
  title,
  data,
  columns,
  page,
  totalPages,
  onPageChange,
}: Props<T>) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="mb-3">{title}</h5>

        <table className="table table-hover align-middle">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.header}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render(item)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
