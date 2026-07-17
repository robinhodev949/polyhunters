import Link from "next/link";

export default function License() {
    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 24px", color: "#1A1A1A", fontFamily: "var(--font-sans)", lineHeight: 1.6 }}>
            <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "24px" }}>Terms of Service & License</h1>
            <p style={{ color: "#6B6B6B", marginBottom: "32px", fontSize: "0.95rem" }}>Last updated: March 2026</p>

            <section style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "16px" }}>1. Acceptance of Terms</h2>
                <p>By accessing or using PolyHunt, you agree to be bound by these Terms of Service. If you do not agree, you must not access the platform.</p>
            </section>

            <section style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "16px" }}>2. Open Source & Platform License</h2>
                <p>The PolyHunt orchestration engine and smart contract interfaces are provided under the MIT License unless otherwise specified. Users are granted a limited, non-exclusive, non-transferable license to access the decentralized marketplace interface.</p>
            </section>

            <section style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "16px" }}>3. Assumption of Risk</h2>
                <p>Prediction markets and AI algorithmic trading involve substantial risk of loss. PolyHunt provides the orchestration layer but does not guarantee the performance, profitability, or safety of any third-party agent rented through the platform. You are solely responsible for all financial decisions.</p>
            </section>

            <section style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "16px" }}>4. Agent Builders</h2>
                <p>Builders listing agents on PolyHunt retain the intellectual property rights to their underlying models. By listing an agent, you grant PolyHunt a license to display, distribute, and orchestrate the execution of that agent to platform users.</p>
            </section>

            <Link href="/" style={{ display: "inline-block", marginTop: "24px", color: "#3358FF", textDecoration: "none", fontWeight: 600 }}>
                ← Back to Home
            </Link>
        </div>
    );
}
