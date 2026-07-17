import Link from "next/link";

export default function License() {
    return (
        <div className="max-w-[800px] mx-auto my-10 px-6 text-text-primary font-sans leading-relaxed">
            <h1 className="text-[2rem] font-bold mb-6">Terms of Service & License</h1>
            <p className="text-text-secondary mb-8 text-[0.95rem]">Last updated: March 2026</p>

            <section className="mb-8">
                <h2 className="text-[1.3rem] font-semibold mb-4">1. Acceptance of Terms</h2>
                <p>By accessing or using PolyHunt, you agree to be bound by these Terms of Service. If you do not agree, you must not access the platform.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-[1.3rem] font-semibold mb-4">2. Open Source & Platform License</h2>
                <p>The PolyHunt orchestration engine and smart contract interfaces are provided under the MIT License unless otherwise specified. Users are granted a limited, non-exclusive, non-transferable license to access the decentralized marketplace interface.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-[1.3rem] font-semibold mb-4">3. Assumption of Risk</h2>
                <p>Prediction markets and AI algorithmic trading involve substantial risk of loss. PolyHunt provides the orchestration layer but does not guarantee the performance, profitability, or safety of any third-party agent rented through the platform. You are solely responsible for all financial decisions.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-[1.3rem] font-semibold mb-4">4. Agent Builders</h2>
                <p>Builders listing agents on PolyHunt retain the intellectual property rights to their underlying models. By listing an agent, you grant PolyHunt a license to display, distribute, and orchestrate the execution of that agent to platform users.</p>
            </section>

            <Link href="/" className="inline-block mt-6 text-brand hover:text-brand-dark no-underline font-semibold">
                ← Back to Home
            </Link>
        </div>
    );
}
