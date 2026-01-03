"use client";

import { useEffect, useState } from 'react';
import { getSystemStats } from '@/lib/applicationApi';
import SystemMetricsCards from '@/components/application/control/SystemMetricsCards';
import TopCompaniesWidget from '@/components/application/control/TopCompaniesWidget';
import TopJobsWidget from '@/components/application/control/TopJobsWidget';
import StatusDistributionChart from '@/components/application/control/StatusDistributionChart';
import type { SystemStats } from '@/types/application/application';

export default function SystemStatsPage() {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await getSystemStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch system stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="box-content">
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="box-content">
      <div className="box-heading">
        <div className="box-title">
          <h3 className="mb-35">System Statistics</h3>
        </div>
      </div>

      {/* Platform Totals */}
      <SystemMetricsCards platformTotals={stats.platformTotals} />

      {/* Growth Metrics */}
      <div className="row mt-4">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5>Growth Metrics</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6 mb-3">
                  <div className="text-muted">Last 7 Days</div>
                  <h4>{stats.growthMetrics.last7Days}</h4>
                </div>
                <div className="col-6 mb-3">
                  <div className="text-muted">Last 30 Days</div>
                  <h4>{stats.growthMetrics.last30Days}</h4>
                </div>
                <div className="col-6 mb-3">
                  <div className="text-muted">Month over Month</div>
                  <h4 className={stats.growthMetrics.monthOverMonth >= 0 ? 'text-success' : 'text-danger'}>
                    {stats.growthMetrics.monthOverMonth >= 0 ? '+' : ''}
                    {stats.growthMetrics.monthOverMonth.toFixed(1)}%
                  </h4>
                </div>
                <div className="col-6 mb-3">
                  <div className="text-muted">Year over Year</div>
                  <h4 className={stats.growthMetrics.yearOverYear >= 0 ? 'text-success' : 'text-danger'}>
                    {stats.growthMetrics.yearOverYear >= 0 ? '+' : ''}
                    {stats.growthMetrics.yearOverYear.toFixed(1)}%
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5>Status Distribution</h5>
            </div>
            <div className="card-body">
              <StatusDistributionChart statusDistribution={stats.statusDistribution} />
            </div>
          </div>
        </div>
      </div>

      {/* Top Companies and Jobs */}
      <div className="row mt-4">
        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5>Top Companies</h5>
            </div>
            <div className="card-body">
              <TopCompaniesWidget topCompanies={stats.topCompanies} />
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card">
            <div className="card-header">
              <h5>Top Jobs</h5>
            </div>
            <div className="card-body">
              <TopJobsWidget topJobs={stats.topJobs} />
            </div>
          </div>
        </div>
      </div>

      {/* Average Time to Hire */}
      <div className="row mt-4">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body text-center">
              <h6 className="text-muted mb-2">Platform Average Time to Hire</h6>
              <h2 className="mb-0">{stats.averageTimeToHire.toFixed(1)} days</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
