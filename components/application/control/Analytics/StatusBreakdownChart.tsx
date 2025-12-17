"use client";

import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { ApplicationStatus } from '@/types/application/application';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StatusBreakdown {
  status: ApplicationStatus;
  count: number;
}

interface StatusBreakdownChartProps {
  data: StatusBreakdown[];
}

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.DRAFT]: '#95A5A6',
  [ApplicationStatus.APPLIED]: '#3498DB',
  [ApplicationStatus.REVIEWING]: '#F39C12',
  [ApplicationStatus.INTERVIEW]: '#9B59B6',
  [ApplicationStatus.OFFER]: '#2ECC71',
  [ApplicationStatus.HIRED]: '#27AE60',
  [ApplicationStatus.REJECTED]: '#E74C3C',
  [ApplicationStatus.WITHDRAWN]: '#7F8C8D',
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  [ApplicationStatus.DRAFT]: 'Draft',
  [ApplicationStatus.APPLIED]: 'Applied',
  [ApplicationStatus.REVIEWING]: 'Reviewing',
  [ApplicationStatus.INTERVIEW]: 'Interview',
  [ApplicationStatus.OFFER]: 'Offer',
  [ApplicationStatus.HIRED]: 'Hired',
  [ApplicationStatus.REJECTED]: 'Rejected',
  [ApplicationStatus.WITHDRAWN]: 'Withdrawn',
};

export default function StatusBreakdownChart({ data }: StatusBreakdownChartProps): React.ReactElement {
  const chartData = {
    labels: data.map(item => STATUS_LABELS[item.status]),
    datasets: [
      {
        label: 'Applications',
        data: data.map(item => item.count),
        backgroundColor: data.map(item => STATUS_COLORS[item.status]),
        borderColor: data.map(item => STATUS_COLORS[item.status]),
        borderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: '#2D3E50',
        titleFont: {
          size: 14,
          family: 'Inter, sans-serif',
        },
        bodyFont: {
          size: 13,
          family: 'Inter, sans-serif',
        },
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0) as number;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      },
    },
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Pie data={chartData} options={options} />
    </div>
  );
}
