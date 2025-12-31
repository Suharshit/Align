import { Navbar } from './_components/navbar';
import { WaitlistForm } from './_components/waitlist-form';

export default function MarketingPage() {
    return (
        <div className="h-screen w-full overflow-y-scroll snap-y snap-mandatory bg-brand-beige text-brand-dark font-sans scroll-smooth">

            {/* SECTION 1: Hero */}
            <section className="relative min-h-screen w-full snap-start flex flex-col px-8 max-w-7xl mx-auto pt-24 md:pt-0">
                <div className="absolute top-0 left-0 w-full mt-6 px-8 box-border z-10">
                    <Navbar />
                </div>

                <div className="flex-1 flex flex-col justify-center items-start pb-20">
                    {/* Hero Headline */}
                    <h1 className="text-6xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-8 text-black">
                        Hiring without pretending.
                        <br />
                        Careers without pressure.
                    </h1>

                    {/* Subtext */}
                    <p className="text-lg md:text-xl text-brand-dark/80 max-w-2xl leading-relaxed mb-4">
                        Align is a calm space where students and founders clarify intent before hiring conversations begin.
                    </p>
                    <p className="text-lg md:text-xl text-brand-dark/80 max-w-2xl leading-relaxed mb-12">
                        No resumes. No mass applications. Conversation is earned — not rushed.
                    </p>

                    {/* Waitlist Form */}
                    <WaitlistForm />
                </div>
            </section>

            {/* SECTION 2: Comparison */}
            {/* SECTION 2: Comparison */}
            <section className="min-h-screen w-full snap-start flex flex-col justify-center px-8 bg-brand-beige max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-12 w-full">
                    {/* For Students */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-brand-orange text-sm tracking-wider uppercase font-medium">
                            For Students
                        </h3>
                        <p className="text-xl md:text-3xl text-brand-dark leading-snug font-light">
                            You’re expected to sound confident before you’re clear. You apply broadly, perform constantly, and hope speed will compensate for fit. Align gives you space to slow down — to express what you want to learn, what kind of work excites you, and what environments help you grow before entering a hiring conversation.
                        </p>
                    </div>

                    {/* For Founders */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-brand-orange text-sm tracking-wider uppercase font-medium">
                            For Founders
                        </h3>
                        <p className="text-xl md:text-3xl text-brand-dark leading-snug font-light">
                            You review polished resumes that reveal very little. Misalignment shows up later — in onboarding, training, and churn. Align helps you see intent early: what someone wants to work on, how they think about growth, and whether the direction actually fits before investing your time.
                        </p>
                    </div>
                </div>
            </section>

            {/* SECTION 3: Philosophy */}
            {/* SECTION 3: Philosophy */}
            <section className="min-h-screen w-full snap-start flex flex-col justify-center bg-brand-dark text-white">
                <div className="max-w-7xl mx-auto w-full flex flex-col gap-2 px-8">
                    <p className="text-3xl md:text-5xl font-medium leading-tight">
                        Clarity before conversation.
                    </p>
                    <p className="text-3xl md:text-5xl font-medium leading-tight">
                        Intent before evaluation.
                    </p>
                    <p className="text-3xl md:text-5xl font-medium leading-tight">
                        Structure before speed.
                    </p>
                    <p className="text-3xl md:text-5xl font-medium leading-tight">
                        Alignment before volume.
                    </p>
                </div>
            </section>

            {/* SECTION 4: value + Waitlist */}
            <section id="waitlist-section" className="relative min-h-screen w-full snap-start flex flex-col justify-center px-8 bg-brand-beige text-brand-dark max-w-7xl mx-auto">
                <div className="w-full max-w-2xl flex flex-col gap-16">

                    {/* What Align Is */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-4xl md:text-5xl font-medium mb-4">
                            What Align Is
                        </h2>
                        <div className="flex flex-col gap-4 text-xl md:text-2xl font-light text-brand-dark/80">
                            <p>Not a job board.</p>
                            <p>Not a fast-hiring platform.</p>
                            <p>
                                A calm system that helps students and founders
                                <br />
                                clarify intent <span className="font-medium text-brand-dark">before</span> hiring conversations begin.
                            </p>
                            <p>
                                Designed to reduce noise early —
                                <br />
                                so conversations happen only when they matter.
                            </p>
                        </div>
                    </div>

                    {/* Waitlist Form Block */}
                    <div className="flex flex-col gap-6">
                        <h3 className="text-2xl md:text-3xl font-medium">
                            Join the Waitlist
                        </h3>

                        <WaitlistForm withInput={true} />

                        <p className="text-xs text-brand-dark/50 mt-2">
                            No Spam. No pressure. Updates only when the product is ready.
                        </p>
                    </div>

                </div>

                {/* Footer */}
                <div className="absolute bottom-10 left-0 w-full px-8">
                    <div className="max-w-7xl mx-auto border-t border-brand-dark/10 pt-8 text-sm text-brand-dark/40 font-light">
                        Built Slowly. © Align
                    </div>
                </div>
            </section>

        </div>
    );
}
