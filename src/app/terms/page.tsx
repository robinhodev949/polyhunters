import Link from "next/link";

export default function TermsOfService() {
    return (
        <div className="max-w-[800px] mx-auto my-10 px-6 text-text-primary font-sans leading-relaxed">
            <h1 className="text-[2.5rem] font-bold mb-2">Terms of Service</h1>
            <p className="text-text-secondary mb-10 text-[0.95rem]">Effective Date: March 20, 2026</p>

            <section className="mb-8">
                <p>
                    These Terms of Service ("Terms") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and PolyHunt ("we," "us," or "our"), concerning your access to and use of the polyhunt.xyz website as well as any other media form, media channel, mobile website, or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-[1.4rem] font-bold mb-4 text-text-primary">1. Disclaimer of Financial Liability</h2>
                <p>
                    PolyHunt is a decentralized application marketplace that aggregates autonomous AI software ("Agents") built by independent, third-party developers on top of various agent frameworks. PolyHunt does not create, warrant, or verify the efficacy, safety, or profitability of these autonomous agents.
                </p>
                <p className="mt-3 bg-error/5 text-error border border-error/20 p-4 rounded-lg font-semibold">
                    YOU ACKNOWLEDGE AND AGREE THAT ANY USE OF AUTONOMOUS AGENTS TO EXECUTE TRADES, BETS, OR FINANCIAL TRANSACTIONS ON PREDICTION MARKETS IS STRICTLY AT YOUR OWN FINANCIAL RISK. WE ARE NOT LIABLE FOR ANY FINANCIAL LOSSES, FAILED TRADES, OR SMART CONTRACT BUGS YOU MAY INCUR.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-[1.4rem] font-bold mb-4 text-text-primary">2. Decentralized Authentication</h2>
                <p>
                    By connecting your EVM wallet to the Site, you represent and warrant that you are the lawful owner of that wallet. You are entirely responsible for maintaining the confidentiality and strict security of your private keys and seed phrases on Robinhood Chain L2. Under no circumstances will PolyHunt request your private key, nor do we have access to it or the power to recover lost funds.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-[1.4rem] font-bold mb-4 text-text-primary">3. Prohibited Activities</h2>
                <p>
                    You may not access or use the Site for any purpose other than that for which we make the Site available. As a user of the Site, you agree not to:
                </p>
                <ul className="pl-6 mt-2">
                    <li className="mb-2">Systematically retrieve data or content from the Site to create or compile a collection, compilation, database, or directory without written permission.</li>
                    <li className="mb-2">Use the platform to launch malicious smart contracts, scam tokens, or sybil attacks against prediction markets.</li>
                    <li className="mb-2">Upload or transmit viruses, Trojan horses, or other material that interferes with any party's uninterrupted use and enjoyment of the Site.</li>
                    <li className="mb-2">Attempt to bypass any measures of the Site designed to prevent or restrict access to the Site or any RPC node infrastructure.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-[1.4rem] font-bold mb-4 text-text-primary">4. Modifications and Interruptions</h2>
                <p>
                    We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We cannot guarantee the Site will be available at all times, as decentralized networks (like Robinhood Chain) may experience downtime outside of our control.
                </p>
            </section>

            <section className="mb-8 p-6 bg-bg-primary border border-border rounded-xl">
                <h2 className="text-[1.3rem] font-bold mb-3 text-text-primary">5. Contact Information</h2>
                <p className="m-0">
                    In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:<br /><br />
                    <strong>PolyHunt Administration</strong><br />
                    Email: legal@polyhunt.xyz
                </p>
            </section>

            <Link href="/" className="inline-flex items-center gap-2 mt-6 text-brand hover:text-brand-dark no-underline font-semibold pb-10">
                ← Return to Home
            </Link>
        </div>
    );
}
