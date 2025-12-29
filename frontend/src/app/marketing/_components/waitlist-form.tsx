'use client';

// Input temporarily removed to match the static design request.
// Will likely implement a modal or expand transition later.

export function WaitlistForm() {
    return (
        <button
            className="px-6 py-3 bg-brand-orange text-white font-medium rounded hover:opacity-90 transition-opacity"
            type="button"
            onClick={() => alert("Waitlist form coming soon!")}
        >
            Join the Waitlist
        </button>
    );
}
