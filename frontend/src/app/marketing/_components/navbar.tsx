'use client';

import Link from 'next/link';

export function Navbar() {
    const scrollToWaitlist = () => {
        document.getElementById('waitlist-section')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <nav className="flex items-center justify-between py-6 px-1 max-w-7xl mx-auto">
            <Link href="/marketing" className="text-2xl font-bold font-logo text-brand-dark">
                Align
            </Link>
            <button
                onClick={scrollToWaitlist}
                className="px-5 py-2 bg-brand-orange text-white text-sm font-medium rounded hover:opacity-90 transition-opacity cursor-pointer"
            >
                Join the Waitlist
            </button>
        </nav>
    );
}
