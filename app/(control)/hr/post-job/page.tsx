"use client";

import { PostJobData } from "@/types/job/job";
import { postJob } from "@/lib/jobApi";
import PostJob from "@/components/job/CreateJobDashboard/post-job";
import { useToast } from "@/components/application/common/Toast";

export default function CreateJobPage() {
  const { showToast } = useToast();

  const handleCreateJob = async (data: PostJobData) => {
    try {
      console.log("Submitting job data:", data);
      await postJob("/hr/jobs", { body: data });
      showToast({
        type: "success",
        title: "Job posted successfully!",
        duration: 10000,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToast({
        type: "error",
        title: "Failed to post job. Please try again.",
        duration: 10000,
      });
    }
  };

  return <PostJob onSubmit={handleCreateJob} />;
}
