import Link from 'next/link';

export function Navbar() {
    return (
        <nav className="flex items-center justify-between py-6 px-8 max-w-7xl mx-auto">
            <Link href="/marketing" className="text-2xl font-bold font-logo text-brand-dark">
                Align
            </Link>
            <button className="px-5 py-2 bg-brand-orange text-white text-sm font-medium rounded hover:opacity-90 transition-opacity">
                Join the Waitlist
            </button>
        </nav>
    );
}
