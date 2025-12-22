import CompanyDetailsClient from "@/components/job/CompanyDetails/CompanyDetailsClient";

interface Props {
  params: { companyNo: string };
}

export default async function CompanyDetailsWrapper({ params }: Props) {
  const { companyNo } = await params;

  return <CompanyDetailsClient companyNo={companyNo} />;
}
