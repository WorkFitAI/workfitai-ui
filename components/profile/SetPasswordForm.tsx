"use client";

import React, { useState } from "react";
import { setPassword } from "@/lib/oauthApi";
import { showToast } from "@/lib/toast";

interface SetPasswordFormProps {
    onSuccess?: () => void;
}

export default function SetPasswordForm({ onSuccess }: SetPasswordFormProps) {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ newPassword?: string; confirmPassword?: string }>({});

    const validatePassword = (password: string): string | null => {
        if (password.length < 8) {
            return "Password must be at least 8 characters long";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter";
        }
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter";
        }
        if (!/[0-9]/.test(password)) {
            return "Password must contain at least one number";
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            return "Password must contain at least one special character";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Validate password
        const passwordError = validatePassword(newPassword);
        if (passwordError) {
            setErrors({ newPassword: passwordError });
            return;
        }

        // Check passwords match
        if (newPassword !== confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match" });
            return;
        }

        setLoading(true);
        try {
            const response = await setPassword(newPassword);
            showToast.success(response.message || "Password set successfully!");
            setNewPassword("");
            setConfirmPassword("");
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to set password";
            showToast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="set-password-section">
            <h3 className="mb-3">Set Password</h3>
            <p className="text-muted mb-4">
                Add password authentication to your account. This allows you to sign in with username and password
                in addition to social login.
            </p>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                        New Password <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={loading}
                            placeholder="Enter new password"
                        />
                        <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                        >
                            <i className={`fi-rr-${showPassword ? "eye-crossed" : "eye"}`}></i>
                        </button>
                        {errors.newPassword && (
                            <div className="invalid-feedback">{errors.newPassword}</div>
                        )}
                    </div>
                    <div className="form-text">
                        Password must be at least 8 characters and include uppercase, lowercase, number, and special character.
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password <span className="text-danger">*</span>
                    </label>
                    <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                        placeholder="Confirm new password"
                    />
                    {errors.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                    )}
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || !newPassword || !confirmPassword}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Setting Password...
                        </>
                    ) : (
                        <>
                            <i className="fi-rr-lock me-2"></i>
                            Set Password
                        </>
                    )}
                </button>
            </form>

            <style jsx>{`
        .set-password-section {
          background: #fff9f0;
          border-radius: 8px;
          padding: 24px;
          border-left: 4px solid #ff9800;
          margin-top: 24px;
        }

        .form-label {
          font-weight: 500;
          margin-bottom: 8px;
        }

        .form-control {
          border-radius: 6px;
        }

        .form-control:focus {
          border-color: #3c65f5;
          box-shadow: 0 0 0 0.2rem rgba(60, 101, 245, 0.25);
        }

        .input-group .btn {
          border-left: 0;
        }

        .btn-primary {
          background-color: #3c65f5;
          border-color: #3c65f5;
        }

        .btn-primary:hover {
          background-color: #2d4ec7;
          border-color: #2d4ec7;
        }
      `}</style>
        </div>
    );
}
