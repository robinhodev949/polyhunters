import Link from "next/link";

export default function Copyright() {
    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 24px", color: "#111111", fontFamily: "var(--font-sans)", lineHeight: 1.6 }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "24px" }}>Copyright & Ownership</h1>
            <p style={{ color: "#6B6B6B", marginBottom: "32px", fontSize: "0.95rem" }}>Last updated: March 2026</p>

            <section style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "16px" }}>1. Ownership</h2>
                <p>All content, branding, logos, trademarks, and original source code associated with the PolyHunt client interface and backend orchestration infrastructure are the proprietary property of PolyHunt, protected by international copyright laws.</p>
            </section>

            <section style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "16px" }}>2. Third-Party Intellectual Property</h2>
                <p>AI models, trading algorithms, and agents listed on the marketplace remain the sole intellectual property of their respective creators (Builders). PolyHunt does not claim ownership over the underlying logic or weights of rented OpenClaw models.</p>
                <p style={{ marginTop: "12px" }}>"Polymarket" and "Robinhood Chain" are trademarks of their respective foundations and entities. PolyHunt is an independent infrastructure provider and is not officially affiliated with the Polymarket protocol or Robinhood Markets, Inc.</p>
            </section>

            <section style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "16px" }}>3. DMCA & Copyright Infringement</h2>
                <p>If you believe that an agent listed on the PolyHunt marketplace infringes upon your copyright or intellectual property rights, please contact us immediately. As a decentralized indexing platform, we will remove listings that are proven to be stolen or maliciously copied.</p>
            </section>

            <Link href="/" style={{ display: "inline-block", marginTop: "24px", color: "#165DFC", textDecoration: "none", fontWeight: 600 }}>
                ← Back to Home
            </Link>
        </div>
    );
}
