"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postJobFormData } from "@/lib/jobApi";

interface BannerUploaderProps {
  jobId: string;
  initialUrl?: string;
}

export default function BannerUploader({
  jobId,
  initialUrl,
}: BannerUploaderProps) {
  const [preview, setPreview] = useState<string>(
    initialUrl || "/assets/imgs/page/job-single/thumb.png"
  );
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSave = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await postJobFormData<{
        bannerUrl: string;
      }>(`/public/hr/jobs/${jobId}/banner`, formData);

      if (res.data?.bannerUrl) {
        setPreview(res.data.bannerUrl);
      }

      setFile(null);
      toast.success("Banner updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-3 text-center">
      <div className="mb-3">
        <Image
          src={preview}
          alt="Job banner preview"
          width={500}
          height={400}
          unoptimized
          className="img-thumbnail"
        />
      </div>

      <div className="d-flex justify-content-start gap-2 mb-3">
        {/* Choose File Button */}
        <label className="btn btn-outline-secondary mb-0">
          Choose File
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="d-none"
          />
        </label>

        {/* Save Banner Button - only show if file has a name */}
        {file?.name && (
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn text-white"
            style={{ backgroundColor: "#3c65f5", borderColor: "#3c65f5" }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Saving...
              </>
            ) : (
              "Save Banner"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
