import JobDetailsClient from "@/components/job/JobDetails/JobDetailsClient";

interface Props {
  params: { postId: string };
}

export default async function JobDetailsWrapper({ params }: Props) {
  const { postId } = await params;

  return <JobDetailsClient postId={postId} />;
}
