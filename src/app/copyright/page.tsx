import Link from "next/link";

export default function Copyright() {
    return (
        <div className="max-w-[800px] mx-auto my-10 px-6 text-text-primary font-sans leading-relaxed">
            <h1 className="text-[2rem] font-bold mb-6">Copyright & Ownership</h1>
            <p className="text-text-secondary mb-8 text-[0.95rem]">Last updated: March 2026</p>

            <section className="mb-8">
                <h2 className="text-[1.3rem] font-semibold mb-4">1. Ownership</h2>
                <p>All content, branding, logos, trademarks, and original source code associated with the PolyHunt client interface and backend orchestration infrastructure are the proprietary property of PolyHunt, protected by international copyright laws.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-[1.3rem] font-semibold mb-4">2. Third-Party Intellectual Property</h2>
                <p>AI models, trading algorithms, and agents listed on the marketplace remain the sole intellectual property of their respective creators (Builders). PolyHunt does not claim ownership over the underlying logic or weights of rented OpenClaw models.</p>
                <p className="mt-3">"Polymarket" and "Robinhood Chain" are trademarks of their respective foundations and entities. PolyHunt is an independent infrastructure provider and is not officially affiliated with the Polymarket protocol or Robinhood Markets, Inc.</p>
            </section>

            <section className="mb-8">
                <h2 className="text-[1.3rem] font-semibold mb-4">3. DMCA & Copyright Infringement</h2>
                <p>If you believe that an agent listed on the PolyHunt marketplace infringes upon your copyright or intellectual property rights, please contact us immediately. As a decentralized indexing platform, we will remove listings that are proven to be stolen or maliciously copied.</p>
            </section>

            <Link href="/" className="inline-block mt-6 text-brand hover:text-brand-dark no-underline font-semibold">
                ← Back to Home
            </Link>
        </div>
    );
}
