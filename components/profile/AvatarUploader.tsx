"use client";

import React, { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    uploadAvatar,
    deleteAvatar,
    selectUploadingAvatar,
    selectProfileError,
} from "@/redux/features/profile/profileSlice";

interface AvatarUploaderProps {
    currentAvatar: string | null;
    onUploadSuccess?: () => void;
}

export default function AvatarUploader({
    currentAvatar,
    onUploadSuccess,
}: AvatarUploaderProps) {
    const dispatch = useAppDispatch();
    const uploadingAvatar = useAppSelector(selectUploadingAvatar);
    const error = useAppSelector(selectProfileError);

    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFileSelect(files[0]);
        }
    };

    const handleFileSelect = (file: File) => {
        // Validate file type
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!validTypes.includes(file.type)) {
            alert("Please upload a valid image file (JPG, PNG, or WEBP)");
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert("File size must not exceed 5MB");
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        handleUpload(file);
    };

    const handleUpload = async (file: File) => {
        try {
            setUploadProgress(0);

            // Simulate progress (since we don't have real progress from API)
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const result = await dispatch(uploadAvatar(file)).unwrap();

            clearInterval(progressInterval);
            setUploadProgress(100);

            setTimeout(() => {
                setPreview(null);
                setUploadProgress(0);
                if (onUploadSuccess) {
                    onUploadSuccess();
                }
            }, 1000);
        } catch (error) {
            console.error("Upload failed:", error);
            setPreview(null);
            setUploadProgress(0);
        }
    };

    const handleDeleteAvatar = async () => {
        if (!confirm("Are you sure you want to delete your avatar?")) {
            return;
        }

        try {
            await dispatch(deleteAvatar()).unwrap();
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    const handleClickUpload = () => {
        fileInputRef.current?.click();
    };

    const displayAvatar = preview || currentAvatar || "/assets/imgs/avatar/ava_1.png";

    return (
        <div className="avatar-uploader-container">
            {/* Avatar Display */}
            <div className="avatar-display">
                <div className="avatar-wrapper">
                    <img src={displayAvatar} alt="Profile Avatar" className="avatar-image" />
                    {uploadingAvatar && (
                        <div className="upload-overlay">
                            <div className="upload-progress">
                                <div
                                    className="upload-progress-bar"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <span className="upload-text">{uploadProgress}%</span>
                        </div>
                    )}
                </div>

                <div className="avatar-actions">
                    <button
                        type="button"
                        onClick={handleClickUpload}
                        disabled={uploadingAvatar}
                        className="btn btn-sm btn-brand-1"
                    >
                        <i className="fi-rr-upload"></i> Upload New
                    </button>

                    {currentAvatar && (
                        <button
                            type="button"
                            onClick={handleDeleteAvatar}
                            disabled={uploadingAvatar}
                            className="btn btn-sm btn-border"
                        >
                            <i className="fi-rr-trash"></i> Delete
                        </button>
                    )}
                </div>
            </div>

            {/* Drag & Drop Zone */}
            <div
                className={`avatar-upload-zone ${isDragging ? "dragging" : ""}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleClickUpload}
            >
                <div className="upload-zone-content">
                    <i className="fi-rr-cloud-upload upload-icon"></i>
                    <h6>Drag & drop or click to upload</h6>
                    <p className="text-muted">JPG, PNG or WEBP (max 5MB)</p>
                    <p className="text-muted">Recommended: 400x400px</p>
                </div>
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileInputChange}
                style={{ display: "none" }}
            />

            {/* Error Message */}
            {error && (
                <div className="alert alert-danger mt-3">
                    <i className="fi-rr-exclamation"></i> {error}
                </div>
            )}
        </div>
    );
}
