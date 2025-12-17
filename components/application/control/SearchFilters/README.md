# SearchFilters Component

Professional search and filter UI for application management. Includes quick status filters, advanced multi-filter panel, and URL state persistence.

## Quick Start

```typescript
import SearchFilters from '@/components/application/control/SearchFilters';

function MyPage() {
  const handleFiltersChange = (filters) => {
    console.log('Filters changed:', filters);
    // Fetch data with new filters
  };

  return (
    <SearchFilters
      onFiltersChange={handleFiltersChange}
      counts={{ APPLIED: 12, REVIEWING: 8, INTERVIEW: 5 }}
    />
  );
}
```

## Props

### SearchFilters

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onFiltersChange` | `(filters: SearchFilterState) => void` | Yes | Callback when any filter changes |
| `counts` | `Partial<Record<ApplicationStatus, number>>` | No | Count badges for quick filters |
| `availableJobs` | `JobOption[]` | No | Jobs list for advanced filters |
| `availableAssignees` | `AssigneeOption[]` | No | Assignees list for advanced filters |
| `showAdvancedByDefault` | `boolean` | No | Start with advanced panel open |

### SearchFilterState

```typescript
interface SearchFilterState {
  searchText: string;                           // Search query
  status: ApplicationStatus | null;             // Single status (from quick filter)
  statuses: ApplicationStatus[];                // Multiple statuses (from advanced)
  jobIds: string[];                            // Selected job IDs
  assignedTo: string | null;                   // Selected assignee username
  dateRange: { from: string; to: string } | null; // Date range filter
}
```

### JobOption

```typescript
interface JobOption {
  id: string;
  title: string;
  companyName: string;
}
```

### AssigneeOption

```typescript
interface AssigneeOption {
  username: string;
  name: string;
}
```

## Features

### Quick Filters
- Pre-defined status chips (All, New, Reviewing, Interview, Offer, Hired)
- Count badges showing applications per status
- Single-click status filtering
- Visual active state with status colors

### Search Bar
- Text search with icon
- Clear button when text present
- Form submission (press Enter)
- Placeholder guidance

### Advanced Filters
- Multi-status selection (checkboxes)
- Date range picker (from/to)
- Job multi-select (scrollable list)
- Assigned-to dropdown
- Active filter count badge
- Apply/Reset buttons

### URL State Sync
All filters automatically sync to URL query parameters:
- `?search=text` - Search query
- `?status=REVIEWING` - Selected status
- `?jobIds=id1,id2` - Selected jobs
- `?assignedTo=username` - Assignee filter
- `?fromDate=2024-01-01&toDate=2024-12-31` - Date range

Benefits:
- Shareable URLs
- Browser back/forward support
- Bookmarkable searches
- Deep linking

## Usage Examples

### Basic Usage

```typescript
import SearchFilters from '@/components/application/control/SearchFilters';
import { useState } from 'react';

function ApplicationsPage() {
  const [applications, setApplications] = useState([]);

  const handleFiltersChange = async (filters) => {
    // Build API query from filters
    const params = {
      searchText: filters.searchText,
      status: filters.status,
      jobIds: filters.jobIds,
      assignedTo: filters.assignedTo,
      fromDate: filters.dateRange?.from,
      toDate: filters.dateRange?.to,
    };

    // Fetch applications
    const response = await searchApplications(params);
    setApplications(response.items);
  };

  return (
    <div>
      <SearchFilters onFiltersChange={handleFiltersChange} />
      {/* Application list */}
    </div>
  );
}
```

### With Redux Integration

```typescript
import SearchFilters from '@/components/application/control/SearchFilters';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { setFilters, fetchApplications } from '@/redux/features/application/applicationSlice';

