"use client";

import { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
    term: string;
    explanation: string;
    className?: string;
}

/**
 * InfoTooltip – renders an inline ⓘ icon that reveals a brief explanation
 * of a technical term on hover. Pure CSS / Tailwind, no external deps.
 */
export function InfoTooltip({ term, explanation, className = '' }: InfoTooltipProps) {
    const [visible, setVisible] = useState(false);

    return (
        <span className={`inline-flex items-center gap-1 ${className}`}>
            <span>{term}</span>
            <span
                className="relative inline-flex items-center cursor-help"
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
                onFocus={() => setVisible(true)}
                onBlur={() => setVisible(false)}
                tabIndex={0}
                role="button"
                aria-label={`Explanation for ${term}`}
            >
                <Info className="h-3 w-3 text-zinc-400 hover:text-zinc-600 transition-colors" />

                {visible && (
                    <span
                        className="
              absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2
              w-56 px-3 py-2
              bg-white border border-zinc-200 rounded-xl
              shadow-lg shadow-zinc-200/60
              text-[11px] text-zinc-600 font-normal leading-relaxed
              pointer-events-none
            "
                    >
                        {explanation}
                        {/* Arrow */}
                        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-200" />
                    </span>
                )}
            </span>
        </span>
    );
}

export default InfoTooltip;
