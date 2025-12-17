'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { enable2FA, disable2FA, regenerateBackupCodes } from '@/redux/features/profile/profileSlice';
import type { Enable2FAResponse } from '@/types/settings';

interface Enable2FAModalProps {
    show: boolean;
    onHide: () => void;
    currentlyEnabled: boolean;
}

type Step = 'setup' | 'verify' | 'backup-codes' | 'disable';

const Enable2FAModal: React.FC<Enable2FAModalProps> = ({ show, onHide, currentlyEnabled }) => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.profile);

    const [step, setStep] = useState<Step>('setup');
    const [verificationCode, setVerificationCode] = useState('');
    const [backupCodes, setBackupCodes] = useState<string[]>([]);
    const [codesCopied, setCodesCopied] = useState(false);
    const [showQRCode, setShowQRCode] = useState(true);
    const [twoFactorSetup, setTwoFactorSetup] = useState<Enable2FAResponse | null>(null);

    useEffect(() => {
        if (show) {
            if (currentlyEnabled) {
                setStep('disable');
            } else {
                setStep('setup');
                // Generate QR code when modal opens
                handleEnable2FA();
            }
            setVerificationCode('');
            setCodesCopied(false);
        }
    }, [show, currentlyEnabled]);

    const handleEnable2FA = async () => {
        const result = await dispatch(enable2FA({ method: 'TOTP' }));
        if (enable2FA.fulfilled.match(result)) {
            setTwoFactorSetup(result.payload);
            if (result.payload.backupCodes && result.payload.backupCodes.length > 0) {
                setBackupCodes(result.payload.backupCodes);
                setStep('backup-codes');
            }
        }
    };

    const handleVerify = async () => {
        if (verificationCode.length !== 6) {
            return;
        }

        // For now, just move to backup codes step
        // In real implementation, you would call verify API
        setStep('backup-codes');
    };

    const handleDisable2FA = async () => {
        // TODO: Get password from user input
        const result = await dispatch(disable2FA({ password: '', code: '' }));
        if (disable2FA.fulfilled.match(result)) {
            onHide();
        }
    };

    const handleCopyBackupCodes = () => {
        const codesText = backupCodes.join('\n');
        navigator.clipboard.writeText(codesText);
        setCodesCopied(true);
    };

    const handleDownloadBackupCodes = () => {
        const codesText = backupCodes.join('\n');
        const blob = new Blob([codesText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'workfitai-2fa-backup-codes.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleComplete = () => {
        setCodesCopied(false);
        setBackupCodes([]);
        onHide();
    };

    const handleGenerateNewBackupCodes = async () => {
        // TODO: Get password from user input
        const result = await dispatch(regenerateBackupCodes({ password: '' }));
        if (regenerateBackupCodes.fulfilled.match(result)) {
            setBackupCodes(result.payload.backupCodes);
        }
    };

    const renderSetupStep = () => (
        <>
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="fi fi-rr-shield-check me-2"></i>
                    Kích hoạt xác thực hai yếu tố (2FA)
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="enable-2fa-setup">
                    <div className="alert alert-info">
                        <i className="fi fi-rr-info me-2"></i>
                        <strong>Tăng cường bảo mật tài khoản</strong>
                        <p className="mb-0 mt-2">
                            Xác thực hai yếu tố (2FA) thêm một lớp bảo mật bổ sung cho tài khoản của bạn.
                            Ngoài mật khẩu, bạn sẽ cần nhập mã xác thực từ ứng dụng authenticator.
                        </p>
                    </div>

                    <div className="setup-instructions">
                        <h6 className="mb-3">Hướng dẫn thiết lập:</h6>

                        <div className="instruction-step mb-4">
                            <div className="step-number">1</div>
                            <div className="step-content">
                                <h6>Tải ứng dụng Authenticator</h6>
                                <p>Tải một trong các ứng dụng sau:</p>
                                <ul>
                                    <li>Google Authenticator (iOS / Android)</li>
                                    <li>Microsoft Authenticator (iOS / Android)</li>
                                    <li>Authy (iOS / Android / Desktop)</li>
                                </ul>
                            </div>
                        </div>

                        <div className="instruction-step mb-4">
                            <div className="step-number">2</div>
                            <div className="step-content">
                                <h6>Quét mã QR</h6>
                                <p>Mở ứng dụng và quét mã QR bên dưới:</p>

                                {loading ? (
                                    <div className="text-center py-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Đang tải...</span>
                                        </div>
                                    </div>
                                ) : twoFactorSetup?.qrCode ? (
                                    <div className="qr-code-container">
                                        {showQRCode ? (
                                            <img
                                                src={twoFactorSetup.qrCode}
                                                alt="2FA QR Code"
                                                className="qr-code-image"
                                            />
                                        ) : (
                                            <div className="qr-code-placeholder">
                                                <i className="fi fi-rr-qrcode"></i>
                                                <button
                                                    className="btn btn-sm btn-link"
                                                    onClick={() => setShowQRCode(true)}
                                                >
                                                    Hiển thị mã QR
                                                </button>
                                            </div>
                                        )}

                                        <div className="manual-entry mt-3">
                                            <p className="text-muted small mb-2">Hoặc nhập thủ công:</p>
                                            <div className="secret-key">
                                                <code>{twoFactorSetup.secret || ''}</code>
                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => {
                                                        if (twoFactorSetup?.secret) {
                                                            navigator.clipboard.writeText(twoFactorSetup.secret);
                                                        }
                                                    }}
                                                >
                                                    <i className="fi fi-rr-copy-alt"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        <div className="instruction-step">
                            <div className="step-number">3</div>
                            <div className="step-content">
                                <h6>Xác thực</h6>
                                <p>Nhấn nút bên dưới để chuyển sang bước xác thực mã.</p>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger mt-3">
                            <i className="fi fi-rr-cross-circle me-2"></i>
                            {error}
                        </div>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={onHide}>
                    Hủy
                </button>
                <button
                    className="btn btn-primary"
                    onClick={() => setStep('verify')}
                    disabled={!twoFactorSetup?.qrCode}
                >
                    Tiếp theo: Xác thực
                    <i className="fi fi-rr-arrow-right ms-2"></i>
                </button>
            </Modal.Footer>
        </>
    );

    const renderVerifyStep = () => (
        <>
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="fi fi-rr-shield-check me-2"></i>
                    Xác thực mã 2FA
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="enable-2fa-verify">
                    <div className="alert alert-info">
                        <i className="fi fi-rr-info me-2"></i>
                        Nhập mã 6 chữ số từ ứng dụng authenticator của bạn để xác thực.
                    </div>

                    <div className="verification-input-group">
                        <label className="form-label">Mã xác thực</label>
                        <input
                            type="text"
                            className="form-control form-control-lg text-center"
                            placeholder="000000"
                            value={verificationCode}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setVerificationCode(value);
                            }}
                            maxLength={6}
                            autoFocus
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && verificationCode.length === 6) {
                                    handleVerify();
                                }
                            }}
                        />
                        <div className="form-text">
                            Mã sẽ thay đổi sau mỗi 30 giây
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger mt-3">
                            <i className="fi fi-rr-cross-circle me-2"></i>
                            {error}
                        </div>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="btn btn-secondary"
                    onClick={() => setStep('setup')}
                    disabled={loading}
                >
                    <i className="fi fi-rr-arrow-left me-2"></i>
                    Quay lại
                </button>
                <button
                    className="btn btn-primary"
                    onClick={handleVerify}
                    disabled={verificationCode.length !== 6 || loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang xác thực...
                        </>
                    ) : (
                        <>
                            <i className="fi fi-rr-check me-2"></i>
                            Xác thực
                        </>
                    )}
                </button>
            </Modal.Footer>
        </>
    );

    const renderBackupCodesStep = () => (
        <>
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="fi fi-rr-shield-check me-2"></i>
                    Mã khôi phục dự phòng
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="enable-2fa-backup">
                    <div className="alert alert-success">
                        <i className="fi fi-rr-check-circle me-2"></i>
                        <strong>Xác thực hai yếu tố đã được kích hoạt!</strong>
                    </div>

                    <div className="alert alert-warning">
                        <i className="fi fi-rr-exclamation me-2"></i>
                        <strong>Quan trọng: Lưu các mã khôi phục này!</strong>
                        <p className="mb-0 mt-2">
                            Sử dụng các mã này để đăng nhập nếu bạn mất quyền truy cập vào ứng dụng authenticator.
                            Mỗi mã chỉ có thể sử dụng một lần.
                        </p>
                    </div>

                    <div className="backup-codes-container">
                        <div className="backup-codes-list">
                            {backupCodes.map((code, index) => (
                                <div key={index} className="backup-code-item">
                                    <span className="code-number">{index + 1}.</span>
                                    <code className="backup-code">{code}</code>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="backup-codes-actions">
                        <button
                            className="btn btn-outline-primary"
                            onClick={handleCopyBackupCodes}
                        >
                            <i className="fi fi-rr-copy-alt me-2"></i>
                            {codesCopied ? 'Đã sao chép!' : 'Sao chép tất cả'}
                        </button>
                        <button
                            className="btn btn-outline-primary"
                            onClick={handleDownloadBackupCodes}
                        >
                            <i className="fi fi-rr-download me-2"></i>
                            Tải xuống
                        </button>
                    </div>

                    <div className="alert alert-info mt-3">
                        <i className="fi fi-rr-info me-2"></i>
                        Bạn có thể tạo mã khôi phục mới bất cứ lúc nào từ trang cài đặt bảo mật.
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button
                    className="btn btn-primary"
                    onClick={handleComplete}
                >
                    <i className="fi fi-rr-check me-2"></i>
                    Hoàn tất
                </button>
            </Modal.Footer>
        </>
    );

    const renderDisableStep = () => (
        <>
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="fi fi-rr-shield-exclamation me-2"></i>
                    Tắt xác thực hai yếu tố
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="disable-2fa">
                    <div className="alert alert-warning">
                        <i className="fi fi-rr-exclamation me-2"></i>
                        <strong>Cảnh báo bảo mật</strong>
                        <p className="mb-0 mt-2">
                            Tắt xác thực hai yếu tố sẽ làm giảm bảo mật tài khoản của bạn.
                            Chúng tôi khuyên bạn nên giữ tính năng này được bật.
                        </p>
                    </div>

                    <div className="current-2fa-status">
                        <div className="status-item">
                            <i className="fi fi-rr-shield-check text-success"></i>
                            <div>
                                <strong>Trạng thái hiện tại</strong>
                                <p className="text-muted mb-0">Xác thực hai yếu tố đang được bật</p>
                            </div>
                        </div>
                    </div>

                    <p className="mt-4">
                        Bạn có chắc chắn muốn tắt xác thực hai yếu tố không?
                    </p>

                    {error && (
                        <div className="alert alert-danger mt-3">
                            <i className="fi fi-rr-cross-circle me-2"></i>
                            {error}
                        </div>
                    )}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={onHide}>
                    Hủy
                </button>
                <button
                    className="btn btn-danger"
                    onClick={handleDisable2FA}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Đang xử lý...
                        </>
                    ) : (
                        <>
                            <i className="fi fi-rr-shield-exclamation me-2"></i>
                            Tắt 2FA
                        </>
                    )}
                </button>
            </Modal.Footer>
        </>
    );

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            {step === 'setup' && renderSetupStep()}
            {step === 'verify' && renderVerifyStep()}
            {step === 'backup-codes' && renderBackupCodesStep()}
            {step === 'disable' && renderDisableStep()}
        </Modal>
    );
};

export default Enable2FAModal;
