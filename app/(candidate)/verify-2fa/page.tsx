"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import FormButton from "@/components/auth/FormButton";
import FormError from "@/components/auth/FormError";
import { Suspense } from "react";

function Verify2FAContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tempToken = searchParams.get("tempToken");

    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [method, setMethod] = useState<string>("TOTP"); // TOTP or EMAIL
    const [useBackupCode, setUseBackupCode] = useState(false);

    useEffect(() => {
        // Check if tempToken exists
        if (!tempToken) {
            router.replace("/signin");
        }

        // Try to get method from query params
        const methodParam = searchParams.get("method");
        if (methodParam) {
            setMethod(methodParam);
        }
    }, [tempToken, router, searchParams]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const expectedLength = useBackupCode ? 8 : 6;
        if (!code || code.length !== expectedLength) {
            setError(useBackupCode ? "Vui lòng nhập mã khôi phục 8 chữ số" : "Vui lòng nhập mã 6 chữ số");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const AUTH_API_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL || "http://localhost:9085/auth";

            const response = await fetch(`${AUTH_API_URL}/verify-2fa-login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    tempToken,
                    code,
                    useBackupCode,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Xác thực không thành công");
            }

            // Store access token
            if (data.data?.accessToken) {
                localStorage.setItem("accessToken", data.data.accessToken);
            }

            // Redirect based on role
            const roles = data.data?.roles || [];
            if (roles.includes("ADMIN")) {
                router.replace("/admin");
            } else if (roles.includes("HR")) {
                router.replace("/hr/applications");
            } else {
                router.replace("/");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const maxLength = useBackupCode ? 8 : 6;
        const value = e.target.value.replace(/\D/g, "").slice(0, maxLength);
        setCode(value);
    };

    const handleResendCode = async () => {
        if (method !== "EMAIL") return;

        setIsLoading(true);
        setError(null);

        try {
            // TODO: Implement resend email code endpoint
            alert("Mã mới đã được gửi tới email của bạn");
        } catch (err) {
            setError("Không thể gửi lại mã");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title={useBackupCode ? "Nhập mã khôi phục" : "Xác thực hai yếu tố"}
            subtitle={
                useBackupCode
                    ? "Nhập một trong các mã khôi phục 8 chữ số của bạn"
                    : method === "TOTP"
                        ? "Nhập mã 6 chữ số từ ứng dụng authenticator của bạn"
                        : "Nhập mã 6 chữ số đã được gửi tới email của bạn"
            }
        >
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-4">
                    <label htmlFor="code" className="form-label">
                        {useBackupCode ? "Mã khôi phục" : "Mã xác thực"}
                    </label>
                    <input
                        type="text"
                        id="code"
                        className="form-control form-control-lg text-center"
                        placeholder={useBackupCode ? "00000000" : "000000"}
                        value={code}
                        onChange={handleCodeChange}
                        maxLength={useBackupCode ? 8 : 6}
                        autoFocus
                        disabled={isLoading}
                        style={{
                            fontSize: "2rem",
                            letterSpacing: "0.5rem",
                            fontWeight: "bold",
                        }}
                    />
                    <div className="form-text text-center mt-2">
                        {useBackupCode
                            ? "Mã khôi phục chỉ sử dụng được một lần"
                            : method === "TOTP"
                                ? "Mã sẽ thay đổi sau mỗi 30 giây"
                                : "Mã có hiệu lực trong 10 phút"}
                    </div>
                </div>

                {error && <FormError error={error} />}

                <FormButton
                    type="submit"
                    disabled={isLoading || code.length !== (useBackupCode ? 8 : 6)}
                    loading={isLoading}
                    loadingText="Đang xác thực..."
                >
                    Xác thực
                </FormButton>

                {method === "EMAIL" && !useBackupCode && (
                    <div className="text-center mt-3">
                        <button
                            type="button"
                            className="btn btn-link"
                            onClick={handleResendCode}
                            disabled={isLoading}
                        >
                            Gửi lại mã
                        </button>
                    </div>
                )}

                <div className="text-center mt-3">
                    <button
                        type="button"
                        className="btn btn-link text-warning"
                        onClick={() => {
                            setUseBackupCode(!useBackupCode);
                            setCode("");
                            setError(null);
                        }}
                        disabled={isLoading}
                    >
                        <i className="fi fi-rr-key me-2"></i>
                        {useBackupCode ? "Sử dụng mã xác thực thông thường" : "Sử dụng mã khôi phục"}
                    </button>
                </div>

                <div className="text-center mt-3">
                    <button
                        type="button"
                        className="btn btn-link"
                        onClick={() => router.push("/signin")}
                        disabled={isLoading}
                    >
                        <i className="fi fi-rr-arrow-left me-2"></i>
                        Quay lại đăng nhập
                    </button>
                </div>
            </form>

            <div className="alert alert-info mt-4">
                <i className="fi fi-rr-info me-2"></i>
                <strong>Mất quyền truy cập?</strong>
                <p className="mb-0 mt-2">
                    {useBackupCode
                        ? "Mỗi mã khôi phục chỉ có thể sử dụng một lần. Sau khi đăng nhập, hãy tạo mã khôi phục mới."
                        : method === "TOTP"
                            ? "Nếu bạn mất quyền truy cập vào ứng dụng authenticator, hãy sử dụng mã khôi phục dự phòng."
                            : "Kiểm tra hộp thư spam/junk nếu bạn không nhận được email."}
                </p>
            </div>
        </AuthLayout>
    );
}

export default function Verify2FAPage() {
    return (
        <Suspense
            fallback={
                <AuthLayout title="Đang tải..." subtitle="Vui lòng đợi">
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                </AuthLayout>
            }
        >
            <Verify2FAContent />
        </Suspense>
    );
}
