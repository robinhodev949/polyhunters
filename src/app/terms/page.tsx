import Link from "next/link";

export default function TermsOfService() {
    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 24px", color: "#111111", fontFamily: "var(--font-sans)", lineHeight: 1.6 }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "8px" }}>Terms of Service</h1>
            <p style={{ color: "#6B6B6B", marginBottom: "40px", fontSize: "0.95rem" }}>Effective Date: March 20, 2026</p>

            <section style={{ marginBottom: "32px" }}>
                <p>
                    These Terms of Service ("Terms") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and PolyHunt ("we," "us," or "our"), concerning your access to and use of the polyhunt.xyz website as well as any other media form, media channel, mobile website, or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px", color: "#111111" }}>1. Disclaimer of Financial Liability</h2>
                <p>
                    PolyHunt is a decentralized application marketplace that aggregates autonomous AI software ("Agents") built by independent, third-party developers on top of various agent frameworks. PolyHunt does not create, warrant, or verify the efficacy, safety, or profitability of these autonomous agents.
                </p>
                <p style={{ marginTop: "12px", background: "#FEF2F2", color: "#991B1B", padding: "16px", borderRadius: "8px", fontWeight: 600 }}>
                    YOU ACKNOWLEDGE AND AGREE THAT ANY USE OF AUTONOMOUS AGENTS TO EXECUTE TRADES, BETS, OR FINANCIAL TRANSACTIONS ON PREDICTION MARKETS IS STRICTLY AT YOUR OWN FINANCIAL RISK. WE ARE NOT LIABLE FOR ANY FINANCIAL LOSSES, FAILED TRADES, OR SMART CONTRACT BUGS YOU MAY INCUR.
                </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px", color: "#111111" }}>2. Decentralized Authentication</h2>
                <p>
                    By connecting your EVM wallet to the Site, you represent and warrant that you are the lawful owner of that wallet. You are entirely responsible for maintaining the confidentiality and strict security of your private keys and seed phrases on Robinhood Chain L2. Under no circumstances will PolyHunt request your private key, nor do we have access to it or the power to recover lost funds.
                </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px", color: "#111111" }}>3. Prohibited Activities</h2>
                <p>
                    You may not access or use the Site for any purpose other than that for which we make the Site available. As a user of the Site, you agree not to:
                </p>
                <ul style={{ paddingLeft: "24px", marginTop: "8px" }}>
                    <li style={{ marginBottom: "8px" }}>Systematically retrieve data or content from the Site to create or compile a collection, compilation, database, or directory without written permission.</li>
                    <li style={{ marginBottom: "8px" }}>Use the platform to launch malicious smart contracts, scam tokens, or sybil attacks against prediction markets.</li>
                    <li style={{ marginBottom: "8px" }}>Upload or transmit viruses, Trojan horses, or other material that interferes with any party's uninterrupted use and enjoyment of the Site.</li>
                    <li style={{ marginBottom: "8px" }}>Attempt to bypass any measures of the Site designed to prevent or restrict access to the Site or any RPC node infrastructure.</li>
                </ul>
            </section>

            <section style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px", color: "#111111" }}>4. Modifications and Interruptions</h2>
                <p>
                    We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We cannot guarantee the Site will be available at all times, as decentralized networks (like Robinhood Chain) may experience downtime outside of our control.
                </p>
            </section>

            <section style={{ marginBottom: "32px", padding: "24px", background: "#FAFAFA", borderRadius: "12px" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "12px", color: "#111111" }}>5. Contact Information</h2>
                <p style={{ margin: 0 }}>
                    In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:<br /><br />
                    <strong>PolyHunt Administration</strong><br />
                    Email: legal@polyhunt.xyz
                </p>
            </section>

            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "24px", color: "#165DFC", textDecoration: "none", fontWeight: 600, paddingBottom: "40px" }}>
                ← Return to Home
            </Link>
        </div>
    );
}
