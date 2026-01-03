"use client";

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { ApplicationStatus } from '@/types/application/application';

interface StatusBreakdownChartProps {
  statusBreakdown: Record<ApplicationStatus, number>;
}

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  DRAFT: '#6c757d',
  APPLIED: '#0d6efd',
  REVIEWING: '#ffc107',
  INTERVIEW: '#17a2b8',
  OFFER: '#28a745',
  HIRED: '#155724',
  REJECTED: '#dc3545',
  WITHDRAWN: '#adb5bd'
};

const StatusBreakdownChart = ({ statusBreakdown }: StatusBreakdownChartProps): React.ReactElement => {
  const data = {
    labels: Object.keys(statusBreakdown).map(status =>
      status.charAt(0) + status.slice(1).toLowerCase()
    ),
    datasets: [
      {
        data: Object.values(statusBreakdown),
        backgroundColor: Object.keys(statusBreakdown).map(
          status => STATUS_COLORS[status as ApplicationStatus]
        ),
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const
      },
      tooltip: {
        callbacks: {
          label: (context: { label?: string; parsed: number; dataset: { data: number[] } }) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default StatusBreakdownChart;
