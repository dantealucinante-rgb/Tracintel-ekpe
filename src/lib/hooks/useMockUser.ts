"use client";

/**
 * Mock Auth Hook
 * Mimics authentication state for local development
 * when SMS gateways or auth providers are unreachable.
 */

export const useMockUser = () => {
    return {
        isLoaded: true,
        isSignedIn: true,
        user: {
            id: 'user_2N9Z8z8j1r5u0v1x2q3w4e5r6t',
            firstName: 'Demo',
            lastName: 'User',
            primaryEmailAddress: {
                emailAddress: 'demo@tracintel.ai'
            },
            imageUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop',
            publicMetadata: {},
        }
    };
};

export const useMockAuth = () => {
    return {
        isLoaded: true,
        isSignedIn: true,
        userId: 'user_2N9Z8z8j1r5u0v1x2q3w4e5r6t',
        orgId: 'org_2N9Z8z8j1r5u0v1x2q3w4e5r6t', // Using a dummy orgId matches our database organization
        getToken: async () => 'mock-token',
        signOut: () => console.log('Mock Sign Out'),
    };
};
