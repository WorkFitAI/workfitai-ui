"use client";

import React, { useEffect, useState, useCallback } from 'react';
import {
  getUnassignedApplications,
  assignApplication,
  unassignApplication
} from '@/lib/applicationApi';
import AssignmentBoard from '@/components/application/control/AssignmentBoard';
import type { Application } from '@/types/application/application';
import { showToast, getErrorMessage } from '@/lib/toast';

export default function ManageApplicationsPage(): React.ReactElement {
  const [unassignedApps, setUnassignedApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUnassigned = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const response = await getUnassignedApplications({ page: 0, size: 50 });
      setUnassignedApps(response.items);
    } catch (error) {
      console.error('Failed to fetch unassigned applications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnassigned();
  }, [fetchUnassigned]);

  const handleAssign = async (applicationId: string, hrUsername: string): Promise<void> => {
    try {
      await assignApplication(applicationId, { assignedTo: hrUsername });
      fetchUnassigned();
      showToast.success('Application assigned successfully');
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  const handleUnassign = async (applicationId: string): Promise<void> => {
    if (!confirm('Unassign this application?')) return;

    try {
      await unassignApplication(applicationId);
      fetchUnassigned();
      showToast.success('Application unassigned successfully');
    } catch (error) {
      showToast.error(getErrorMessage(error));
    }
  };

  return (
    <>
      <div className="col-lg-12">
        <div className="section-box">
          <div className="container">
            <div className="mb-4">
              <h3>Manage Applications</h3>
              <p className="text-muted">Assign unassigned applications to HR team members</p>
            </div>

            <AssignmentBoard
              unassignedApplications={unassignedApps}
              loading={loading}
              onAssign={handleAssign}
              onUnassign={handleUnassign}
            />
          </div>
        </div>
      </div>
    </>
  );
}
