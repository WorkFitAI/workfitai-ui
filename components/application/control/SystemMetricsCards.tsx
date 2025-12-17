"use client";

interface SystemMetricsCardsProps {
  platformTotals: {
    totalApplications: number;
    totalCompanies: number;
    totalJobs: number;
    totalCandidates: number;
  };
}

const SystemMetricsCards = ({ platformTotals }: SystemMetricsCardsProps) => {
  const metrics = [
    {
      label: 'Total Applications',
      value: platformTotals.totalApplications,
      icon: 'fi-rr-document',
      color: 'primary'
    },
    {
      label: 'Total Companies',
      value: platformTotals.totalCompanies,
      icon: 'fi-rr-briefcase',
      color: 'success'
    },
    {
      label: 'Total Jobs',
      value: platformTotals.totalJobs,
      icon: 'fi-rr-list',
      color: 'info'
    },
    {
      label: 'Total Candidates',
      value: platformTotals.totalCandidates,
      icon: 'fi-rr-users',
      color: 'warning'
    }
  ];

  return (
    <div className="row">
      {metrics.map((metric, index) => (
        <div key={index} className="col-lg-3 col-md-6">
          <div className="card card-style-1">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h6 className="text-muted mb-2">{metric.label}</h6>
                  <h2 className="mb-0">{metric.value.toLocaleString()}</h2>
                </div>
                <div className={`icon-box bg-${metric.color}-light`}>
                  <i className={`fi ${metric.icon} text-${metric.color} display-6`}></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SystemMetricsCards;
