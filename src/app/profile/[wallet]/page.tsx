"use client";

import { useEffect, useState, useRef, use } from "react";
import { User as UserIcon, Calendar, Link as LinkIcon, Edit2, Save, X, Github, Twitter, MessageSquare, Send, Globe, Mail, Award, LayoutDashboard, Camera } from "lucide-react";
import { AgentCard } from "@/components/AgentCard";
import type { Agent } from "@prisma/client";
import { useAccount, useSignMessage } from "wagmi";
import { getAddress, isAddress } from "viem";
import Link from "next/link";

export default function ProfilePage({ params }: { params: Promise<{ wallet: string }> }) {
    const resolvedParams = use(params);
    const walletAddress = resolvedParams.wallet;
    
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"hunted" | "built" | "badges">("hunted");

    const isOwner = isConnected && address && isAddress(walletAddress) && getAddress(address) === getAddress(walletAddress);
    const [isEditing, setIsEditing] = useState(false);
    
    // Form state
    const [form, setForm] = useState({
        username: "",
        bio: "",
        avatarUrl: "",
        email: "",
        github: "",
        twitter: "",
        discord: "",
        telegram: "",
        website: ""
    });
    
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isAddress(walletAddress)) {
            setLoading(false);
            return;
        }
        const normalized = getAddress(walletAddress);
        fetch(`/api/user/${normalized}`)
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUser(data.user);
                    setForm({
                        username: data.user.username || "",
                        bio: data.user.bio || "",
                        avatarUrl: data.user.avatarUrl || "",
                        email: data.user.email || "",
                        github: data.user.github || "",
                        twitter: data.user.twitter || "",
                        discord: data.user.discord || "",
                        telegram: data.user.telegram || "",
                        website: data.user.website || ""
                    });
                }
                setLoading(false);
            })
            .catch(console.error);
    }, [walletAddress]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !isConnected || !address) return;

        setUploading(true);
        setStatus("Uploading image...");

        try {
            const timestamp = Date.now();
            const message = `Upload PolyHunt avatar for ${address}. Timestamp: ${timestamp}`;
            
            // Sign message via EVM
            const signature = await signMessageAsync({ message });

            const formData = new FormData();
            formData.append("file", file);
            formData.append("wallet", address);
            formData.append("signature", signature);
            formData.append("message", message);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            if (response.ok && data.url) {
                setForm(prev => ({ ...prev, avatarUrl: data.url }));
                setStatus("Image uploaded successfully!");
            } else {
                setStatus(`Upload failed: ${data.error}`);
            }
        } catch (error: any) {
            setStatus(`Upload error: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        if (!isConnected || !address) return;
        setSaving(true);
        setStatus("Waiting for wallet signature...");

        try {
            const timestamp = Date.now();
            const message = `Update PolyHunt profile for ${address}. Timestamp: ${timestamp}`;
            
            // Sign message via EVM
            const signature = await signMessageAsync({ message });

            const response = await fetch("/api/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet: address,
                    signature,
                    message,
                    ...form
                })
            });

            const data = await response.json();
            if (response.ok) {
                setUser(data.user);
                setIsEditing(false);
                setStatus("Profile saved!");
            } else {
                setStatus(`Error: ${data.error}`);
            }
        } catch (error: any) {
            setStatus(`Signature failed: ${error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-[80vh] flex items-center justify-center"><div className="spinner border-2 border-border border-t-brand rounded-full w-8 h-8 animate-spin"></div><style dangerouslySetInnerHTML={{__html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}} /></div>;

    if (!isAddress(walletAddress) || (!user && !isOwner)) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center bg-bg-secondary">
                <div className="text-center p-15 bg-bg-secondary rounded-2xl border border-border">
                    <UserIcon size={48} className="text-text-muted mb-4 mx-auto" />
                    <h2 className="text-[1.5rem] font-bold m-0">Polyhunter Not Found</h2>
                    <p className="text-text-secondary mt-2">This wallet address hasn't set up a profile yet.</p>
                </div>
            </div>
        );
    }

    const agentsToShow = activeTab === "hunted" ? (user?.hunted || []) : (user?.agents || []);
    const displayWallet = getAddress(walletAddress);

    return (
        <div className="min-h-screen bg-bg-secondary">
            <div className="h-40 bg-gradient-to-r from-brand to-[#002d8f]"></div>
            
            <div className="max-w-[860px] mx-auto px-6">
                
                {/* Profile Card */}
                <div className="bg-bg-secondary rounded-2xl border border-border p-8 -mt-15 mb-8 relative shadow-sm">
                    
                    {isOwner && !isEditing && (
                        <div className="absolute top-6 right-6 flex gap-3">
                            <Link href="/dashboard" className="bg-bg-primary text-text-primary border-none rounded-lg px-4 py-2 text-[0.9rem] font-semibold flex items-center gap-2 cursor-pointer no-underline">
                                <LayoutDashboard size={16} /> My Dashboard
                            </Link>
                            <button onClick={() => setIsEditing(true)} className="bg-bg-secondary border border-border rounded-lg px-4 py-2 text-[0.9rem] font-semibold text-text-primary flex items-center gap-2 cursor-pointer">
                                <Edit2 size={16} /> Edit Profile
                            </button>
                        </div>
                    )}

                    {isOwner && isEditing && (
                        <div className="absolute top-6 right-6 flex gap-3">
                            <button onClick={() => setIsEditing(false)} className="bg-bg-secondary border border-border rounded-lg px-4 py-2 text-[0.9rem] font-semibold text-text-secondary flex items-center gap-2 cursor-pointer">
                                <X size={16} /> Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving} className={`border-none rounded-lg px-4 py-2 text-[0.9rem] font-bold flex items-center gap-2 ${saving ? "bg-brand-lime/50 text-text-primary/50 cursor-not-allowed" : "bg-brand-lime text-text-primary cursor-pointer"}`}>
                                <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    )}

                    <div className="flex gap-6 items-end">
                        
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-[120px] h-[120px] rounded-full bg-bg-primary border-4 border-bg-secondary overflow-hidden display flex items-center justify-center">
                                {isEditing ? (
                                    form.avatarUrl ? <img src={form.avatarUrl} alt="avatar" className="w-full h-full object-cover" style={{ opacity: uploading ? 0.5 : 1 }} /> : <UserIcon size={56} className="text-text-muted" />
                                ) : (
                                    user?.avatarUrl ? <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" /> : <UserIcon size={56} className="text-text-muted" />
                                )}
                            </div>
                            {isEditing && (
                                <>
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="absolute bottom-0 right-0 bg-brand text-white border-4 border-bg-secondary rounded-full w-10 h-10 flex items-center justify-center cursor-pointer"
                                    >
                                        <Camera size={18} />
                                    </button>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                                </>
                            )}
                        </div>

                        {/* Name & Wallet */}
                        <div className="pb-2 flex-1">
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={form.username} 
                                    onChange={e => setForm({...form, username: e.target.value})} 
                                    placeholder="Username"
                                    className="text-[1.8rem] font-extrabold text-text-primary border border-border rounded-lg px-3 py-1 w-full max-w-[300px] outline-none mb-2 focus:border-brand"
                                />
                            ) : (
                                <h1 className="m-0 text-[2rem] font-extrabold text-text-primary">
                                    {user?.username || "Anonymous Hunter"}
                                </h1>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                                <span className="bg-bg-primary text-text-secondary px-3 py-1 rounded-2xl text-[0.85rem] font-semibold font-mono border border-border">
                                    {displayWallet.slice(0, 6)}...{displayWallet.slice(-4)}
                                </span>
                                {user?.createdAt && (
                                    <>
                                        <span className="text-text-muted">•</span>
                                        <span className="flex items-center gap-1 text-text-secondary text-[0.85rem]">
                                            <Calendar size={14} /> Joined {new Date(user.createdAt).toLocaleDateString()}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {status && isEditing && (
                        <div className={`mt-4 text-[0.9rem] font-medium ${status.toLowerCase().includes("error") || status.toLowerCase().includes("failed") ? "text-error" : "text-success"}`}>
                            {status}
                        </div>
                    )}

                    {/* Bio */}
                    {isEditing ? (
                        <div className="mt-6">
                            <label className="block text-[0.9rem] font-bold text-text-secondary mb-2">Bio</label>
                            <textarea 
                                value={form.bio} 
                                onChange={e => setForm({...form, bio: e.target.value})} 
                                placeholder="Tell everyone about yourself..."
                                rows={3}
                                className="w-full p-3 rounded-lg border border-border text-[1rem] outline-none resize-none font-sans"
                            />
                        </div>
                    ) : (
                        user?.bio && (
                            <p className="text-[1.05rem] text-text-secondary leading-relaxed mt-6 p-4 bg-bg-primary rounded-lg border border-border">
                                {user.bio}
                            </p>
                        )
                    )}

                    {/* Social Links Form (Edit Mode) */}
                    {isEditing && (
                        <div className="mt-6 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[0.85rem] font-bold text-text-secondary mb-1"><Github size={14} className="inline mr-1"/> GitHub</label>
                                <input type="text" value={form.github} onChange={e => setForm({...form, github: e.target.value})} placeholder="https://github.com/..." className="w-full px-3 py-2 rounded-md border border-border text-[0.9rem] outline-none focus:border-brand" />
                            </div>
                            <div>
                                <label className="block text-[0.85rem] font-bold text-text-secondary mb-1"><Twitter size={14} className="inline mr-1"/> X (Twitter)</label>
                                <input type="text" value={form.twitter} onChange={e => setForm({...form, twitter: e.target.value})} placeholder="https://x.com/..." className="w-full px-3 py-2 rounded-md border border-border text-[0.9rem] outline-none focus:border-brand" />
                            </div>
                            <div>
                                <label className="block text-[0.85rem] font-bold text-text-secondary mb-1"><MessageSquare size={14} className="inline mr-1"/> Discord</label>
                                <input type="text" value={form.discord} onChange={e => setForm({...form, discord: e.target.value})} placeholder="Username or Server Link" className="w-full px-3 py-2 rounded-md border border-border text-[0.9rem] outline-none focus:border-brand" />
                            </div>
                            <div>
                                <label className="block text-[0.85rem] font-bold text-text-secondary mb-1"><Send size={14} className="inline mr-1"/> Telegram</label>
                                <input type="text" value={form.telegram} onChange={e => setForm({...form, telegram: e.target.value})} placeholder="https://t.me/..." className="w-full px-3 py-2 rounded-md border border-border text-[0.9rem] outline-none focus:border-brand" />
                            </div>
                            <div>
                                <label className="block text-[0.85rem] font-bold text-text-secondary mb-1"><Globe size={14} className="inline mr-1"/> Website</label>
                                <input type="text" value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="https://..." className="w-full px-3 py-2 rounded-md border border-border text-[0.9rem] outline-none focus:border-brand" />
                            </div>
                            <div>
                                <label className="block text-[0.85rem] font-bold text-text-secondary mb-1"><Mail size={14} className="inline mr-1"/> Email</label>
                                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="hello@example.com" className="w-full px-3 py-2 rounded-md border border-border text-[0.9rem] outline-none focus:border-brand" />
                            </div>
                        </div>
                    )}

                    {/* Social Links Display (View Mode) */}
                    {!isEditing && user && (user.github || user.twitter || user.discord || user.telegram || user.website || user.email) && (
                        <div className="mt-6 flex flex-wrap gap-3">
                            {user.twitter && <a href={user.twitter.startsWith('http') ? user.twitter : `https://x.com/${user.twitter}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-primary border border-border rounded-full color-text-primary hover:border-text-secondary no-underline text-[0.85rem] font-medium"><Twitter size={14} /> Twitter</a>}
                            {user.github && <a href={user.github.startsWith('http') ? user.github : `https://github.com/${user.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-primary border border-border rounded-full color-text-primary hover:border-text-secondary no-underline text-[0.85rem] font-medium"><Github size={14} /> GitHub</a>}
                            {user.telegram && <a href={user.telegram.startsWith('http') ? user.telegram : `https://t.me/${user.telegram}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-primary border border-border rounded-full color-text-primary hover:border-text-secondary no-underline text-[0.85rem] font-medium"><Send size={14} /> Telegram</a>}
                            {user.discord && <span className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-primary border border-border rounded-full color-text-primary text-[0.85rem] font-medium"><MessageSquare size={14} /> {user.discord}</span>}
                            {user.website && <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-primary border border-border rounded-full color-text-primary hover:border-text-secondary no-underline text-[0.85rem] font-medium"><Globe size={14} /> Website</a>}
                            {user.email && <a href={`mailto:${user.email}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-bg-primary border border-border rounded-full color-text-primary hover:border-text-secondary no-underline text-[0.85rem] font-medium"><Mail size={14} /> Email</a>}
                        </div>
                    )}
                </div>

                {/* Tabs */}
                {!isEditing && (
                    <>
                        <div className="flex gap-8 border-b border-border mb-8 overflow-x-auto">
                            <button
                                onClick={() => setActiveTab("hunted")}
                                className={`pb-4 bg-transparent border-none cursor-pointer whitespace-nowrap text-[1.05rem] font-bold transition-all duration-200 ${
                                    activeTab === "hunted" ? "text-brand border-b-2 border-brand" : "text-text-muted border-b-2 border-transparent"
                                }`}
                            >
                                Hunted Agents ({(user?.hunted || []).length})
                            </button>
                            <button
                                onClick={() => setActiveTab("built")}
                                className={`pb-4 bg-transparent border-none cursor-pointer whitespace-nowrap text-[1.05rem] font-bold transition-all duration-200 ${
                                    activeTab === "built" ? "text-brand border-b-2 border-brand" : "text-text-muted border-b-2 border-transparent"
                                }`}
                            >
                                Built Agents ({(user?.agents || []).length})
                            </button>
                            <button
                                onClick={() => setActiveTab("badges")}
                                className={`pb-4 bg-transparent border-none cursor-pointer whitespace-nowrap text-[1.05rem] font-bold transition-all duration-200 flex items-center gap-1.5 ${
                                    activeTab === "badges" ? "text-brand border-b-2 border-brand" : "text-text-muted border-b-2 border-transparent"
                                }`}
                            >
                                <Award size={18} /> Badges
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex flex-col gap-4 pb-20">
                            {activeTab === "badges" ? (
                                <div className="text-center py-20 px-5 bg-bg-secondary rounded-2xl border border-dashed border-text-muted text-text-secondary">
                                    <Award size={40} className="text-text-muted mb-4 mx-auto" />
                                    <h3 className="m-0 mb-2 text-[1.2rem] text-text-primary">Coming Soon!</h3>
                                    <p className="m-0 text-[1rem]">
                                        Polyhunters will soon be able to earn on-chain badges for their discoveries.
                                    </p>
                                </div>
                            ) : agentsToShow.length === 0 ? (
                                <div className="text-center py-20 px-5 bg-bg-secondary rounded-2xl border border-dashed border-text-muted text-text-secondary">
                                    <LinkIcon size={32} className="text-text-muted mb-4 mx-auto" />
                                    <p className="m-0 text-[1.1rem]">
                                        {activeTab === "hunted" ? "This user hasn't discovered any agents yet." : "This user hasn't built any agents yet."}
                                    </p>
                                </div>
                            ) : (
                                agentsToShow.map((agent: Agent) => (
                                    <AgentCard key={agent.id} agent={agent} />
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