function ApplicationsPage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.application.filters);

  const handleFiltersChange = (newFilters) => {
    // Update Redux state
    dispatch(setFilters(newFilters));

    // Fetch applications (async thunk)
    dispatch(fetchApplications(newFilters));
  };

  return (
    <SearchFilters
      onFiltersChange={handleFiltersChange}
      // Optional: populate from API
      counts={{
        APPLIED: 12,
        REVIEWING: 8,
        INTERVIEW: 5,
        OFFER: 3,
        HIRED: 15
      }}
    />
  );
}
```

### With Job and Assignee Lists

```typescript
import SearchFilters from '@/components/application/control/SearchFilters';
import { useEffect, useState } from 'react';

function ApplicationsPage() {
  const [jobs, setJobs] = useState([]);
  const [assignees, setAssignees] = useState([]);

  useEffect(() => {
    // Fetch jobs for filter dropdown
    fetchJobs().then(data =>
      setJobs(data.map(j => ({
        id: j.id,
        title: j.title,
        companyName: j.companyName
      })))
    );

    // Fetch team members for assignee filter
    fetchTeamMembers().then(data =>
      setAssignees(data.map(m => ({
        username: m.username,
        name: m.fullName
      })))
    );
  }, []);

  return (
    <SearchFilters
      onFiltersChange={handleFiltersChange}
      availableJobs={jobs}
      availableAssignees={assignees}
    />
  );
}
```

### With Advanced Panel Open by Default

```typescript
<SearchFilters
  onFiltersChange={handleFiltersChange}
  showAdvancedByDefault={true}
/>
```

## Styling

The component uses the application design system from `_application-variables.scss`. All colors, spacing, and typography follow the design tokens.

### CSS Classes (for custom styling)

If you need to override styles:

```scss
// Override search bar button color
.search-bar__button {
  background: your-custom-color !important;
}

// Override filter chip active state
.filter-chip.active {
  background: your-custom-color !important;
}

// Override advanced panel background
.advanced-filters {
  background: your-custom-color !important;
}
```

## Accessibility

- All interactive elements keyboard accessible (Tab navigation)
- ARIA labels on all buttons and inputs
- Screen reader friendly
- Focus indicators on all focusable elements
- Color contrast WCAG AA compliant
- Touch targets minimum 44x44px

### Keyboard Shortcuts

- `Tab` - Navigate between elements
- `Enter` - Submit search, activate buttons
- `Space` - Toggle checkboxes, activate buttons
- `Escape` - Close advanced panel (future enhancement)

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari iOS 14+
- Chrome Android

## Performance

- No external dependencies
- Minimal re-renders (useCallback optimization)
- Inline SVG icons (no icon font)
- CSS-only animations
- Tree-shakeable exports

## TypeScript

Fully typed with TypeScript strict mode. Import types from the component:

```typescript
import SearchFilters, { SearchFilterState } from '@/components/application/control/SearchFilters';
import type { ApplicationStatus } from '@/types/application/application';
```

## Testing

Example unit test:

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import SearchFilters from './index';

test('calls onFiltersChange when search submitted', () => {
  const mockOnChange = jest.fn();
  render(<SearchFilters onFiltersChange={mockOnChange} />);

  const input = screen.getByPlaceholderText(/search/i);
  fireEvent.change(input, { target: { value: 'test query' } });

  const searchButton = screen.getByText(/search/i);
  fireEvent.click(searchButton);

  expect(mockOnChange).toHaveBeenCalledWith(
    expect.objectContaining({ searchText: 'test query' })
  );
});
```

## Troubleshooting

### Filters not updating URL
- Ensure you're using Next.js App Router (not Pages Router)
- Check that `useRouter` and `useSearchParams` are imported from `next/navigation`
- Verify component is marked with `"use client"`

### Advanced panel not showing jobs/assignees
- Check that `availableJobs` and `availableAssignees` props are passed
- Verify data format matches `JobOption[]` and `AssigneeOption[]` interfaces
- Check browser console for TypeScript errors

### Styles not applying
- Verify SCSS compiled: run `npm run sass`
- Check that `style.css` is imported in layout
- Inspect element to verify CSS classes present

### URL params not persisting on page reload
- This is expected - URL params are read on mount
- For persistent filters, add localStorage or Redux persistence

## License

Private - WorkfitAI
