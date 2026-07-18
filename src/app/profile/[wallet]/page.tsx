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

    if (loading) return <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ border: "3px solid #E8E8E8", borderTopColor: "#165DFC", borderRadius: "50%", width: "32px", height: "32px", animation: "spin 1s linear infinite" }}></div><style dangerouslySetInnerHTML={{__html: `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}} /></div>;

    if (!isAddress(walletAddress) || (!user && !isOwner)) {
        return (
            <div style={{ minHeight: "80vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#FAFAFA" }}>
                <div style={{ textAlign: "center", padding: "60px", background: "#FFFFFF", borderRadius: "16px", border: "1px solid #E8E8E8" }}>
                    <UserIcon size={48} color="#E8E8E8" style={{ marginBottom: "16px" }} />
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>Polyhunter Not Found</h2>
                    <p style={{ color: "#6B6B6B", marginTop: "8px" }}>This wallet address hasn't set up a profile yet.</p>
                </div>
            </div>
        );
    }

    const agentsToShow = activeTab === "hunted" ? (user?.hunted || []) : (user?.agents || []);
    const displayWallet = getAddress(walletAddress);

    return (
        <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>
            <div style={{ height: "160px", background: "linear-gradient(135deg, #165DFC 0%, #165DFC 100%)" }}></div>
            
            <div style={{ maxWidth: "860px", margin: "0 auto", padding: "0 24px" }}>
                
                {/* Profile Card */}
                <div style={{ 
                    background: "#FFFFFF", borderRadius: "16px", border: "1px solid #E8E8E8", 
                    padding: "32px", marginTop: "-60px", marginBottom: "32px", position: "relative",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
                }}>
                    
                    {isOwner && !isEditing && (
                        <div style={{ position: "absolute", top: "24px", right: "24px", display: "flex", gap: "12px" }}>
                            <Link href="/dashboard" style={{
                                background: "#FAFAFA", color: "#111111", border: "none", borderRadius: "8px", padding: "8px 16px",
                                fontSize: "0.9rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", textDecoration: "none"
                            }}>
                                <LayoutDashboard size={16} /> My Dashboard
                            </Link>
                            <button onClick={() => setIsEditing(true)} style={{
                                background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "8px", padding: "8px 16px",
                                fontSize: "0.9rem", fontWeight: 600, color: "#111111", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer"
                            }}>
                                <Edit2 size={16} /> Edit Profile
                            </button>
                        </div>
                    )}

                    {isOwner && isEditing && (
                        <div style={{ position: "absolute", top: "24px", right: "24px", display: "flex", gap: "12px" }}>
                            <button onClick={() => setIsEditing(false)} style={{
                                background: "#FFFFFF", border: "1px solid #E8E8E8", borderRadius: "8px", padding: "8px 16px",
                                fontSize: "0.9rem", fontWeight: 600, color: "#9CA3AF", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer"
                            }}>
                                <X size={16} /> Cancel
                            </button>
                            <button onClick={handleSave} disabled={saving} style={{
                                background: "#CCFF00", color: "#000000", border: "none", borderRadius: "8px", padding: "8px 16px",
                                fontSize: "0.9rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px", cursor: saving ? "not-allowed" : "pointer"
                            }}>
                                <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    )}

                    <div style={{ display: "flex", gap: "24px", alignItems: "flex-end" }}>
                        
                        {/* Avatar */}
                        <div style={{ position: "relative" }}>
                            <div style={{ 
                                width: "120px", height: "120px", borderRadius: "50%", background: "#FAFAFA", 
                                border: "4px solid #FFFFFF", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" 
                            }}>
                                {isEditing ? (
                                    form.avatarUrl ? <img src={form.avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: uploading ? 0.5 : 1 }} /> : <UserIcon size={56} color="#E8E8E8" />
                                ) : (
                                    user?.avatarUrl ? <img src={user.avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <UserIcon size={56} color="#E8E8E8" />
                                )}
                            </div>
                            {isEditing && (
                                <>
                                    <button 
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        style={{
                                            position: "absolute", bottom: "0", right: "0", background: "#165DFC", color: "#FFFFFF", border: "4px solid #FFFFFF", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                                        }}
                                    >
                                        <Camera size={18} />
                                    </button>
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: "none" }} />
                                </>
                            )}
                        </div>

                        {/* Name & Wallet */}
                        <div style={{ paddingBottom: "8px", flex: 1 }}>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={form.username} 
                                    onChange={e => setForm({...form, username: e.target.value})} 
                                    placeholder="Username"
                                    style={{ fontSize: "1.8rem", fontWeight: 800, color: "#111111", border: "1px solid #E8E8E8", borderRadius: "8px", padding: "4px 12px", width: "100%", maxWidth: "300px", outline: "none", marginBottom: "8px" }}
                                />
                            ) : (
                                <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800, color: "#111111" }}>
                                    {user?.username || "Anonymous Hunter"}
                                </h1>
                            )}
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px" }}>
                                <span style={{ background: "#FAFAFA", color: "#9CA3AF", padding: "4px 12px", borderRadius: "16px", fontSize: "0.85rem", fontWeight: 600, fontFamily: "monospace" }}>
                                    {displayWallet.slice(0, 6)}...{displayWallet.slice(-4)}
                                </span>
                                {user?.createdAt && (
                                    <>
                                        <span style={{ color: "#E8E8E8" }}>•</span>
                                        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "#6B6B6B", fontSize: "0.85rem" }}>
                                            <Calendar size={14} /> Joined {new Date(user.createdAt).toLocaleDateString()}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {status && isEditing && (
                        <div style={{ marginTop: "16px", fontSize: "0.9rem", color: status.includes("Error") || status.includes("failed") ? "#DC2626" : "#059669", fontWeight: 500 }}>
                            {status}
                        </div>
                    )}

                    {/* Bio */}
                    {isEditing ? (
                        <div style={{ marginTop: "24px" }}>
                            <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#6B6B6B", marginBottom: "8px" }}>Bio</label>
                            <textarea 
                                value={form.bio} 
                                onChange={e => setForm({...form, bio: e.target.value})} 
                                placeholder="Tell everyone about yourself..."
                                rows={3}
                                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #E8E8E8", fontSize: "1rem", outline: "none", resize: "none", fontFamily: "inherit" }}
                            />
                        </div>
                    ) : (
                        user?.bio && (
                            <p style={{ fontSize: "1.05rem", color: "#6B6B6B", lineHeight: 1.6, marginTop: "24px", padding: "16px", background: "#FAFAFA", borderRadius: "8px" }}>
                                {user.bio}
                            </p>
                        )
                    )}

                    {/* Social Links Form (Edit Mode) */}
                    {isEditing && (
                        <div style={{ marginTop: "24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#9CA3AF", marginBottom: "4px" }}><Github size={14} style={{ display: "inline", marginRight: "4px" }}/> GitHub</label>
                                <input type="text" value={form.github} onChange={e => setForm({...form, github: e.target.value})} placeholder="https://github.com/..." style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #E8E8E8", fontSize: "0.9rem" }} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#9CA3AF", marginBottom: "4px" }}><Twitter size={14} style={{ display: "inline", marginRight: "4px" }}/> X (Twitter)</label>
                                <input type="text" value={form.twitter} onChange={e => setForm({...form, twitter: e.target.value})} placeholder="https://x.com/..." style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #E8E8E8", fontSize: "0.9rem" }} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#9CA3AF", marginBottom: "4px" }}><MessageSquare size={14} style={{ display: "inline", marginRight: "4px" }}/> Discord</label>
                                <input type="text" value={form.discord} onChange={e => setForm({...form, discord: e.target.value})} placeholder="Username or Server Link" style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #E8E8E8", fontSize: "0.9rem" }} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#9CA3AF", marginBottom: "4px" }}><Send size={14} style={{ display: "inline", marginRight: "4px" }}/> Telegram</label>
                                <input type="text" value={form.telegram} onChange={e => setForm({...form, telegram: e.target.value})} placeholder="https://t.me/..." style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #E8E8E8", fontSize: "0.9rem" }} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#9CA3AF", marginBottom: "4px" }}><Globe size={14} style={{ display: "inline", marginRight: "4px" }}/> Website</label>
                                <input type="text" value={form.website} onChange={e => setForm({...form, website: e.target.value})} placeholder="https://..." style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #E8E8E8", fontSize: "0.9rem" }} />
                            </div>
                            <div>
                                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "#9CA3AF", marginBottom: "4px" }}><Mail size={14} style={{ display: "inline", marginRight: "4px" }}/> Email</label>
                                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="hello@example.com" style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #E8E8E8", fontSize: "0.9rem" }} />
                            </div>
                        </div>
                    )}

                    {/* Social Links Display (View Mode) */}
                    {!isEditing && user && (user.github || user.twitter || user.discord || user.telegram || user.website || user.email) && (
                        <div style={{ marginTop: "24px", display: "flex", flexWrap: "wrap", gap: "12px" }}>
                            {user.twitter && <a href={user.twitter.startsWith('http') ? user.twitter : `https://x.com/${user.twitter}`} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: "#FAFAFA", borderRadius: "20px", color: "#111111", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}><Twitter size={14} /> Twitter</a>}
                            {user.github && <a href={user.github.startsWith('http') ? user.github : `https://github.com/${user.github}`} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: "#FAFAFA", borderRadius: "20px", color: "#111111", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}><Github size={14} /> GitHub</a>}
                            {user.telegram && <a href={user.telegram.startsWith('http') ? user.telegram : `https://t.me/${user.telegram}`} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: "#FAFAFA", borderRadius: "20px", color: "#111111", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}><Send size={14} /> Telegram</a>}
                            {user.discord && <span style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: "#FAFAFA", borderRadius: "20px", color: "#111111", fontSize: "0.85rem", fontWeight: 500 }}><MessageSquare size={14} /> {user.discord}</span>}
                            {user.website && <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: "#FAFAFA", borderRadius: "20px", color: "#111111", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}><Globe size={14} /> Website</a>}
                            {user.email && <a href={`mailto:${user.email}`} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: "#FAFAFA", borderRadius: "20px", color: "#111111", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}><Mail size={14} /> Email</a>}
                        </div>
                    )}
                </div>

                {/* Tabs */}
                {!isEditing && (
                    <>
                        <div style={{ display: "flex", gap: "32px", borderBottom: "1px solid #E8E8E8", marginBottom: "32px", overflowX: "auto" }}>
                            <button
                                onClick={() => setActiveTab("hunted")}
                                style={{
                                    padding: "0 0 16px 0", background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap",
                                    fontSize: "1.05rem", fontWeight: 700, color: activeTab === "hunted" ? "#165DFC" : "#9CA3AF",
                                    borderBottom: activeTab === "hunted" ? "3px solid #165DFC" : "3px solid transparent",
                                    transition: "all 0.2s"
                                }}
                            >
                                Hunted Agents ({(user?.hunted || []).length})
                            </button>
                            <button
                                onClick={() => setActiveTab("built")}
                                style={{
                                    padding: "0 0 16px 0", background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap",
                                    fontSize: "1.05rem", fontWeight: 700, color: activeTab === "built" ? "#165DFC" : "#9CA3AF",
                                    borderBottom: activeTab === "built" ? "3px solid #165DFC" : "3px solid transparent",
                                    transition: "all 0.2s"
                                }}
                            >
                                Built Agents ({(user?.agents || []).length})
                            </button>
                            <button
                                onClick={() => setActiveTab("badges")}
                                style={{
                                    padding: "0 0 16px 0", background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap",
                                    fontSize: "1.05rem", fontWeight: 700, color: activeTab === "badges" ? "#165DFC" : "#9CA3AF",
                                    borderBottom: activeTab === "badges" ? "3px solid #165DFC" : "3px solid transparent",
                                    transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px"
                                }}
                            >
                                <Award size={18} /> Badges {user?.badges ? `(${user.badges.length})` : ""}
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "80px" }}>
                            {activeTab === "badges" ? (
                                !(user?.badges && user.badges.length > 0) ? (
                                    <div style={{ textAlign: "center", padding: "80px 20px", background: "#FFFFFF", borderRadius: "16px", border: "1px dashed #E8E8E8", color: "#6B6B6B" }}>
                                        <Award size={40} color="#E8E8E8" style={{ marginBottom: "16px" }} />
                                        <h3 style={{ margin: "0 0 8px 0", fontSize: "1.2rem", color: "#111111" }}>No badges unlocked yet</h3>
                                        <p style={{ margin: 0, fontSize: "1rem" }}>
                                            Submit agents, register custom bots, or upvote ecosystem builders to earn your first platform badge!
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
                                        {user.badges.map((badge: any) => (
                                            <div key={badge.id} style={{
                                                background: "#FFFFFF",
                                                border: "1px solid #E8E8E8",
                                                borderRadius: "12px",
                                                padding: "24px",
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                textAlign: "center",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                                                transition: "all 0.2s ease"
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = badge.color || "#CCFF00";
                                                e.currentTarget.style.boxShadow = `0 8px 24px ${badge.color}1c`;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = "#E8E8E8";
                                                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.02)";
                                            }}
                                            >
                                                <div style={{
                                                    fontSize: "2.5rem",
                                                    marginBottom: "12px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    width: "64px",
                                                    height: "64px",
                                                    borderRadius: "50%",
                                                    background: `${badge.color}0c`,
                                                    border: `1px solid ${badge.color}2b`
                                                }}>
                                                    {badge.icon}
                                                </div>
                                                <h4 style={{ fontSize: "1.05rem", fontWeight: 700, margin: "0 0 6px 0", color: "#111111" }}>
                                                    {badge.name}
                                                </h4>
                                                <p style={{ fontSize: "0.85rem", color: "#6B6B6B", margin: 0, lineHeight: 1.4, flexGrow: 1 }}>
                                                    {badge.description}
                                                </p>
                                                <div style={{
                                                    marginTop: "16px",
                                                    fontSize: "0.75rem",
                                                    fontWeight: 700,
                                                    color: "#0A7C4E",
                                                    background: "rgba(10,124,78,0.08)",
                                                    padding: "4px 10px",
                                                    borderRadius: "20px"
                                                }}>
                                                    ✓ Unlocked
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            ) : agentsToShow.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "80px 20px", background: "#FFFFFF", borderRadius: "16px", border: "1px dashed #E8E8E8", color: "#6B6B6B" }}>
                                    <LinkIcon size={32} color="#E8E8E8" style={{ marginBottom: "16px" }} />
                                    <p style={{ margin: 0, fontSize: "1.1rem" }}>
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
