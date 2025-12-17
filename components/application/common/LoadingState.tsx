"use client";

import React from 'react';

// Table Skeleton Loader
export function TableLoadingState({ rows = 5, columns = 6 }: { rows?: number; columns?: number }): React.ReactElement {
  return (
    <div className="application-table-wrapper">
      <div className="table-toolbar">
        <div className="skeleton-loader" style={{ width: '150px', height: '20px' }}></div>
        <div className="skeleton-loader" style={{ width: '100px', height: '32px' }}></div>
      </div>
      <table className="application-table">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i}>
                <div className="skeleton-loader" style={{ width: '80px', height: '16px' }}></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex}>
                  <div className="skeleton-loader" style={{ width: '100%', height: '20px' }}></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Generic Loading State with Spinner
export function LoadingState({ text = 'Loading...' }: { text?: string }): React.ReactElement {
  return (
    <div className="loading-state">
      <div className="spinner"></div>
      <div className="loading-text">{text}</div>
    </div>
  );
}

// Card Skeleton Loader
export function CardLoadingState(): React.ReactElement {
  return (
    <div className="card">
      <div className="card-body">
        <div className="skeleton-loader" style={{ width: '60%', height: '24px', marginBottom: '16px' }}></div>
        <div className="skeleton-loader" style={{ width: '100%', height: '16px', marginBottom: '12px' }}></div>
        <div className="skeleton-loader" style={{ width: '100%', height: '16px', marginBottom: '12px' }}></div>
        <div className="skeleton-loader" style={{ width: '80%', height: '16px' }}></div>
      </div>
    </div>
  );
}

// List Skeleton Loader
export function ListLoadingState({ items = 3 }: { items?: number }): React.ReactElement {
  return (
    <div>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} style={{ marginBottom: '16px', padding: '16px', background: 'white', borderRadius: '8px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="skeleton-loader" style={{ width: '48px', height: '48px', borderRadius: '50%' }}></div>
            <div style={{ flex: 1 }}>
              <div className="skeleton-loader" style={{ width: '60%', height: '16px', marginBottom: '8px' }}></div>
              <div className="skeleton-loader" style={{ width: '40%', height: '14px' }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingState;
