/**
 * Utility functions for avatar handling
 */

/**
 * Generate initials from username (first character only)
 *
 * Examples:
 * - "killig3110" → "K"
 * - "john_doe"   → "J"
 * - "Alice"      → "A"
 * - "" / null    → "?"
 */
export function getInitials(
    username?: string | null
): string {
    if (!username) return "?";

    const trimmed = username.trim();
    if (!trimmed) return "?";

    return trimmed.charAt(0).toUpperCase();
}

/**
 * Generate a consistent background color from a string
 * Uses a simple hash to pick from a predefined color palette
 */
export function getAvatarColor(
    name?: string | null
): string {
    const colors = [
        "#FF6B6B", // Red
        "#4ECDC4", // Teal
        "#45B7D1", // Blue
        "#FFA07A", // Orange
        "#98D8C8", // Mint
        "#F7DC6F", // Yellow
        "#BB8FCE", // Purple
        "#85C1E9", // Light Blue
        "#F8B739", // Gold
        "#52C41A", // Green
    ];

    if (!name) return colors[0];

    const trimmed = name.trim();
    if (!trimmed) return colors[0];

    // Simple deterministic hash
    let hash = 0;
    for (let i = 0; i < trimmed.length; i++) {
        hash = trimmed.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
}
