"use client";

interface StatusDistributionChartProps {
  statusDistribution: Record<string, number>;
}

const StatusDistributionChart = ({ statusDistribution }: StatusDistributionChartProps) => {
  const total = Object.values(statusDistribution).reduce((sum, count) => sum + count, 0);

  if (total === 0) {
    return <p className="text-muted">No data available</p>;
  }

  const statusColors: Record<string, string> = {
    DRAFT: '#6c757d',
    APPLIED: '#0d6efd',
    REVIEWING: '#ffc107',
    INTERVIEW: '#0dcaf0',
    OFFER: '#198754',
    HIRED: '#20c997',
    REJECTED: '#dc3545',
    WITHDRAWN: '#adb5bd'
  };

  return (
    <div>
      {Object.entries(statusDistribution).map(([status, count]) => {
        const percentage = (count / total) * 100;
        const color = statusColors[status] || '#6c757d';

        return (
          <div key={status} className="mb-3">
            <div className="d-flex justify-content-between mb-1">
              <span>{status}</span>
              <span className="text-muted">
                {count.toLocaleString()} ({percentage.toFixed(1)}%)
              </span>
            </div>
            <div className="progress" style={{ height: '8px' }}>
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${percentage}%`, backgroundColor: color }}
                aria-valuenow={percentage}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatusDistributionChart;
