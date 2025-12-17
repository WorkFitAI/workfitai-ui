"use client";

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    changePassword,
    selectProfileError,
} from "@/redux/features/profile/profileSlice";

export default function ChangePasswordForm() {
    const dispatch = useAppDispatch();
    const error = useAppSelector(selectProfileError);

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    // Password validation
    const validatePassword = (password: string) => {
        const requirements = {
            length: password.length >= 8 && password.length <= 20,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            digit: /\d/.test(password),
            special: /[@$!%*?&]/.test(password),
        };

        return requirements;
    };

    const getPasswordStrength = (password: string) => {
        const reqs = validatePassword(password);
        const score = Object.values(reqs).filter(Boolean).length;

        if (score === 5) return { label: "Strong", color: "success", width: 100 };
        if (score >= 3) return { label: "Medium", color: "warning", width: 60 };
        return { label: "Weak", color: "danger", width: 30 };
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate
        const newErrors: Record<string, string> = {};

        if (!formData.currentPassword) {
            newErrors.currentPassword = "Current password is required";
        }

        if (!formData.newPassword) {
            newErrors.newPassword = "New password is required";
        } else {
            const reqs = validatePassword(formData.newPassword);
            if (!Object.values(reqs).every(Boolean)) {
                newErrors.newPassword = "Password does not meet all requirements";
            }
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your new password";
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Submit
        setLoading(true);
        try {
            await dispatch(changePassword(formData)).unwrap();
            setSuccess(true);
            setFormData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            console.error("Failed to change password:", err);
        } finally {
            setLoading(false);
        }
    };

    const passwordReqs = formData.newPassword ? validatePassword(formData.newPassword) : null;
    const passwordStrength = formData.newPassword ? getPasswordStrength(formData.newPassword) : null;

    return (
        <form onSubmit={handleSubmit} className="change-password-form">
            {success && (
                <div className="alert alert-success">
                    <i className="fi-rr-check-circle"></i> Password changed successfully! All other sessions have been logged out.
                </div>
            )}

            {error && (
                <div className="alert alert-danger">
                    <i className="fi-rr-exclamation"></i> {error}
                </div>
            )}

            {/* Current Password */}
            <div className="form-group">
                <label htmlFor="currentPassword" className="form-label">
                    Current Password *
                </label>
                <div className="password-input-wrapper">
                    <input
                        type={showPassword.current ? "text" : "password"}
                        id="currentPassword"
                        name="currentPassword"
                        className={`form-control ${errors.currentPassword ? "is-invalid" : ""}`}
                        value={formData.currentPassword}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword((prev) => ({ ...prev, current: !prev.current }))}
                    >
                        <i className={showPassword.current ? "fi-rr-eye-crossed" : "fi-rr-eye"}></i>
                    </button>
                </div>
                {errors.currentPassword && (
                    <div className="invalid-feedback d-block">{errors.currentPassword}</div>
                )}
            </div>

            {/* New Password */}
            <div className="form-group">
                <label htmlFor="newPassword" className="form-label">
                    New Password *
                </label>
                <div className="password-input-wrapper">
                    <input
                        type={showPassword.new ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        className={`form-control ${errors.newPassword ? "is-invalid" : ""}`}
                        value={formData.newPassword}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword((prev) => ({ ...prev, new: !prev.new }))}
                    >
                        <i className={showPassword.new ? "fi-rr-eye-crossed" : "fi-rr-eye"}></i>
                    </button>
                </div>
                {errors.newPassword && (
                    <div className="invalid-feedback d-block">{errors.newPassword}</div>
                )}

                {/* Password Strength */}
                {passwordStrength && (
                    <div className="password-strength mt-2">
                        <div className="password-strength-bar">
                            <div
                                className={`password-strength-fill bg-${passwordStrength.color}`}
                                style={{ width: `${passwordStrength.width}%` }}
                            />
                        </div>
                        <span className={`password-strength-label text-${passwordStrength.color}`}>
                            {passwordStrength.label}
                        </span>
                    </div>
                )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                    Confirm New Password *
                </label>
                <div className="password-input-wrapper">
                    <input
                        type={showPassword.confirm ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
                    >
                        <i className={showPassword.confirm ? "fi-rr-eye-crossed" : "fi-rr-eye"}></i>
                    </button>
                </div>
                {errors.confirmPassword && (
                    <div className="invalid-feedback d-block">{errors.confirmPassword}</div>
                )}
            </div>

            {/* Password Requirements */}
            {passwordReqs && (
                <div className="password-requirements mt-3">
                    <h6>Password Requirements:</h6>
                    <ul className="requirements-list">
                        <li className={passwordReqs.length ? "valid" : ""}>
                            <i className={`fi-rr-${passwordReqs.length ? "check-circle" : "cross-circle"}`}></i>
                            8-20 characters
                        </li>
                        <li className={passwordReqs.uppercase ? "valid" : ""}>
                            <i className={`fi-rr-${passwordReqs.uppercase ? "check-circle" : "cross-circle"}`}></i>
                            At least 1 uppercase letter
                        </li>
                        <li className={passwordReqs.lowercase ? "valid" : ""}>
                            <i className={`fi-rr-${passwordReqs.lowercase ? "check-circle" : "cross-circle"}`}></i>
                            At least 1 lowercase letter
                        </li>
                        <li className={passwordReqs.digit ? "valid" : ""}>
                            <i className={`fi-rr-${passwordReqs.digit ? "check-circle" : "cross-circle"}`}></i>
                            At least 1 digit
                        </li>
                        <li className={passwordReqs.special ? "valid" : ""}>
                            <i className={`fi-rr-${passwordReqs.special ? "check-circle" : "cross-circle"}`}></i>
                            At least 1 special character (@$!%*?&)
                        </li>
                    </ul>
                </div>
            )}

            {/* Submit Button */}
            <div className="form-group mt-4">
                <button
                    type="submit"
                    className="btn btn-brand-1"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Changing Password...
                        </>
                    ) : (
                        <>
                            <i className="fi-rr-check"></i> Change Password
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
