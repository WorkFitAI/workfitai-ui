"use client";

import React, { useEffect, useState } from "react";
import {
    getAuthStatus,
    unlinkOAuthProvider,
    initiateLinkOAuth,
    type OAuthProvider,
    type AuthStatusResponse,
    getProviderDisplayName,
    getProviderIcon,
} from "@/lib/oauthApi";
import { showToast } from "@/lib/toast";

interface ConnectedAccountsProps {
    onPasswordRequired?: () => void;
}

export default function ConnectedAccounts({ onPasswordRequired }: ConnectedAccountsProps) {
    const [authStatus, setAuthStatus] = useState<AuthStatusResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        loadAuthStatus();
    }, []);

    const loadAuthStatus = async () => {
        try {
            setLoading(true);
            const status = await getAuthStatus();
            setAuthStatus(status);
        } catch (error) {
            const message = error instanceof Error ? error.message : "Failed to load auth status";
            showToast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleLink = async (provider: OAuthProvider) => {
        setActionLoading(`link-${provider}`);
        try {
            // This will redirect to OAuth provider
            await initiateLinkOAuth(provider);
            // Note: We won't reach here as it redirects
        } catch (error) {
            setActionLoading(null);
            const message = error instanceof Error ? error.message : `Failed to link ${getProviderDisplayName(provider)}`;
            showToast.error(message);
        }
    };

    const handleUnlink = async (provider: OAuthProvider) => {
        if (!authStatus?.canUnlinkOAuth) {
            showToast.error(authStatus?.message || "Cannot unlink this provider");
            if (!authStatus?.hasPassword && onPasswordRequired) {
                onPasswordRequired();
            }
            return;
        }

        if (!confirm(`Are you sure you want to unlink ${getProviderDisplayName(provider)}?`)) {
            return;
        }

        setActionLoading(`unlink-${provider}`);
        try {
            await unlinkOAuthProvider(provider);
            showToast.success(`${getProviderDisplayName(provider)} account unlinked successfully`);
            await loadAuthStatus();
        } catch (error) {
            const message = error instanceof Error ? error.message : `Failed to unlink ${getProviderDisplayName(provider)}`;
            showToast.error(message);
        } finally {
            setActionLoading(null);
        }
    };

    const isProviderLinked = (provider: OAuthProvider): boolean => {
        return authStatus?.oauthProviders.includes(provider) ?? false;
    };

    if (loading) {
        return (
            <div className="connected-accounts-section">
                <h3 className="mb-4">Connected Accounts</h3>
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="connected-accounts-section">
            <h3 className="mb-3">Connected Accounts</h3>
            <p className="text-muted mb-4">
                Manage your login methods. You can sign in using any connected account.
            </p>

            {/* Warning message if no password */}
            {!authStatus?.hasPassword && (
                <div className="alert alert-warning mb-4" role="alert">
                    <i className="fi-rr-exclamation me-2"></i>
                    <strong>Security Notice:</strong> {authStatus?.message}
                </div>
            )}

            {/* Provider Cards */}
            <div className="providers-list">
                {/* Google */}
                <ProviderCard
                    provider="GOOGLE"
                    isLinked={isProviderLinked("GOOGLE")}
                    onLink={() => handleLink("GOOGLE")}
                    onUnlink={() => handleUnlink("GOOGLE")}
                    loading={actionLoading === "link-GOOGLE" || actionLoading === "unlink-GOOGLE"}
                    canUnlink={authStatus?.canUnlinkOAuth ?? false}
                />

                {/* GitHub */}
                <ProviderCard
                    provider="GITHUB"
                    isLinked={isProviderLinked("GITHUB")}
                    onLink={() => handleLink("GITHUB")}
                    onUnlink={() => handleUnlink("GITHUB")}
                    loading={actionLoading === "link-GITHUB" || actionLoading === "unlink-GITHUB"}
                    canUnlink={authStatus?.canUnlinkOAuth ?? false}
                />
            </div>

            <style jsx>{`
        .connected-accounts-section {
          background: white;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 24px;
        }

        .providers-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
      `}</style>
        </div>
    );
}

interface ProviderCardProps {
    provider: OAuthProvider;
    isLinked: boolean;
    onLink: () => void;
    onUnlink: () => void;
    loading: boolean;
    canUnlink: boolean;
}

function ProviderCard({ provider, isLinked, onLink, onUnlink, loading, canUnlink }: ProviderCardProps) {
    const displayName = getProviderDisplayName(provider);
    const icon = getProviderIcon(provider);

    return (
        <div className="provider-card">
            <div className="provider-info">
                <img src={icon} alt={displayName} className="provider-icon" />
                <div className="provider-details">
                    <h5 className="mb-0">{displayName}</h5>
                    <p className="text-muted mb-0">
                        {isLinked ? (
                            <span className="text-success">
                                <i className="fi-rr-check-circle me-1"></i>
                                Connected
                            </span>
                        ) : (
                            <span className="text-secondary">Not connected</span>
                        )}
                    </p>
                </div>
            </div>

            <div className="provider-actions">
                {isLinked ? (
                    <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={onUnlink}
                        disabled={loading || !canUnlink}
                        title={!canUnlink ? "Cannot unlink - this is your only login method" : ""}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Unlinking...
                            </>
                        ) : (
                            <>
                                <i className="fi-rr-cross-small me-1"></i>
                                Unlink
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={onLink}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Linking...
                            </>
                        ) : (
                            <>
                                <i className="fi-rr-link me-1"></i>
                                Link Account
                            </>
                        )}
                    </button>
                )}
            </div>

            <style jsx>{`
        .provider-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .provider-card:hover {
          border-color: #d1d5db;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .provider-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .provider-icon {
          width: 40px;
          height: 40px;
          object-fit: contain;
        }

        .provider-details h5 {
          font-size: 1rem;
          font-weight: 600;
          color: #1f2937;
        }

        .provider-details p {
          font-size: 0.875rem;
          margin-top: 2px;
        }

        .provider-actions {
          display: flex;
          gap: 8px;
        }

        .btn-sm {
          padding: 6px 16px;
          font-size: 0.875rem;
        }

        @media (max-width: 576px) {
          .provider-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
          }

          .provider-actions {
            width: 100%;
          }

          .provider-actions button {
            width: 100%;
          }
        }
      `}</style>
        </div>
    );
}
