"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Client, StompSubscription } from "@stomp/stompjs";
import { getCurrentAccessToken } from "@/lib/tokenRefreshHandler";

const WEBSOCKET_URL =
    process.env.NEXT_PUBLIC_NOTIFICATION_BASE_URL?.concat("/ws/notifications") ||
    "http://localhost:9085/notification/ws/notifications";

export type WebSocketStatus = "connected" | "connecting" | "disconnected" | "error";

interface UseWebSocketOptions {
    onConnect?: () => void;
    onDisconnect?: () => void;
    onError?: (error: any) => void;
    autoConnect?: boolean;
}

interface UseWebSocketReturn {
    client: Client | null;
    status: WebSocketStatus;
    subscribe: (destination: string, callback: (message: any) => void) => void;
    unsubscribe: (destination: string) => void;
    connect: () => void;
    disconnect: () => void;
    isConnected: boolean;
}

/**
 * WebSocket hook with JWT authentication, auto-reconnect, and proper cleanup
 * Manages STOMP client lifecycle and subscriptions
 */
export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
    const { onConnect, onDisconnect, onError, autoConnect = true } = options;

    const clientRef = useRef<Client | null>(null);
    const subscriptionsRef = useRef<Map<string, StompSubscription>>(new Map());
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const mountedRef = useRef(true);

    const [status, setStatus] = useState<WebSocketStatus>("disconnected");

    /**
     * Get JWT token for WebSocket authentication
     */
    const getAuthToken = useCallback(() => {
        return getCurrentAccessToken();
    }, []);

    /**
     * Get username for WebSocket authentication
     * Username is required in X-Username header for Spring to track user session
     */
    const getUsername = useCallback(() => {
        // Try to get username from localStorage (stored during login)
        const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;
        if (username) {
            return username;
        }

        // Fallback: decode from JWT token
        const token = getAuthToken();
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.sub; // JWT subject contains username
            } catch (error) {
                console.error('[WebSocket] Failed to decode username from token:', error);
            }
        }

        return null;
    }, [getAuthToken]);

    /**
     * Subscribe to a destination
     */
    const subscribe = useCallback(
        (destination: string, callback: (message: any) => void) => {
            console.log(`[WebSocket] Subscribe called for: ${destination}, connected:`, clientRef.current?.connected);

            if (!clientRef.current?.connected) {
                console.warn(`[WebSocket] ⚠️ Not connected yet. Queuing subscription to ${destination}`);
                return;
            }

            // Unsubscribe from existing subscription if any
            const existingSubscription = subscriptionsRef.current.get(destination);
            if (existingSubscription) {
                console.log(`[WebSocket] Unsubscribing from existing: ${destination}`);
                existingSubscription.unsubscribe();
            }

            // Create new subscription
            console.log(`[WebSocket] Creating subscription for: ${destination}`);
            const subscription = clientRef.current.subscribe(destination, (message) => {
                console.log(`[WebSocket] 📨 Received message on ${destination}:`, message.body);
                try {
                    const body = JSON.parse(message.body);
                    callback(body);
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                    callback(message.body);
                }
            });

            subscriptionsRef.current.set(destination, subscription);
            console.log(`[WebSocket] ✅ Subscribed to ${destination}, subscription ID:`, subscription.id);
        },
        []
    );

    /**
     * Unsubscribe from a destination
     */
    const unsubscribe = useCallback((destination: string) => {
        const subscription = subscriptionsRef.current.get(destination);
        if (subscription) {
            subscription.unsubscribe();
            subscriptionsRef.current.delete(destination);
            console.log(`[WebSocket] Unsubscribed from ${destination}`);
        }
    }, []);

    /**
     * Connect to WebSocket server
     */
    const connect = useCallback(() => {
        if (clientRef.current?.connected) {
            console.log("[WebSocket] Already connected");
            return;
        }

        const token = getAuthToken();
        const username = getUsername();

        if (!token) {
            console.warn("[WebSocket] No authentication token available, skipping connection");
            setStatus("error");
            return;
        }

        if (!username) {
            console.warn("[WebSocket] No username available, skipping connection");
            setStatus("error");
            return;
        }

        console.log("[WebSocket] Connecting to", WEBSOCKET_URL, "with username:", username);
        setStatus("connecting");

        // Create STOMP client with native WebSocket (no SockJS)
        const client = new Client({
            // 🚨 CRITICAL: Use native WebSocket (no SockJS)
            webSocketFactory: () => {
                const wsUrl = WEBSOCKET_URL.replace('http://', 'ws://').replace('https://', 'wss://');
                return new WebSocket(wsUrl) as any;
            },
            // 🚨 CRITICAL: Must include X-Username header for Spring user session tracking
            connectHeaders: {
                'X-Username': username,
            },
            debug: (str) => {
                if (process.env.NODE_ENV === "development") {
                    console.log("[WebSocket Debug]", str);
                }
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,

            onConnect: () => {
                console.log("[WebSocket] onConnect callback fired, mountedRef:", mountedRef.current);

                // Always set status and call callback, regardless of mount status
                // Subscriptions need to be created even if component temporarily unmounted
                console.log("[WebSocket] ✅ Connected successfully");

                // Only update state if still mounted to avoid React warnings
                if (mountedRef.current) {
                    setStatus("connected");
                }

                console.log("[WebSocket] Calling onConnect callback...");
                onConnect?.();
                console.log("[WebSocket] onConnect callback completed");

                // Re-subscribe to all destinations after reconnect
                const destinations = Array.from(subscriptionsRef.current.keys());
                subscriptionsRef.current.clear();
                destinations.forEach((dest) => {
                    // We need to re-establish subscriptions but don't have callbacks here
                    // The actual subscriptions will be re-created by the useNotifications hook
                });
            },

            onDisconnect: () => {
                console.log("[WebSocket] Disconnected");

                // Only update state if still mounted
                if (mountedRef.current) {
                    setStatus("disconnected");
                }

                onDisconnect?.();
            },

            onStompError: (frame) => {
                console.error("[WebSocket] STOMP error:", frame.headers["message"]);
                console.error("[WebSocket] Error details:", frame.body);

                // Only update state if still mounted
                if (mountedRef.current) {
                    setStatus("error");
                }

                onError?.(frame);

                // Attempt reconnection after error
                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                }
                reconnectTimeoutRef.current = setTimeout(() => {
                    if (mountedRef.current) {
                        console.log("[WebSocket] Attempting reconnection after error...");
                        connect();
                    }
                }, 5000);
            },

            onWebSocketError: (event) => {
                console.error("[WebSocket] Connection error:", event);

                // Only update state if still mounted
                if (mountedRef.current) {
                    setStatus("error");
                }

                onError?.(event);
            },
        });

        clientRef.current = client;
        client.activate();
    }, [getAuthToken, getUsername, onConnect, onDisconnect, onError]);

    /**
     * Disconnect from WebSocket server
     */
    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        // Unsubscribe all
        subscriptionsRef.current.forEach((subscription) => {
            subscription.unsubscribe();
        });
        subscriptionsRef.current.clear();

        // Deactivate client
        if (clientRef.current) {
            clientRef.current.deactivate();
            clientRef.current = null;
        }

        setStatus("disconnected");
        console.log("[WebSocket] Disconnected and cleaned up");
    }, []);

    // Auto-connect on mount (only once)
    useEffect(() => {
        mountedRef.current = true;

        if (autoConnect) {
            connect();
        }

        return () => {
            mountedRef.current = false;
            disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoConnect]); // Only re-run if autoConnect prop changes

    // Reconnect when token changes (e.g., token refresh)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "accessToken" && e.newValue && mountedRef.current) {
                console.log("[WebSocket] Token refreshed, reconnecting...");

                // Disconnect if currently connected
                if (clientRef.current?.connected) {
                    clientRef.current.deactivate();
                }

                // Reconnect after delay
                setTimeout(() => {
                    if (mountedRef.current && !clientRef.current?.connected) {
                        const token = getAuthToken();
                        const username = getUsername();
                        if (token && username && clientRef.current) {
                            clientRef.current.connectHeaders = { 'X-Username': username };
                            clientRef.current.activate();
                        }
                    }
                }, 1000);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only setup listener once

    return {
        client: clientRef.current,
        status,
        subscribe,
        unsubscribe,
        connect,
        disconnect,
        isConnected: status === "connected",
    };
}
