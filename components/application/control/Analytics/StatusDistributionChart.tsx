"use client";

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { ApplicationStatus } from '@/types/application/application';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface StatusBreakdown {
  status: ApplicationStatus;
  count: number;
}

interface StatusDistributionChartProps {
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

export default function StatusDistributionChart({ data }: StatusDistributionChartProps): React.ReactElement {
  const chartData = {
    labels: data.map(item => STATUS_LABELS[item.status]),
    datasets: [
      {
        label: 'Number of Applications',
        data: data.map(item => item.count),
        backgroundColor: data.map(item => STATUS_COLORS[item.status]),
        borderColor: data.map(item => STATUS_COLORS[item.status]),
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#E9ECEF',
        },
        ticks: {
          stepSize: 5,
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
    },
  };

  return (
    <div style={{ height: '300px', position: 'relative' }}>
      <Bar data={chartData} options={options} />
    </div>
  );
}
