import { Navbar } from './_components/navbar';
import { WaitlistForm } from './_components/waitlist-form';

export default function MarketingPage() {
    return (
        <div className="min-h-screen bg-brand-beige text-brand-dark font-sans">
            <Navbar />

            <main className="flex flex-col items-start px-8 pt-32 max-w-7xl mx-auto">
                {/* Hero Headline */}
                <h1 className="text-6xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-8 text-black">
                    Hiring without pretending.
                    <br />
                    Careers without pressure.
                </h1>

                {/* Subtext */}
                <p className="text-lg md:text-xl text-brand-dark/80 max-w-2xl leading-relaxed mb-12">
                    Align is a structured conversation space where
                    <br />
                    intent matters more than performance. No mass
                    <br />
                    applications. No rushed decisions.
                </p>

                {/* Waitlist Form */}
                <WaitlistForm />
            </main>
        </div>
    );
}
