'use client';

import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { disable2FA } from '@/redux/features/profile/profileSlice';

interface Disable2FAModalProps {
    show: boolean;
    onHide: () => void;
    method: 'TOTP' | 'EMAIL';
}

const Disable2FAModal: React.FC<Disable2FAModalProps> = ({ show, onHide, method }) => {
    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.profile);

    const [password, setPassword] = useState('');
    const [code, setCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!password || !code) {
            return;
        }

        try {
            await dispatch(disable2FA({ password, code })).unwrap();
            // Reset form and close modal
            setPassword('');
            setCode('');
            onHide();
        } catch (err) {
            console.error('Failed to disable 2FA:', err);
        }
    };

    const handleClose = () => {
        setPassword('');
        setCode('');
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="fi fi-rr-shield-exclamation me-2 text-danger"></i>
                    Tắt xác thực hai yếu tố
                </Modal.Title>
            </Modal.Header>
            <form onSubmit={handleSubmit}>
                <Modal.Body>
                    <div className="alert alert-warning">
                        <i className="fi fi-rr-exclamation-triangle me-2"></i>
                        <strong>Cảnh báo bảo mật</strong>
                        <p className="mb-0 mt-2">
                            Tắt xác thực hai yếu tố sẽ làm giảm bảo mật tài khoản của bạn.
                            Vui lòng xác nhận bằng mật khẩu và mã xác thực.
                        </p>
                    </div>

                    <div className="disable-2fa-info mb-4">
                        <div className="d-flex align-items-center gap-3">
                            <div className="method-icon-lg">
                                <i className={`fi fi-rr-${method === 'TOTP' ? 'mobile' : 'envelope'} text-primary`}></i>
                            </div>
                            <div>
                                <h6 className="mb-1">Phương thức hiện tại</h6>
                                <p className="text-muted mb-0">
                                    {method === 'TOTP' ? 'Authenticator App (TOTP)' : 'Email'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-3">
                        <label className="form-label">
                            Mật khẩu tài khoản <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className="form-control"
                                placeholder="Nhập mật khẩu của bạn"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <i className={`fi fi-rr-${showPassword ? 'eye-crossed' : 'eye'}`}></i>
                            </button>
                        </div>
                    </div>

                    {/* 2FA Code Input */}
                    <div className="mb-3">
                        <label className="form-label">
                            Mã xác thực <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control form-control-lg text-center"
                            placeholder="000000"
                            value={code}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                setCode(value);
                            }}
                            maxLength={6}
                            required
                        />
                        <div className="form-text">
                            {method === 'TOTP'
                                ? 'Nhập mã 6 chữ số từ ứng dụng authenticator'
                                : 'Nhập mã 6 chữ số đã được gửi tới email của bạn'}
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger">
                            <i className="fi fi-rr-cross-circle me-2"></i>
                            {error}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleClose}
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="btn btn-danger"
                        disabled={loading || !password || code.length !== 6}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Đang xử lý...
                            </>
                        ) : (
                            <>
                                <i className="fi fi-rr-shield-exclamation me-2"></i>
                                Tắt xác thực hai yếu tố
                            </>
                        )}
                    </button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default Disable2FAModal;
