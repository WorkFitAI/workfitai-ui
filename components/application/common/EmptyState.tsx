"use client";

import React from 'react';

interface EmptyStateProps {
  type?: 'no-applications' | 'no-results' | 'no-data' | 'error';
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: string;
}

export function EmptyState({
  type = 'no-data',
  title,
  description,
  actionLabel,
  onAction,
  icon
}: EmptyStateProps): React.ReactElement {
  // Default content based on type
  const getDefaultContent = () => {
    switch (type) {
      case 'no-applications':
        return {
          icon: '📋',
          title: 'No applications found',
          description: 'There are no applications matching your criteria. Try adjusting your filters or search terms.',
        };
      case 'no-results':
        return {
          icon: '🔍',
          title: 'No results found',
          description: 'We couldn\'t find any results for your search. Try different keywords or filters.',
        };
      case 'error':
        return {
          icon: '⚠️',
          title: 'Something went wrong',
          description: 'We encountered an error loading the data. Please try again later.',
        };
      case 'no-data':
      default:
        return {
          icon: '📄',
          title: 'No data available',
          description: 'There is no data to display at this time.',
        };
    }
  };

  const defaultContent = getDefaultContent();
  const displayIcon = icon || defaultContent.icon;
  const displayTitle = title || defaultContent.title;
  const displayDescription = description || defaultContent.description;

  return (
    <div className="empty-state">
      <div className="empty-icon">{displayIcon}</div>
      <h3 className="empty-title">{displayTitle}</h3>
      <p className="empty-description">{displayDescription}</p>
      {actionLabel && onAction && (
        <button className="empty-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
