import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 24px", color: "#111111", fontFamily: "var(--font-sans)", lineHeight: 1.6 }}>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "8px" }}>Privacy Policy</h1>
            <p style={{ color: "#6B6B6B", marginBottom: "40px", fontSize: "0.95rem" }}>Effective Date: March 20, 2026</p>

            <section style={{ marginBottom: "32px" }}>
                <p>
                    PolyHunt ("we," "our," or "us") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (polyhunt.xyz) or use our mobile application (the "App"). Please read this Privacy Policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or the application.
                </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px", color: "#111111" }}>1. Information We Collect</h2>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: "16px", marginBottom: "8px" }}>A. Personal Data</h3>
                <p>
                    We do not natively collect directly identifiable personal information (PII) such as your real name, physical address, or phone number unless you voluntarily provide it within your public profile. When you connect a cryptocurrency wallet, we collect and store your public wallet address to authenticate you and facilitate transactions. If you choose to set up a Polyhunter profile, we may store the username, bio, avatar image, and social media links you explicitly provide.
                </p>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: "16px", marginBottom: "8px" }}>B. Derivative Data</h3>
                <p>
                    Our servers may automatically collect certain information when you access the App, such as your IP address, browser type, operating system, access times, and the pages you view directly before and after accessing the App.
                </p>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginTop: "16px", marginBottom: "8px" }}>C. Blockchain Data</h3>
                <p>
                    Due to the inherent public nature of blockchain technology (specifically the Robinhood Chain L2 network), all transaction data, wallet interactions, and on-chain agent rentals are permanently, publicly recorded. We do not control this blockchain infrastructure and cannot erase data from it.
                </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px", color: "#111111" }}>2. How We Use Your Information</h2>
                <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected via the App to:</p>
                <ul style={{ paddingLeft: "24px", marginTop: "8px" }}>
                    <li style={{ marginBottom: "8px" }}>Facilitate account creation and logon process via wallet signatures.</li>
                    <li style={{ marginBottom: "8px" }}>Process transactions and send notices about your agent rentals or payouts.</li>
                    <li style={{ marginBottom: "8px" }}>Generate personal profiles and rank you on our public Leaderboards.</li>
                    <li style={{ marginBottom: "8px" }}>Monitor and analyze usage and trends to improve your experience with the App.</li>
                    <li style={{ marginBottom: "8px" }}>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
                </ul>
            </section>

            <section style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px", color: "#111111" }}>3. Disclosure of Your Information</h2>
                <p>
                    We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                </p>
                <ul style={{ paddingLeft: "24px", marginTop: "8px" }}>
                    <li style={{ marginBottom: "8px" }}><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
                    <li style={{ marginBottom: "8px" }}><strong>Public Profiles:</strong> If you interact with our leaderboards or publish an agent, your wallet address, username, and bio will be publicly viewable by other users of the application.</li>
                    <li style={{ marginBottom: "8px" }}><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, hosting services (e.g., Vercel, Supabase), and customer service.</li>
                </ul>
            </section>

            <section style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px", color: "#111111" }}>4. Third-Party Websites & APIs</h2>
                <p>
                    The App contains links to third-party websites and applications of interest (e.g., Polymarket, OpenClaw, GitHub). We also interact with decentralized trading protocols. Once you use these links to leave the App, any information you provide to these third parties is not covered by this Privacy Policy. We cannot guarantee the safety and privacy of data you provide to any third parties.
                </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px", color: "#111111" }}>5. Children's Privacy</h2>
                <p>
                    We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
                </p>
            </section>

            <section style={{ marginBottom: "32px" }}>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px", color: "#111111" }}>6. Changes to This Privacy Policy</h2>
                <p>
                    We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Effective Date" of this Privacy Policy. Any changes or modifications will be effective immediately upon posting the updated Privacy Policy on the App.
                </p>
            </section>

            <section style={{ marginBottom: "32px", padding: "24px", background: "#FAFAFA", borderRadius: "12px" }}>
                <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "12px", color: "#111111" }}>7. Contact Us</h2>
                <p style={{ margin: 0 }}>
                    If you have questions or comments about this Privacy Policy, please contact us at:<br /><br />
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
