"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import QuickFilters from "./QuickFilters";
import AdvancedFilters from "./AdvancedFilters";
import type { ApplicationStatus } from "@/types/application/application";

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilterState) => void;
  counts?: Partial<Record<ApplicationStatus, number>>;
  availableJobs?: JobOption[];
  availableAssignees?: AssigneeOption[];
  showAdvancedByDefault?: boolean;
}

export interface SearchFilterState {
  searchText: string;
  status: ApplicationStatus | null;
  statuses: ApplicationStatus[];
  jobIds: string[];
  assignedTo: string | null;
  dateRange: { from: string; to: string } | null;
}

interface JobOption {
  id: string;
  title: string;
  companyName: string;
}

interface AssigneeOption {
  username: string;
  name: string;
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilterState;
  createdAt: string;
}

// LocalStorage keys
const SAVED_SEARCHES_KEY = "application_saved_searches";
const RECENT_SEARCHES_KEY = "application_recent_searches";
const MAX_RECENT_SEARCHES = 5;

const SearchFilters = ({
  onFiltersChange,
  counts,
  availableJobs = [],
  availableAssignees = [],
  showAdvancedByDefault = false,
}: SearchFiltersProps): React.ReactElement => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const [searchText, setSearchText] = useState<string>("");
  const [selectedStatus, setSelectedStatus] =
    useState<ApplicationStatus | null>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(
    showAdvancedByDefault
  );
  const [advancedFilters, setAdvancedFilters] = useState<{
    statuses: ApplicationStatus[];
    jobIds: string[];
    assignedTo: string | null;
    dateRange: { from: string; to: string } | null;
  }>({
    statuses: [],
    jobIds: [],
    assignedTo: null,
    dateRange: null,
  });

  // Saved searches state
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [recentSearches, setRecentSearches] = useState<SearchFilterState[]>([]);
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  const [searchNameInput, setSearchNameInput] = useState("");

  // Load saved searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(SAVED_SEARCHES_KEY);
      const recent = localStorage.getItem(RECENT_SEARCHES_KEY);

      if (saved) {
        try {
          setSavedSearches(JSON.parse(saved));
        } catch (error) {
          console.error("Failed to parse saved searches:", error);
        }
      }

      if (recent) {
        try {
          setRecentSearches(JSON.parse(recent));
        } catch (error) {
          console.error("Failed to parse recent searches:", error);
        }
      }
    }
  }, []);

  // Sync state with URL params on mount
  useEffect(() => {
    const statusParam = searchParams.get("status") as ApplicationStatus | null;
    const searchParam = searchParams.get("search") || "";
    const jobIdsParam =
      searchParams.get("jobIds")?.split(",").filter(Boolean) || [];
    const assignedToParam = searchParams.get("assignedTo") || null;
    const fromDate = searchParams.get("fromDate") || "";
    const toDate = searchParams.get("toDate") || "";

    setSearchText(searchParam);
    setSelectedStatus(statusParam);
    setAdvancedFilters({
      statuses: statusParam ? [statusParam] : [],
      jobIds: jobIdsParam,
      assignedTo: assignedToParam,
      dateRange: fromDate || toDate ? { from: fromDate, to: toDate } : null,
    });
  }, []); // Only run on mount

  // Update URL params when filters change
  const updateUrlParams = useCallback(
    (filters: SearchFilterState): void => {
      const params = new URLSearchParams(searchParams.toString());

      // Update or remove each param
      if (filters.searchText) {
        params.set("search", filters.searchText);
      } else {
        params.delete("search");
      }

      if (filters.status) {
        params.set("status", filters.status);
      } else {
        params.delete("status");
      }

      if (filters.jobIds.length > 0) {
        params.set("jobIds", filters.jobIds.join(","));
      } else {
        params.delete("jobIds");
      }

      if (filters.assignedTo) {
        params.set("assignedTo", filters.assignedTo);
      } else {
        params.delete("assignedTo");
      }

      if (filters.dateRange?.from) {
        params.set("fromDate", filters.dateRange.from);
      } else {
        params.delete("fromDate");
      }

      if (filters.dateRange?.to) {
        params.set("toDate", filters.dateRange.to);
      } else {
        params.delete("toDate");
      }

      // Update URL without page reload
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.push(newUrl, { scroll: false });
    },
    [router, searchParams]
  );

  // Emit filters to parent
  const emitFilters = useCallback(
    (filters: SearchFilterState): void => {
      onFiltersChange(filters);
      updateUrlParams(filters);
    },
    [onFiltersChange, updateUrlParams]
  );

  // Handle quick filter change
  const handleQuickFilterChange = (status: ApplicationStatus | null): void => {
    setSelectedStatus(status);
    emitFilters({
      searchText,
      status,
      statuses: status ? [status] : [],
      jobIds: advancedFilters.jobIds,
      assignedTo: advancedFilters.assignedTo,
      dateRange: advancedFilters.dateRange,
    });
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchText(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const filters = {
      searchText,
      status: selectedStatus,
      statuses: advancedFilters.statuses,
      jobIds: advancedFilters.jobIds,
      assignedTo: advancedFilters.assignedTo,
      dateRange: advancedFilters.dateRange,
    };
    addToRecentSearches(filters);
    emitFilters(filters);
  };

  // Handle advanced filter change
  const handleAdvancedFilterChange = (
    filters: typeof advancedFilters
  ): void => {
    setAdvancedFilters(filters);
  };

  // Handle advanced filter apply
  const handleAdvancedFilterApply = (): void => {
    emitFilters({
      searchText,
      status:
        advancedFilters.statuses.length === 1
          ? advancedFilters.statuses[0]
          : null,
      statuses: advancedFilters.statuses,
      jobIds: advancedFilters.jobIds,
      assignedTo: advancedFilters.assignedTo,
      dateRange: advancedFilters.dateRange,
    });
    setShowAdvanced(false);
  };

  // Handle reset
  const handleReset = (): void => {
    setSearchText("");
    setSelectedStatus(null);
    setAdvancedFilters({
      statuses: [],
      jobIds: [],
      assignedTo: null,
      dateRange: null,
    });
    emitFilters({
      searchText: "",
      status: null,
      statuses: [],
      jobIds: [],
      assignedTo: null,
      dateRange: null,
    });
    setShowAdvanced(false);
  };

  // Save current search
  const handleSaveSearch = (): void => {
    if (!searchNameInput.trim()) return;

    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name: searchNameInput.trim(),
      filters: {
        searchText,
        status: selectedStatus,
        statuses: advancedFilters.statuses,
        jobIds: advancedFilters.jobIds,
        assignedTo: advancedFilters.assignedTo,
        dateRange: advancedFilters.dateRange,
      },
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedSearches, newSearch];
    setSavedSearches(updated);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated));
    setSearchNameInput("");
  };

  // Load saved search
  const handleLoadSavedSearch = (search: SavedSearch): void => {
    setSearchText(search.filters.searchText);
    setSelectedStatus(search.filters.status);
    setAdvancedFilters({
      statuses: search.filters.statuses,
      jobIds: search.filters.jobIds,
      assignedTo: search.filters.assignedTo,
      dateRange: search.filters.dateRange,
    });
    emitFilters(search.filters);
    setShowSavedSearches(false);
  };

  // Delete saved search
  const handleDeleteSavedSearch = (id: string): void => {
    const updated = savedSearches.filter((s) => s.id !== id);
    setSavedSearches(updated);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(updated));
  };

  // Add to recent searches
  const addToRecentSearches = (filters: SearchFilterState): void => {
    // Skip if filters are empty
    if (
      !filters.searchText &&
      !filters.status &&
      filters.statuses.length === 0 &&
      filters.jobIds.length === 0 &&
      !filters.assignedTo &&
      !filters.dateRange
    ) {
      return;
    }

    const updated = [
      filters,
      ...recentSearches.filter(
        (r) => JSON.stringify(r) !== JSON.stringify(filters)
      ),
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  return (
    <div className="search-filters">
      {/* Quick Filters */}
      <QuickFilters
        selectedStatus={selectedStatus}
        onSelectStatus={handleQuickFilterChange}
        counts={counts}
      />

      {/* Search Bar */}
      <form className="search-bar" onSubmit={handleSearchSubmit}>
        <div className="search-bar__wrapper">
          <svg
            className="search-bar__icon"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            className="search-bar__input"
            placeholder="Search candidates, jobs, emails..."
            value={searchText}
            onChange={handleSearchChange}
            aria-label="Search applications"
          />
          {searchText && (
            <button
              type="button"
              className="search-bar__clear"
              onClick={() => {
                setSearchText("");
                handleSearchSubmit(
                  new Event(
                    "submit"
                  ) as unknown as React.FormEvent<HTMLFormElement>
                );
              }}
              aria-label="Clear search"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12 4L4 12M4 4l8 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
        <button type="submit" className="search-bar__button">
          Search
        </button>
      </form>

      {/* Advanced Filters Toggle */}
      <div className="search-filters__controls">
        <button
          type="button"
          className={`advanced-toggle ${showAdvanced ? "active" : ""}`}
          onClick={() => setShowAdvanced(!showAdvanced)}
          aria-expanded={showAdvanced}
          aria-controls="advanced-filters-panel"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 4h12M4 8h8M6 12h4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Advanced Filters
          <svg
            className="advanced-toggle__chevron"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          className={`saved-searches-toggle ${
            showSavedSearches ? "active" : ""
          }`}
          onClick={() => setShowSavedSearches(!showSavedSearches)}
          aria-expanded={showSavedSearches}
          aria-label="Toggle saved searches"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M12 2H4a2 2 0 00-2 2v10l4-3 4 3V4a2 2 0 00-2-2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Saved ({savedSearches.length})
        </button>

        {(searchText ||
          selectedStatus ||
          advancedFilters.jobIds.length > 0 ||
          advancedFilters.assignedTo ||
          advancedFilters.dateRange) && (
          <button
            type="button"
            className="reset-filters"
            onClick={handleReset}
            aria-label="Clear all filters"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Saved Searches Panel */}
      {showSavedSearches && (
        <div className="saved-searches-panel">
          <div className="saved-searches-panel__header">
            <h4>Saved Searches</h4>
          </div>

          {/* Save Current Search */}
          <div className="saved-searches-panel__save">
            <input
              type="text"
              placeholder="Name this search..."
              value={searchNameInput}
              onChange={(e) => setSearchNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveSearch();
              }}
              aria-label="Search name"
            />
            <button
              onClick={handleSaveSearch}
              disabled={!searchNameInput.trim()}
              aria-label="Save current search"
            >
              Save Current
            </button>
          </div>

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="saved-searches-panel__section">
              <h5>Recent Searches</h5>
              <ul className="saved-searches-panel__list">
                {recentSearches.map((search, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        setSearchText(search.searchText);
                        setSelectedStatus(search.status);
                        setAdvancedFilters({
                          statuses: search.statuses,
                          jobIds: search.jobIds,
                          assignedTo: search.assignedTo,
                          dateRange: search.dateRange,
                        });
                        emitFilters(search);
                        setShowSavedSearches(false);
                      }}
                      className="saved-search-item"
                    >
                      <span className="saved-search-item__label">
                        {formatSearchLabel(search)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Saved Searches */}
          {savedSearches.length > 0 && (
            <div className="saved-searches-panel__section">
              <h5>Saved Searches</h5>
              <ul className="saved-searches-panel__list">
                {savedSearches.map((search) => (
                  <li key={search.id}>
                    <button
                      onClick={() => handleLoadSavedSearch(search)}
                      className="saved-search-item"
                    >
                      <span className="saved-search-item__label">
                        {search.name}
                      </span>
                      <span className="saved-search-item__meta">
                        {formatSearchLabel(search.filters)}
                      </span>
                    </button>
                    <button
                      onClick={() => handleDeleteSavedSearch(search.id)}
                      className="saved-search-item__delete"
                      aria-label={`Delete ${search.name}`}
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                      >
                        <path
                          d="M11 3L3 11M3 3l8 8"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {savedSearches.length === 0 && recentSearches.length === 0 && (
            <div className="saved-searches-panel__empty">
              No saved or recent searches yet
            </div>
          )}
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div id="advanced-filters-panel" className="search-filters__panel">
          <AdvancedFilters
            filters={advancedFilters}
            onChange={handleAdvancedFilterChange}
            onApply={handleAdvancedFilterApply}
            onReset={handleReset}
            availableJobs={availableJobs}
            availableAssignees={availableAssignees}
          />
        </div>
      )}
    </div>
  );
};

// Helper function to format search label
function formatSearchLabel(filters: SearchFilterState): string {
  const parts: string[] = [];

  if (filters.searchText) {
    parts.push(`Text: "${filters.searchText}"`);
  }

  if (filters.status) {
    parts.push(`Status: ${filters.status}`);
  } else if (filters.statuses.length > 0) {
    parts.push(`Statuses: ${filters.statuses.join(", ")}`);
  }

  if (filters.jobIds.length > 0) {
    parts.push(`Jobs: ${filters.jobIds.length}`);
  }

  if (filters.assignedTo) {
    parts.push(`Assigned: ${filters.assignedTo}`);
  }

  if (filters.dateRange) {
    parts.push("Date Range");
  }

  return parts.length > 0 ? parts.join(" | ") : "All Applications";
}

// Export types
export type ApplicationFilters = SearchFilterState;
export type { JobOption, AssigneeOption };

export default SearchFilters;
