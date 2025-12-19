"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Client, StompSubscription } from "@stomp/stompjs";
import SockJS from "sockjs-client";
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
     * Subscribe to a destination
     */
    const subscribe = useCallback(
        (destination: string, callback: (message: any) => void) => {
            if (!clientRef.current?.connected) {
                console.warn(`WebSocket not connected. Queuing subscription to ${destination}`);
                return;
            }

            // Unsubscribe from existing subscription if any
            const existingSubscription = subscriptionsRef.current.get(destination);
            if (existingSubscription) {
                existingSubscription.unsubscribe();
            }

            // Create new subscription
            const subscription = clientRef.current.subscribe(destination, (message) => {
                try {
                    const body = JSON.parse(message.body);
                    callback(body);
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                    callback(message.body);
                }
            });

            subscriptionsRef.current.set(destination, subscription);
            console.log(`[WebSocket] Subscribed to ${destination}`);
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
        if (!token) {
            console.warn("[WebSocket] No authentication token available, skipping connection");
            setStatus("error");
            return;
        }

        console.log("[WebSocket] Connecting to", WEBSOCKET_URL);
        setStatus("connecting");

        // Create STOMP client
        const client = new Client({
            webSocketFactory: () => new SockJS(WEBSOCKET_URL),
            connectHeaders: {
                Authorization: `Bearer ${token}`,
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
                if (!mountedRef.current) return;

                console.log("[WebSocket] Connected successfully");
                setStatus("connected");
                onConnect?.();

                // Re-subscribe to all destinations after reconnect
                const destinations = Array.from(subscriptionsRef.current.keys());
                subscriptionsRef.current.clear();
                destinations.forEach((dest) => {
                    // We need to re-establish subscriptions but don't have callbacks here
                    // The actual subscriptions will be re-created by the useNotifications hook
                });
            },

            onDisconnect: () => {
                if (!mountedRef.current) return;

                console.log("[WebSocket] Disconnected");
                setStatus("disconnected");
                onDisconnect?.();
            },

            onStompError: (frame) => {
                if (!mountedRef.current) return;

                console.error("[WebSocket] STOMP error:", frame.headers["message"]);
                console.error("[WebSocket] Error details:", frame.body);
                setStatus("error");
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
                if (!mountedRef.current) return;

                console.error("[WebSocket] Connection error:", event);
                setStatus("error");
                onError?.(event);
            },
        });

        clientRef.current = client;
        client.activate();
    }, [getAuthToken, onConnect, onDisconnect, onError]);

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

    // Auto-connect on mount
    useEffect(() => {
        if (autoConnect) {
            connect();
        }

        return () => {
            mountedRef.current = false;
            disconnect();
        };
    }, [autoConnect, connect, disconnect]);

    // Reconnect when token changes (e.g., token refresh)
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "accessToken" && e.newValue) {
                console.log("[WebSocket] Token refreshed, reconnecting...");
                disconnect();
                setTimeout(() => {
                    if (mountedRef.current) {
                        connect();
                    }
                }, 1000);
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [connect, disconnect]);

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
