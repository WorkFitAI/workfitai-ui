"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type ProfileTab = "overview" | "settings" | "security";

interface ProfileTabsProps {
    activeTab: ProfileTab;
    onTabChange?: (tab: ProfileTab) => void;
    availableTabs?: ProfileTab[]; // Optional: restrict which tabs to show
}

export default function ProfileTabs({ activeTab, onTabChange, availableTabs }: ProfileTabsProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const allTabs: { id: ProfileTab; label: string; icon: string }[] = [
        { id: "overview", label: "Overview", icon: "fi-rr-user" },
        { id: "settings", label: "Settings", icon: "fi-rr-settings" },
        { id: "security", label: "Security", icon: "fi-rr-shield-check" },
    ];

    // Filter tabs based on availableTabs prop
    const tabs = availableTabs
        ? allTabs.filter(tab => availableTabs.includes(tab.id))
        : allTabs;

    const handleTabClick = (tabId: ProfileTab) => {
        if (onTabChange) {
            onTabChange(tabId);
        }

        // Update URL with tab parameter
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tabId);
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="profile-tabs">
            <div className="nav-tabs-wrapper">
                <ul className="nav nav-tabs" role="tablist">
                    {tabs.map((tab) => (
                        <li key={tab.id} className="nav-item" role="presentation">
                            <button
                                type="button"
                                className={`nav-link ${activeTab === tab.id ? "active" : ""}`}
                                onClick={() => handleTabClick(tab.id)}
                                role="tab"
                                aria-selected={activeTab === tab.id}
                            >
                                <i className={tab.icon}></i>
                                <span>{tab.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
