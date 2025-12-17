/**
 * Application Service Layer
 *
 * Provides caching, request deduplication, and stale-while-revalidate functionality
 * for application API requests.
 */

import * as applicationApi from './applicationApi';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  staleWhileRevalidate: boolean;
}

class ApplicationService {
  private cache = new Map<string, CacheEntry<unknown>>();
  private pendingRequests = new Map<string, Promise<unknown>>();
  private defaultConfig: CacheConfig = {
    ttl: 5 * 60 * 1000, // 5 minutes default
    staleWhileRevalidate: true,
  };

  /**
   * Get data with caching
   */
  private async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    config?: Partial<CacheConfig>
  ): Promise<T> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const cached = this.cache.get(key) as CacheEntry<T> | undefined;
    const now = Date.now();

    // Check if cache is fresh
    if (cached && now - cached.timestamp < finalConfig.ttl) {
      return cached.data;
    }

    // Stale-while-revalidate: return stale data while fetching fresh
    if (
      cached &&
      finalConfig.staleWhileRevalidate &&
      now - cached.timestamp < finalConfig.ttl * 2
    ) {
      // Return stale data immediately
      const staleData = cached.data;

      // Fetch fresh data in background
      this.fetchAndCache(key, fetcher).catch((error) => {
        console.error(`Background revalidation failed for ${key}:`, error);
      });

      return staleData;
    }

    // Request deduplication: if already fetching, wait for existing request
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>;
    }

    // Fetch fresh data
    return this.fetchAndCache(key, fetcher);
  }

  /**
   * Fetch data and store in cache
   */
  private async fetchAndCache<T>(
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    const promise = fetcher();
    this.pendingRequests.set(key, promise);

    try {
      const data = await promise;
      this.cache.set(key, {
        data,
        timestamp: Date.now(),
      });
      return data;
    } finally {
      this.pendingRequests.delete(key);
    }
  }

  /**
   * Invalidate cache entries matching pattern
   */
  public invalidate(pattern: string | RegExp): void {
    const regex =
      typeof pattern === 'string' ? new RegExp(pattern) : pattern;

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  public clearAll(): void {
    this.cache.clear();
    this.pendingRequests.clear();
  }

  /**
   * Get cache size
   */
  public getCacheSize(): number {
    return this.cache.size;
  }

  // =============================================================================
  // Cached API Methods
  // =============================================================================

  /**
   * Get applications for a job (cached)
   */
  async getApplicationsForJob(params: {
    jobId: string;
    page: number;
    size: number;
    status?: string;
  }): Promise<ReturnType<typeof applicationApi.getApplicationsForJob>> {
    const key = `applications-job-${params.jobId}-${params.page}-${params.size}-${params.status || 'all'}`;
    return this.get(key, () => applicationApi.getApplicationsForJob(params), {
      ttl: 2 * 60 * 1000, // 2 minutes for list views
    });
  }

  /**
   * Get my assigned applications (cached)
   */
  async getMyAssignedApplications(params: {
    page: number;
    size: number;
  }): Promise<ReturnType<typeof applicationApi.getMyAssignedApplications>> {
    const key = `applications-assigned-my-${params.page}-${params.size}`;
    return this.get(
      key,
      () => applicationApi.getMyAssignedApplications(params),
      {
        ttl: 2 * 60 * 1000,
      }
    );
  }

  /**
   * Get application by ID (cached)
   */
  async getApplicationById(
    id: string
  ): Promise<ReturnType<typeof applicationApi.getApplicationById>> {
    const key = `application-${id}`;
    return this.get(key, () => applicationApi.getApplicationById(id), {
      ttl: 5 * 60 * 1000, // 5 minutes for detail views
    });
  }

  /**
   * Get dashboard stats (cached)
   */
  async getDashboardStats(): Promise<
    ReturnType<typeof applicationApi.getHRDashboardStats>
  > {
    const key = 'dashboard-stats';
    return this.get(key, () => applicationApi.getHRDashboardStats(), {
      ttl: 3 * 60 * 1000, // 3 minutes for analytics
    });
  }

  /**
   * Get manager stats (cached)
   */
  async getManagerStats(
    companyId: string
  ): Promise<ReturnType<typeof applicationApi.getManagerStats>> {
    const key = `manager-stats-${companyId}`;
    return this.get(key, () => applicationApi.getManagerStats(companyId), {
      ttl: 5 * 60 * 1000,
    });
  }

  /**
   * Get job stats (cached)
   */
  async getJobStats(
    jobId: string
  ): Promise<ReturnType<typeof applicationApi.getJobStats>> {
    const key = `job-stats-${jobId}`;
    return this.get(key, () => applicationApi.getJobStats(jobId), {
      ttl: 5 * 60 * 1000,
    });
  }

  /**
   * Search applications (cached with shorter TTL)
   */
  async searchApplications(filters: {
    keyword?: string;
    status?: string[];
    jobIds?: string[];
    companyIds?: string[];
    assignedTo?: string[];
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    size?: number;
  }): Promise<ReturnType<typeof applicationApi.searchApplications>> {
    const key = `search-${JSON.stringify(filters)}`;
    return this.get(key, () => applicationApi.searchApplications(filters), {
      ttl: 1 * 60 * 1000, // 1 minute for search results
    });
  }

  /**
   * Get company applications (cached)
   */
  async getCompanyApplications(params: {
    companyId: string;
    page: number;
    size: number;
    status?: string;
    assignedTo?: string;
  }): Promise<ReturnType<typeof applicationApi.getCompanyApplications>> {
    const key = `applications-company-${params.companyId}-${params.page}-${params.size}-${params.status || 'all'}-${params.assignedTo || 'all'}`;
    return this.get(
      key,
      () => applicationApi.getCompanyApplications(params),
      {
        ttl: 2 * 60 * 1000,
      }
    );
  }

  /**
   * Get my applications (cached)
   */
  async getMyApplications(params: {
    page: number;
    size: number;
    status?: string;
  }): Promise<ReturnType<typeof applicationApi.getMyApplications>> {
    const key = `applications-my-${params.page}-${params.size}-${params.status || 'all'}`;
    return this.get(key, () => applicationApi.getMyApplications(params), {
      ttl: 2 * 60 * 1000,
    });
  }

  // =============================================================================
  // Mutation Methods (no caching, invalidate on success)
  // =============================================================================

  /**
   * Update application status
   */
  async updateStatus(
    id: string,
    request: Parameters<typeof applicationApi.updateStatus>[1]
  ): Promise<ReturnType<typeof applicationApi.updateStatus>> {
    const result = await applicationApi.updateStatus(id, request);

    // Invalidate related cache
    this.invalidate(`application-${id}`);
    this.invalidate('applications-');
    this.invalidate('dashboard-stats');
    this.invalidate('manager-stats');
    this.invalidate('job-stats');

    return result;
  }

  /**
   * Bulk update status
   */
  async bulkUpdateStatus(
    request: Parameters<typeof applicationApi.bulkUpdateStatus>[0]
  ): Promise<ReturnType<typeof applicationApi.bulkUpdateStatus>> {
    const result = await applicationApi.bulkUpdateStatus(request);

    // Invalidate all application caches
    this.invalidate('applications-');
    this.invalidate('dashboard-stats');
    this.invalidate('manager-stats');

    return result;
  }

  /**
   * Add note to application
   */
  async addNote(
    id: string,
    request: Parameters<typeof applicationApi.addNote>[1]
  ): Promise<ReturnType<typeof applicationApi.addNote>> {
    const result = await applicationApi.addNote(id, request);

    // Invalidate application cache
    this.invalidate(`application-${id}`);

    return result;
  }

  /**
   * Update note
   */
  async updateNote(
    id: string,
    noteId: string,
    request: Parameters<typeof applicationApi.updateNote>[2]
  ): Promise<ReturnType<typeof applicationApi.updateNote>> {
    const result = await applicationApi.updateNote(id, noteId, request);

    // Invalidate application cache
    this.invalidate(`application-${id}`);

    return result;
  }

  /**
   * Delete note
   */
  async deleteNote(
    id: string,
    noteId: string
  ): Promise<ReturnType<typeof applicationApi.deleteNote>> {
    const result = await applicationApi.deleteNote(id, noteId);

    // Invalidate application cache
    this.invalidate(`application-${id}`);

    return result;
  }

  /**
   * Assign application
   */
  async assignApplication(
    id: string,
    request: Parameters<typeof applicationApi.assignApplication>[1]
  ): Promise<ReturnType<typeof applicationApi.assignApplication>> {
    const result = await applicationApi.assignApplication(id, request);

    // Invalidate related cache
    this.invalidate(`application-${id}`);
    this.invalidate('applications-');
    this.invalidate('dashboard-stats');
    this.invalidate('manager-stats');

    return result;
  }

  /**
   * Unassign application
   */
  async unassignApplication(
    id: string
  ): Promise<ReturnType<typeof applicationApi.unassignApplication>> {
    const result = await applicationApi.unassignApplication(id);

    // Invalidate related cache
    this.invalidate(`application-${id}`);
    this.invalidate('applications-');
    this.invalidate('dashboard-stats');
    this.invalidate('manager-stats');

    return result;
  }

  /**
   * Create application
   */
  async createApplication(
    request: Parameters<typeof applicationApi.createApplication>[0]
  ): Promise<ReturnType<typeof applicationApi.createApplication>> {
    const result = await applicationApi.createApplication(request);

    // Invalidate all list caches
    this.invalidate('applications-');
    this.invalidate('dashboard-stats');
    this.invalidate('manager-stats');
    this.invalidate('job-stats');

    return result;
  }

  /**
   * Withdraw application
   */
  async withdrawApplication(
    id: string
  ): Promise<ReturnType<typeof applicationApi.withdrawApplication>> {
    const result = await applicationApi.withdrawApplication(id);

    // Invalidate related cache
    this.invalidate(`application-${id}`);
    this.invalidate('applications-');
    this.invalidate('dashboard-stats');

    return result;
  }
}

// Export singleton instance
export const applicationService = new ApplicationService();

// Export class for testing
export default ApplicationService;
