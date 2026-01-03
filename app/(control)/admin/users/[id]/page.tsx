"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { selectAuthUser } from "@/redux/features/auth/authSlice";
import {
  userApi,
  formatUserRole,
  formatUserStatus,
  getStatusColor,
  getRoleColor,
} from "@/lib/userApi";
import { UserListItem } from "@/types/users";
import { showToast, getErrorMessage } from "@/lib/toast";
import ConfirmModal from "@/components/common/ConfirmModal";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShield,
  FiActivity,
  FiMapPin,
  FiBriefcase,
  FiArrowLeft,
  FiSlash,
  FiTrash2,
  FiCheckCircle,
} from "react-icons/fi";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const currentUser = useAppSelector(selectAuthUser);
  const username = params.id as string;

  const [user, setUser] = useState<UserListItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    variant: "danger" | "warning" | "info" | "primary";
    onConfirm: () => void;
  } | null>(null);

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    loadUser();
  }, [username]);

  const loadUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userApi.getUserByUsername(username);
      if (response.status === 200 && response.data) {
        setUser(response.data);
      } else {
        setError(response.message || "Failed to load user");
      }
    } catch (error: any) {
      setError(getErrorMessage(error));
      showToast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async () => {
    if (!user || isOwnProfile) return;
    setConfirmModal({
      show: true,
      title: user.blocked ? "Unblock User" : "Block User",
      message: `Are you sure you want to ${
        user.blocked ? "unblock" : "block"
      } this user?`,
      variant: user.blocked ? "info" : "warning",
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await userApi.blockUser(username, !user.blocked);
          showToast.success(
            `User ${user.blocked ? "unblocked" : "blocked"} successfully`
          );
          loadUser();
        } catch (error) {
          showToast.error(getErrorMessage(error));
        }
      },
    });
  };

  const handleDelete = async () => {
    if (isOwnProfile) return;
    setConfirmModal({
      show: true,
      title: "Confirm Deletion",
      message:
        "This action is irreversible. The user account will be permanently deactivated.",
      variant: "danger",
      onConfirm: async () => {
        setConfirmModal(null);
        try {
          await userApi.deleteUser(username);
          showToast.success("User deleted successfully");
          router.push("/admin/users");
        } catch (error) {
          showToast.error(getErrorMessage(error));
        }
      },
    });
  };

  if (loading)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="spinner-grow text-primary" role="status"></div>
      </div>
    );

  if (error || !user)
    return (
      <div className="container mt-50">
        <div className="text-center p-5 shadow-sm rounded bg-white">
          <FiSlash size={64} className="text-danger mb-3" />
          <h4 className="fw-bold">{error || "User not found"}</h4>
          <Link href="/admin/users" className="btn btn-outline-primary mt-3">
            <FiArrowLeft className="me-2" /> Back to List
          </Link>
        </div>
      </div>
    );

  return (
    <div className="section-box mt-30">
      <div className="container">
        {/* Header Section */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <Link
              href="/admin/users"
              className="text-muted text-decoration-none small d-flex align-items-center mb-2"
            >
              <FiArrowLeft className="me-1" /> BACK TO DIRECTORY
            </Link>
            <h3 className="fw-bold mb-0">
              User Profile:{" "}
              <span className="text-primary">@{user.username}</span>
            </h3>
          </div>
          <div className="d-flex gap-2">
            <span className={`badge bg-${getRoleColor(user.role)} px-3 py-2`}>
              {formatUserRole(user.role)}
            </span>
            <span
              className={`badge bg-${getStatusColor(user.status)} px-3 py-2`}
            >
              {formatUserStatus(user.status)}
            </span>
          </div>
        </div>

        <div className="row">
          {/* Main Info */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h5 className="card-title fw-bold mb-4 d-flex align-items-center">
                  <FiUser className="me-2 text-primary" /> Personal Information
                </h5>
                <div className="row g-4">
                  <InfoItem
                    icon={<FiShield />}
                    label="User ID"
                    value={user.userId}
                  />
                  <InfoItem
                    icon={<FiUser />}
                    label="Full Name"
                    value={user.fullName || "—"}
                  />
                  <InfoItem
                    icon={<FiMail />}
                    label="Email Address"
                    value={user.email}
                  />
                  <InfoItem
                    icon={<FiPhone />}
                    label="Phone Number"
                    value={user.phoneNumber || "—"}
                  />
                  <InfoItem
                    icon={<FiCalendar />}
                    label="Joined Date"
                    value={new Date(user.createdAt).toLocaleDateString(
                      "vi-VN",
                      { day: "2-digit", month: "long", year: "numeric" }
                    )}
                  />
                  <InfoItem
                    icon={<FiActivity />}
                    label="Last Updated"
                    value={new Date(user.updatedAt).toLocaleString()}
                  />
                </div>
              </div>
            </div>

            {(user.role === "HR" || user.role === "HR_MANAGER") && (
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h5 className="card-title fw-bold mb-4 d-flex align-items-center">
                    <FiBriefcase className="me-2 text-primary" /> Professional
                    Details
                  </h5>
                  <div className="row g-4">
                    <InfoItem
                      icon={<FiBriefcase />}
                      label="Company"
                      value={user.companyName}
                    />
                    <InfoItem
                      icon={<FiShield />}
                      label="Tax/Company No"
                      value={user.companyNo}
                    />
                    <InfoItem
                      icon={<FiActivity />}
                      label="Department"
                      value={user.department}
                    />
                    <InfoItem
                      icon={<FiMapPin />}
                      label="Work Address"
                      value={user.address}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Actions */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm mb-4 bg-light">
              <div className="card-body p-4 text-center">
                <div
                  className="avatar-placeholder mb-3 mx-auto shadow-sm d-flex align-items-center justify-content-center bg-white rounded-circle"
                  style={{ width: 80, height: 80 }}
                >
                  <FiUser size={40} className="text-primary" />
                </div>
                <h6 className="fw-bold mb-1">
                  {user.fullName || user.username}
                </h6>
                <p className="text-muted small mb-4">{user.email}</p>

                <div className="d-grid gap-2">
                  <button
                    className={`btn ${
                      user.blocked ? "btn-success" : "btn-warning"
                    } d-flex align-items-center justify-content-center gap-2`}
                    onClick={handleBlock}
                    disabled={user.deleted || isOwnProfile}
                  >
                    {user.blocked ? (
                      <>
                        <FiCheckCircle /> Unblock Account
                      </>
                    ) : (
                      <>
                        <FiSlash /> Block Account
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-outline-danger d-flex align-items-center justify-content-center gap-2"
                    onClick={handleDelete}
                    disabled={user.deleted || isOwnProfile}
                  >
                    <FiTrash2 /> Delete User
                  </button>
                </div>
                {isOwnProfile && (
                  <div className="mt-3 p-2 bg-white rounded border border-warning">
                    <small className="text-warning fw-medium">
                      Self-actions are restricted
                    </small>
                  </div>
                )}
              </div>
            </div>

            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">Account Security</h6>
                <ul className="list-unstyled mb-0">
                  <li className="d-flex align-items-center mb-2 small">
                    <div
                      className={`dot me-2 ${
                        user.blocked ? "bg-danger" : "bg-success"
                      }`}
                    ></div>
                    {user.blocked
                      ? "Access is currently restricted"
                      : "Account is in good standing"}
                  </li>
                  <li className="d-flex align-items-center small">
                    <div
                      className={`dot me-2 ${
                        user.deleted ? "bg-secondary" : "bg-primary"
                      }`}
                    ></div>
                    {user.deleted ? "Marked for deletion" : "Identity verified"}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {confirmModal && (
        <ConfirmModal
          show={confirmModal.show}
          title={confirmModal.title}
          message={confirmModal.message}
          variant={confirmModal.variant}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      <style jsx>{`
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .card {
          border-radius: 12px;
        }
      `}</style>
    </div>
  );
}

// Component phụ để hiển thị item thông tin cho gọn
function InfoItem({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="col-md-6">
      <label
        className="text-muted small d-block text-uppercase fw-bold mb-1"
        style={{ letterSpacing: "0.5px" }}
      >
        {label}
      </label>
      <div className="d-flex align-items-center">
        <span className="text-primary me-2 opacity-75">{icon}</span>
        <span className="fw-medium text-dark">{value}</span>
      </div>
    </div>
  );
}
