import Link from "next/link";

export default function PrivacyPolicy() {
    return (
        <div className="max-w-[800px] mx-auto my-10 px-6 text-text-primary font-sans leading-relaxed">
            <h1 className="text-[2.5rem] font-bold mb-2">Privacy Policy</h1>
            <p className="text-text-secondary mb-10 text-[0.95rem]">Effective Date: March 20, 2026</p>

            <section className="mb-8">
                <p>
                    PolyHunt ("we," "our," or "us") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website (polyhunt.xyz) or use our mobile application (the "App"). Please read this Privacy Policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or the application.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-[1.4rem] font-bold mb-4 text-text-primary">1. Information We Collect</h2>
                <h3 className="text-[1.1rem] font-semibold mt-4 mb-2">A. Personal Data</h3>
                <p>
                    We do not natively collect directly identifiable personal information (PII) such as your real name, physical address, or phone number unless you voluntarily provide it within your public profile. When you connect a cryptocurrency wallet, we collect and store your public wallet address to authenticate you and facilitate transactions. If you choose to set up a Polyhunter profile, we may store the username, bio, avatar image, and social media links you explicitly provide.
                </p>
                <h3 className="text-[1.1rem] font-semibold mt-4 mb-2">B. Derivative Data</h3>
                <p>
                    Our servers may automatically collect certain information when you access the App, such as your IP address, browser type, operating system, access times, and the pages you view directly before and after accessing the App.
                </p>
                <h3 className="text-[1.1rem] font-semibold mt-4 mb-2">C. Blockchain Data</h3>
                <p>
                    Due to the inherent public nature of blockchain technology (specifically the Robinhood Chain L2 network), all transaction data, wallet interactions, and on-chain agent rentals are permanently, publicly recorded. We do not control this blockchain infrastructure and cannot erase data from it.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-[1.4rem] font-bold mb-4 text-text-primary">2. How We Use Your Information</h2>
                <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected via the App to:</p>
                <ul className="pl-6 mt-2">
                    <li className="mb-2">Facilitate account creation and logon process via wallet signatures.</li>
                    <li className="mb-2">Process transactions and send notices about your agent rentals or payouts.</li>
                    <li className="mb-2">Generate personal profiles and rank you on our public Leaderboards.</li>
                    <li className="mb-2">Monitor and analyze usage and trends to improve your experience with the App.</li>
                    <li className="mb-2">Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-[1.4rem] font-bold mb-4 text-text-primary">3. Disclosure of Your Information</h2>
                <p>
                    We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                </p>
                <ul className="pl-6 mt-2">
                    <li className="mb-2"><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
                    <li className="mb-2"><strong>Public Profiles:</strong> If you interact with our leaderboards or publish an agent, your wallet address, username, and bio will be publicly viewable by other users of the application.</li>
                    <li className="mb-2"><strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, hosting services (e.g., Vercel, Supabase), and customer service.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-[1.4rem] font-bold mb-4 text-text-primary">4. Third-Party Websites & APIs</h2>
                <p>
                    The App contains links to third-party websites and applications of interest (e.g., Polymarket, OpenClaw, GitHub). We also interact with decentralized trading protocols. Once you use these links to leave the App, any information you provide to these third parties is not covered by this Privacy Policy. We cannot guarantee the safety and privacy of data you provide to any third parties.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-[1.4rem] font-bold mb-4 text-text-primary">5. Children's Privacy</h2>
                <p>
                    We do not knowingly solicit information from or market to children under the age of 13. If you become aware of any data we have collected from children under age 13, please contact us using the contact information provided below.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-[1.4rem] font-bold mb-4 text-text-primary">6. Changes to This Privacy Policy</h2>
                <p>
                    We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Effective Date" of this Privacy Policy. Any changes or modifications will be effective immediately upon posting the updated Privacy Policy on the App.
                </p>
            </section>

            <section className="mb-8 p-6 bg-bg-primary border border-border rounded-xl">
                <h2 className="text-[1.3rem] font-bold mb-3 text-text-primary">7. Contact Us</h2>
                <p className="m-0">
                    If you have questions or comments about this Privacy Policy, please contact us at:<br /><br />
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
