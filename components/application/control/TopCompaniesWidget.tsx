"use client";

interface TopCompaniesWidgetProps {
  topCompanies: Array<{
    companyId: string;
    companyName: string;
    applicationCount: number;
  }>;
}

const TopCompaniesWidget = ({ topCompanies }: TopCompaniesWidgetProps) => {
  if (topCompanies.length === 0) {
    return <p className="text-muted">No company data available</p>;
  }

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Company</th>
            <th>Applications</th>
          </tr>
        </thead>
        <tbody>
          {topCompanies.map((company, index) => (
            <tr key={company.companyId}>
              <td>
                <span className="badge bg-primary">{index + 1}</span>
              </td>
              <td>{company.companyName}</td>
              <td>
                <strong>{company.applicationCount.toLocaleString()}</strong>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TopCompaniesWidget;
