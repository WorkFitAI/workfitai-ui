"use client";

import React from 'react';
import { ApplicationStatus } from '@/types/application/application';

interface StatusBreakdown {
  status: ApplicationStatus;
  count: number;
}

interface StatusFunnelChartProps {
  data: StatusBreakdown[];
}

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

// Funnel flow: APPLIED → REVIEWING → INTERVIEW → OFFER → HIRED
const FUNNEL_ORDER: ApplicationStatus[] = [
  ApplicationStatus.APPLIED,
  ApplicationStatus.REVIEWING,
  ApplicationStatus.INTERVIEW,
  ApplicationStatus.OFFER,
  ApplicationStatus.HIRED
];

export default function StatusFunnelChart({ data }: StatusFunnelChartProps): React.ReactElement {
  // Filter and order data for funnel
  const funnelData = FUNNEL_ORDER.map(status => {
    const item = data.find(d => d.status === status);
    return {
      status,
      count: item?.count || 0,
      label: STATUS_LABELS[status],
      color: STATUS_COLORS[status]
    };
  }).filter(item => item.count > 0);

  const maxCount = Math.max(...funnelData.map(item => item.count), 1);

  const getConversionRate = (currentIndex: number) => {
    if (currentIndex === 0) return 100;
    const currentCount = funnelData[currentIndex].count;
    const previousCount = funnelData[currentIndex - 1].count;
    if (previousCount === 0) return 0;
    return Math.round((currentCount / previousCount) * 100);
  };

  return (
    <div className="status-funnel-chart">
      <div className="funnel-container">
        {funnelData.map((item, index) => {
          const widthPercentage = (item.count / maxCount) * 100;
          const conversionRate = getConversionRate(index);

          return (
            <div key={item.status} className="funnel-stage">
              <div className="stage-label">
                <span className="stage-name">{item.label}</span>
                {index > 0 && (
                  <span className="conversion-rate">{conversionRate}%</span>
                )}
              </div>
              <div
                className="stage-bar"
                style={{
                  width: `${widthPercentage}%`,
                  backgroundColor: item.color
                }}
              >
                <span className="stage-count">{item.count}</span>
              </div>
            </div>
          );
        })}
      </div>

      {funnelData.length === 0 && (
        <div className="empty-state">
          <p>No data available for funnel chart</p>
        </div>
      )}

      <style jsx>{`
        .status-funnel-chart {
          background: white;
          border-radius: 8px;
          padding: 0;
        }

        .funnel-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .funnel-stage {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stage-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          font-weight: 600;
          color: #2D3E50;
        }

        .stage-name {
          flex: 1;
        }

        .conversion-rate {
          font-size: 12px;
          color: #6C757D;
          padding: 2px 8px;
          background: #F8F9FA;
          border-radius: 4px;
        }

        .stage-bar {
          height: 48px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 16px;
          min-width: 80px;
          transition: all 0.3s ease;
          position: relative;
        }

        .stage-bar:hover {
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

        .stage-count {
          color: white;
          font-weight: 700;
          font-size: 16px;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .empty-state {
          text-align: center;
          padding: 40px 20px;
          color: #6C757D;
        }

        @media (max-width: 768px) {
          .stage-bar {
            height: 40px;
          }

          .stage-count {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
}
