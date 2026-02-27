"use client";

import { useEffect, useRef } from 'react';

export default function Background() {
    const spotlightRef = useRef<HTMLDivElement>(null);

    // Cursor-follow spotlight
    useEffect(() => {
        const el = spotlightRef.current;
        if (!el) return;

        let raf: number;
        let mouseX = -1000;
        let mouseY = -1000;

        const onMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        const tick = () => {
            if (el) {
                el.style.background = `radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(0,122,255,0.045), transparent 70%)`;
            }
            raf = requestAnimationFrame(tick);
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        raf = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(raf);
        };
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">

            {/* ── Layer 1 · Base white ── */}
            <div className="absolute inset-0 bg-[#F8FAFC]" />

            {/* ── Layer 2 · Slow-Moving Mesh Gradient ── */}
            {/* Three radial blobs animate around the viewport over 30s */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Electric Blue tint — top-left */}
                <div className="mesh-blob mesh-blue" />
                {/* Emerald Green tint — bottom-right */}
                <div className="mesh-blob mesh-green" />
                {/* Neutral warm wash — center */}
                <div className="mesh-blob mesh-neutral" />
            </div>

            {/* ── Layer 3 · Technical Dot Grid ── */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    opacity: 0.45,
                }}
            />

            {/* ── Layer 4 · Animated Film Grain ── */}
            <div className="grain-overlay absolute inset-0" />

            {/* ── Layer 5 · Cursor Spotlight ── */}
            <div
                ref={spotlightRef}
                className="absolute inset-0 pointer-events-none transition-none"
            />
        </div>
    );
}
