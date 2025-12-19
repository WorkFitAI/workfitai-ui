export interface GeolocationData {
    latitude: number;
    longitude: number;
    accuracy?: number;
}

/**
 * Get user's current geolocation using browser Geolocation API
 * Returns null if permission is denied or not available
 */
export const getUserGeolocation = (): Promise<GeolocationData | null> => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            console.warn("Geolocation is not supported by this browser");
            resolve(null);
            return;
        }

        const timeoutId = setTimeout(() => {
            console.warn("Geolocation request timed out");
            resolve(null);
        }, 10000); // 10 second timeout

        navigator.geolocation.getCurrentPosition(
            (position) => {
                clearTimeout(timeoutId);
                resolve({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                });
            },
            (error) => {
                clearTimeout(timeoutId);
                console.warn("Geolocation error:", error.message);
                // Don't block login if geolocation fails
                resolve(null);
            },
            {
                enableHighAccuracy: false,
                timeout: 8000,
                maximumAge: 300000, // Cache for 5 minutes
            }
        );
    });
};

/**
 * Convert coordinates to approximate location string using reverse geocoding
 * This is optional and requires an external API
 */
export const getLocationFromCoords = async (
    lat: number,
    lng: number
): Promise<string | null> => {
    try {
        // Using OpenStreetMap Nominatim (free, no API key required)
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            {
                headers: {
                    "User-Agent": "WorkfitAI",
                },
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        const address = data.address;

        if (address) {
            const parts = [
                address.city || address.town || address.village,
                address.state,
                address.country,
            ].filter(Boolean);

            return parts.join(", ");
        }

        return null;
    } catch (error) {
        console.warn("Failed to get location from coordinates:", error);
        return null;
    }
};
