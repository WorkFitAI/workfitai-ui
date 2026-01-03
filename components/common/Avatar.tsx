import React, { useState } from "react";
import { getInitials, getAvatarColor } from "@/util/avatarUtils";

interface AvatarProps {
    src?: string | null;
    alt?: string;
    username?: string | null;
    size?: number;
    className?: string;
}

/**
 * Avatar component with fallback to initials
 * - If src is valid → show image
 * - If src is missing or error → show initials with background color
 */
export default function Avatar({
    src,
    alt = "Avatar",
    username = null,
    size = 40,
    className = "",
}: AvatarProps) {
    const [imageError, setImageError] = useState(false);

    const showInitials = !src || imageError;
    const displayText = username || alt;

    if (showInitials) {
        const initials = getInitials(displayText);
        const bgColor = getAvatarColor(displayText);

        return (
            <div
                title={alt}
                className={`avatar-initials ${className}`}
                style={{
                    width: size,
                    height: size,
                    backgroundColor: bgColor,
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "50%",
                    fontSize: size * 0.4,
                    fontWeight: 600,
                    flexShrink: 0,
                    textTransform: "uppercase",
                    userSelect: "none",
                }}
            >
                {initials}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            title={alt}
            className={className}
            onError={() => setImageError(true)}
            style={{
                width: size,
                height: size,
                borderRadius: "50%",
                objectFit: "cover",
                flexShrink: 0,
            }}
        />
    );
}
