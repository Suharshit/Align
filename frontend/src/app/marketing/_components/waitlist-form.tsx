'use client';

import { useTransition, useState } from 'react';
import { addToWaitlist } from '@/lib/actions';

interface WaitlistFormProps {
    withInput?: boolean;
}

export function WaitlistForm({ withInput = false }: WaitlistFormProps) {
    const [isPending, startTransition] = useTransition();
    const [email, setEmail] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages

        if (!withInput) {
            document.getElementById('waitlist-section')?.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        if (!email.trim()) {
            setMessage('Please enter an email address.');
            return;
        }

        startTransition(async () => {
            try {
                const result = await addToWaitlist(email);

                if (result.success) {
                    setIsSuccess(true);
                    setShowToast(true);
                    setMessage('');

                    // Hide toast after 3.5 seconds
                    setTimeout(() => setShowToast(false), 3500);
                } else if (result.error && (
                    result.error.includes('Email already exists') ||
                    result.error.includes('duplicate') ||
                    result.error.includes('unique') ||
                    result.error.includes('exists')
                )) {
                    setMessage('You are already on the waitlist.');
                } else {
                    setMessage('Something went wrong. Please try again.');
                }
            } catch (error) {
                setMessage('Something went wrong. Please try again.');
            }
        });
    };

    if (withInput) {
        return (
            <>
                {!isSuccess ? (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (message) setMessage(''); // Clear error on type
                            }}
                            className="bg-transparent border-b border-brand-dark/30 py-2 text-brand-dark placeholder-brand-dark/50 focus:outline-none focus:border-brand-orange transition-colors"
                            disabled={isPending}
                        />
                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-fit px-6 py-3 bg-brand-orange text-white font-medium rounded hover:opacity-90 transition-opacity disabled:opacity-50 mt-4 cursor-pointer"
                        >
                            {isPending ? 'Joining...' : 'Join the Waitlist'}
                        </button>
                        {message && <p className="text-sm text-brand-orange mt-2">{message}</p>}
                    </form>
                ) : (
                    <div className="w-full max-w-lg p-8 border border-brand-dark rounded-xl shadow-sm bg-brand-beige">
                        <p className="text-xl md:text-2xl font-light text-brand-dark">
                            Thank you. We will reach out when the product is ready.
                        </p>
                    </div>
                )}

                {/* Success Toast */}
                {showToast && (
                    <div className="fixed bottom-8 right-8 z-50 bg-brand-beige border border-brand-dark p-6 rounded-lg shadow-lg max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <h4 className="text-lg font-medium text-brand-dark mb-1">Joined</h4>
                        <p className="text-brand-dark/80 font-light">
                            You have been added to the waitlist.
                        </p>
                    </div>
                )}
            </>
        );
    }

    // Default button-only view for Hero
    return (
        <button
            className="px-6 py-3 bg-brand-orange text-white font-medium rounded hover:opacity-90 transition-opacity cursor-pointer"
            type="button"
            onClick={handleSubmit}
        >
            Join the Waitlist
        </button>
    );
}
