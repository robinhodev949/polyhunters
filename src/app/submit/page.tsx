"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { UploadCloud, CheckCircle, ShieldCheck, AlertCircle, Github, Info, Layers } from "lucide-react";
import Link from "next/link";

const AVAILABLE_SOURCES = [
  { id: "polymarket", name: "Polymarket" },
  { id: "kalshi", name: "Kalshi" },
  { id: "manifold", name: "Manifold" },
  { id: "onchain-evm", name: "On-chain EVM Contracts" }
];

export default function SubmitPage() {
    const router = useRouter();
    const { address, isConnected } = useAccount();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        name: "",
        tagline: "",
        description: "",
        pricePerDay: "",
        tags: "",
        dockerImageUrl: "",
        githubUrl: "",
        webhookUrl: "",
        hookToken: "",
    });

    const [selectedSources, setSelectedSources] = useState<string[]>(["polymarket"]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const toggleSource = (sourceId: string) => {
        if (selectedSources.includes(sourceId)) {
            // Keep at least one selected
            if (selectedSources.length > 1) {
                setSelectedSources(selectedSources.filter(id => id !== sourceId));
            }
        } else {
            setSelectedSources([...selectedSources, sourceId]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!isConnected || !address) {
            setError("Please connect your EVM wallet first to submit an agent.");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/agent/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: form.name,
                    tagline: form.tagline,
                    description: form.description,
                    pricePerDay: Number(form.pricePerDay),
                    tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
                    dockerImageUrl: form.dockerImageUrl || null,
                    githubUrl: form.githubUrl || null,
                    webhookUrl: form.webhookUrl || null,
                    hookToken: form.hookToken || null,
                    ownerWallet: address,
                    marketSourceIds: selectedSources
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Submission failed");
            }

            setIsSuccess(true);
            setTimeout(() => router.push("/marketplace"), 2500);
        } catch (err: any) {
            setError(err.message || "Something went wrong. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="max-w-[600px] mx-auto mt-30 text-center px-6">
                <CheckCircle size={64} className="text-success mx-auto mb-6 block" />
                <h1 className="text-[2rem] font-bold mb-3 text-text-primary">Agent Submitted!</h1>
                <p className="text-text-secondary text-[1.1rem]">
                    Your agent has been listed on PolyHunt. Redirecting to the marketplace...
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-[700px] mx-auto py-25 px-6 pb-15">
            <div className="text-center mb-10">
                <h1 className="text-[2.4rem] font-bold m-0 mb-3 tracking-tight font-sans text-text-primary">
                    List Your Agent
                </h1>
                <p className="text-[1.1rem] text-text-secondary m-0 font-normal">
                    List your prediction agent. Earn USDC passively on Robinhood Chain when users rent and run your model.
                </p>
            </div>

            {/* Banner Info */}
            <div className="flex items-start gap-3 bg-brand/5 border border-brand/15 p-4 rounded-xl mb-6">
                <Info size={18} className="text-brand flex-shrink-0 mt-0.5" />
                <div>
                    <p className="text-[0.9rem] text-text-primary font-bold m-0 mb-1">Developer Requirements</p>
                    <p className="text-[0.85rem] text-text-secondary m-0 leading-relaxed">
                        We support agents connecting to multiple prediction market protocols using the official APIs. For Polymarket, we recommend using the official{" "}
                        <a href="https://github.com/Polymarket/clob-client" target="_blank" rel="noopener noreferrer" className="text-brand font-bold">Polymarket CLOB client</a>. 
                        Rent payments are settled in USDC on Robinhood Chain L2.
                    </p>
                </div>
            </div>

            {!isConnected && (
                <div className="flex items-center gap-2.5 bg-amber-50 border border-amber-200 p-3 px-4 rounded-lg mb-6 text-amber-700 font-medium">
                    <AlertCircle size={18} />
                    <span className="text-[0.9rem]">Please connect your EVM wallet to submit an agent.</span>
                </div>
            )}

            {error && (
                <div className="flex items-center gap-2.5 bg-error/5 border border-error/20 p-3 px-4 rounded-lg mb-6 text-error font-medium">
                    <AlertCircle size={18} />
                    <span className="text-[0.9rem]">{error}</span>
                </div>
            )}

            <div className="p-8 border border-border rounded-xl bg-bg-secondary">
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[0.9rem] font-bold text-text-primary mb-2">Agent Name</label>
                            <input required name="name" type="text" value={form.name} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-text-muted outline-none text-[0.9rem] focus:border-brand" placeholder="e.g. SentientOracle" />
                        </div>
                        <div>
                            <label className="block text-[0.9rem] font-bold text-text-primary mb-2">Price (USDC/Day)</label>
                            <input required name="pricePerDay" type="number" min="1" value={form.pricePerDay} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-text-muted outline-none text-[0.9rem] focus:border-brand" placeholder="e.g. 15" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[0.9rem] font-bold text-text-primary mb-2">Tagline</label>
                        <input required name="tagline" type="text" value={form.tagline} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-text-muted outline-none text-[0.9rem] focus:border-brand" placeholder="Catchy one-liner describing your strategy..." />
                    </div>

                    <div>
                        <label className="block text-[0.9rem] font-bold text-text-primary mb-2">Full Description</label>
                        <textarea
                            required name="description" value={form.description} onChange={handleChange}
                            className="w-full px-3 py-2.5 rounded-lg border border-text-muted outline-none text-[0.9rem] resize-y" rows={4}
                            placeholder="Explain the data feeds, risk models, and execution details of your trading algorithm..."
                        />
                    </div>

                    {/* Pluggable Prediction Markets Selector */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[0.9rem] font-bold text-text-primary mb-2">
                            <Layers size={16} className="text-brand" /> Supported Prediction Markets
                        </label>
                        <p className="text-[0.85rem] text-text-secondary m-0 mb-2.5">
                            Select the target market networks this agent is designed to trade on.
                        </p>
                        <div className="flex gap-2.5 flex-wrap">
                            {AVAILABLE_SOURCES.map(source => {
                                const selected = selectedSources.includes(source.id);
                                return (
                                    <button
                                        type="button"
                                        key={source.id}
                                        onClick={() => toggleSource(source.id)}
                                        className={`px-4 py-2 rounded-lg text-[0.85rem] font-bold border cursor-pointer transition-all duration-150 ${
                                            selected 
                                                ? "bg-brand border-brand text-white" 
                                                : "bg-bg-secondary border-text-muted text-text-secondary hover:border-text-primary"
                                        }`}
                                    >
                                        {source.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[0.9rem] font-bold text-text-primary mb-2">Tags (comma separated)</label>
                        <input name="tags" type="text" value={form.tags} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-text-muted outline-none text-[0.9rem] focus:border-brand" placeholder="e.g. Politics, NLP, Sentiment" />
                    </div>

                    {/* GitHub URL */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[0.9rem] font-bold text-text-primary mb-2">
                            <Github size={16} className="text-text-primary" />
                            GitHub Repository{" "}
                            <span className="text-success font-bold text-[0.8rem] bg-success/8 px-1.5 py-0.5 rounded">Recommended</span>
                        </label>
                        <p className="text-[0.85rem] text-text-secondary m-0 mb-2">
                            Link your agent repo. Verified open source code significantly improves trust and installation rates on PolyHunt.
                        </p>
                        <input name="githubUrl" type="url" value={form.githubUrl} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-text-muted outline-none text-[0.9rem] focus:border-brand" placeholder="https://github.com/yourusername/your-agent" />
                    </div>

                    {/* Docker Image URL */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[0.9rem] font-bold text-text-primary mb-2">
                            <ShieldCheck size={16} className="text-brand" /> Docker Image URL <span className="text-text-muted font-normal">(recommended)</span>
                        </label>
                        <p className="text-[0.85rem] text-text-secondary m-0 mb-2">
                            The compiled Docker image URL of your agent deployment package. Learn more in the <Link href="/docs" className="text-brand font-bold">Docs</Link>.
                        </p>
                        <input name="dockerImageUrl" type="text" value={form.dockerImageUrl} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-text-muted outline-none text-[0.9rem] focus:border-brand" placeholder="e.g. docker.io/yourusername/agent-name:latest" />
                    </div>

                    {/* Webhook URL */}
                    <div>
                        <label className="flex items-center gap-1.5 text-[0.9rem] font-bold text-text-primary mb-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                            OpenClaw Webhook URL <span className="text-text-muted font-normal">(optional)</span>
                        </label>
                        <p className="text-[0.85rem] text-text-secondary m-0 mb-2">
                            Optional web hook endpoint to stream operational signals or trigger custom orchestration logs.
                        </p>
                        <input name="webhookUrl" type="url" value={form.webhookUrl} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-text-muted outline-none text-[0.9rem] focus:border-brand" placeholder="https://your-gateway.openclaw.ai/hooks/agent" />
                    </div>

                    {/* Hook Token */}
                    {form.webhookUrl && (
                        <div>
                            <label className="block text-[0.9rem] font-bold text-text-primary mb-2">
                                Hook Token <span className="text-text-muted font-normal">(OpenClaw secret)</span>
                            </label>
                            <input name="hookToken" type="password" value={form.hookToken} onChange={handleChange} className="w-full px-3 py-2.5 rounded-lg border border-text-muted outline-none text-[0.9rem] focus:border-brand" placeholder="your-secret-hook-token" />
                        </div>
                    )}

                    <hr className="border-none border-t border-border my-2" />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3.5 text-[1rem] font-bold flex items-center justify-center gap-2 rounded-lg border-none transition-colors duration-150 shadow-[0_2px_8px_rgba(204,255,0,0.15)] ${
                            isSubmitting
                                ? "bg-brand-lime/70 text-text-primary/70 cursor-not-allowed"
                                : "bg-brand-lime text-text-primary cursor-pointer hover:bg-[#bfe600]"
                        }`}
                    >
                        {isSubmitting ? (
                            <span>Saving to database...</span>
                        ) : (
                            <><UploadCloud size={18} /> Submit Agent</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
