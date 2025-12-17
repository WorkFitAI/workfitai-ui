"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useAppSelector } from '@/redux/hooks';
import { getManagerStats } from '@/lib/applicationApi';
import StatusBreakdownChart from '@/components/application/control/Analytics/StatusBreakdownChart';
import TeamPerformanceWidget from '@/components/application/control/Analytics/TeamPerformanceWidget';
import TopJobsWidget from '@/components/application/control/Analytics/TopJobsWidget';
import ExportButton from '@/components/application/control/Analytics/ExportButton';
import type { ManagerStats } from '@/types/application/application';

export default function ApplicationAnalyticsPage(): React.ReactElement {
  const { user } = useAppSelector(state => state.auth);
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [loading, setLoading] = useState(false);

  const companyId = user?.companyId || '';

  const fetchStats = useCallback(async (): Promise<void> => {
    if (!companyId) return;

    setLoading(true);
    try {
      const data = await getManagerStats(companyId);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading || !stats) {
    return (
      <>
        <div className="col-lg-12">
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="col-lg-12">
        <div className="section-box">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>Application Analytics</h3>
              <ExportButton
                filters={{
                  companyId
                }}
              />
            </div>

            {/* Metrics Cards */}
            <div className="row mb-4">
              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h6 className="text-muted">Total Applications</h6>
                    <h2 className="mb-0">{stats.totalApplications}</h2>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h6 className="text-muted">This Month</h6>
                    <h2 className="mb-0">{stats.monthlyTrend.thisMonth}</h2>
                    <small className={stats.monthlyTrend.change >= 0 ? 'text-success' : 'text-danger'}>
                      {stats.monthlyTrend.change >= 0 ? '+' : ''}
                      {stats.monthlyTrend.change.toFixed(1)}% vs last month
                    </small>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h6 className="text-muted">In Review</h6>
                    <h2 className="mb-0">{stats.statusBreakdown.REVIEWING || 0}</h2>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h6 className="text-muted">Hired</h6>
                    <h2 className="mb-0">{stats.statusBreakdown.HIRED || 0}</h2>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="row mb-4">
              <div className="col-lg-6 mb-3">
                <div className="card">
                  <div className="card-header">
                    <h5>Application Status Distribution</h5>
                  </div>
                  <div className="card-body">
                    <StatusBreakdownChart
                      data={Object.entries(stats.statusBreakdown).map(([status, count]) => ({
                        status: status as import('@/types/application/application').ApplicationStatus,
                        count
                      }))}
                    />
                  </div>
                </div>
              </div>

              <div className="col-lg-6 mb-3">
                <div className="card">
                  <div className="card-header">
                    <h5>Team Performance</h5>
                  </div>
                  <div className="card-body">
                    <TeamPerformanceWidget members={stats.teamPerformance} />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Jobs */}
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-header">
                    <h5>Top Jobs by Applications</h5>
                  </div>
                  <div className="card-body">
                    <TopJobsWidget jobs={stats.topJobs} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
