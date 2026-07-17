"use client";

import { useState, useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { Save, User as UserIcon, Settings as SettingsIcon } from "lucide-react";

export default function SettingsPage() {
    const { address, isConnected } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState("");

    // Load existing profile data
    useEffect(() => {
        if (!isConnected || !address) return;
        fetch(`/api/user/${address}`)
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    setUsername(data.user.username || "");
                    setBio(data.user.bio || "");
                    setAvatarUrl(data.user.avatarUrl || "");
                }
            })
            .catch(console.error);
    }, [isConnected, address]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isConnected || !address) {
            setStatus("Wallet not connected or does not support signing.");
            return;
        }

        setLoading(true);
        setStatus("Waiting for wallet signature...");

        try {
            // Create a message to sign
            const timestamp = Date.now();
            const message = `Update PolyHunt profile for ${address}. Timestamp: ${timestamp}`;
            
            // Request EVM signature
            const signature = await signMessageAsync({ message });

            // Send to backend (EVM payload uses hex signature string directly)
            const response = await fetch("/api/profile/update", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    wallet: address,
                    signature,
                    message,
                    username,
                    bio,
                    avatarUrl
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                setStatus("Profile updated successfully!");
            } else {
                setStatus(`Error: ${data.error}`);
            }
        } catch (error: any) {
            console.error(error);
            setStatus(`Signature failed: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isConnected) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFFFFF" }}>
                <div style={{ textAlign: "center", padding: "40px", background: "#FFFFFF", borderRadius: "16px", border: "1px solid #E8E8E8" }}>
                    <SettingsIcon size={48} color="#D1D5DB" style={{ marginBottom: "16px" }} />
                    <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#111111", marginBottom: "8px" }}>Wallet Required</h2>
                    <p style={{ color: "#6B6B6B" }}>Please connect your EVM wallet to edit your profile settings.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: "100vh", background: "#FFFFFF", padding: "40px 24px" }}>
            <div style={{ maxWidth: "600px", margin: "0 auto", background: "#FFFFFF", borderRadius: "16px", border: "1px solid #E8E8E8", overflow: "hidden" }}>
                <div style={{ padding: "32px", borderBottom: "1px solid #E8E8E8", background: "#F9FAFB" }}>
                    <h1 style={{ fontSize: "1.8rem", fontWeight: 700, margin: 0, color: "#111111", display: "flex", alignItems: "center", gap: "12px" }}>
                        <UserIcon size={28} color="#165DFC" />
                        Profile Settings
                    </h1>
                    <p style={{ color: "#6B6B6B", margin: "8px 0 0 0", fontSize: "0.95rem" }}>
                        Setup your Polyhunter identity to appear on leaderboards and agent pages.
                    </p>
                </div>

                <form onSubmit={handleSave} style={{ padding: "32px", display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#4B5563", marginBottom: "8px" }}>
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="e.g. polyhunter99"
                            maxLength={30}
                            style={{
                                width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #E5E7EB",
                                fontSize: "1rem", outline: "none", transition: "border-color 0.2s"
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = "#165DFC"}
                            onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#4B5563", marginBottom: "8px" }}>
                            Avatar URL
                        </label>
                        <input
                            type="url"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="https://example.com/avatar.png"
                            style={{
                                width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #E5E7EB",
                                fontSize: "1rem", outline: "none", transition: "border-color 0.2s"
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = "#165DFC"}
                            onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                        />
                        {avatarUrl && (
                            <div style={{ marginTop: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                                <img src={avatarUrl} alt="Avatar preview" style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", border: "1px solid #E8E8E8" }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                                <span style={{ fontSize: "0.8rem", color: "#9CA3AF" }}>Preview</span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "0.9rem", fontWeight: 600, color: "#4B5563", marginBottom: "8px" }}>
                            Bio
                        </label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell the community about yourself..."
                            rows={4}
                            maxLength={160}
                            style={{
                                width: "100%", padding: "12px 16px", borderRadius: "8px", border: "1px solid #E5E7EB",
                                fontSize: "1rem", outline: "none", resize: "none", fontFamily: "inherit", transition: "border-color 0.2s"
                            }}
                            onFocus={e => e.currentTarget.style.borderColor = "#165DFC"}
                            onBlur={e => e.currentTarget.style.borderColor = "#E5E7EB"}
                        />
                        <div style={{ textAlign: "right", fontSize: "0.8rem", color: "#9CA3AF", marginTop: "4px" }}>
                            {bio.length}/160
                        </div>
                    </div>

                    <div style={{ borderTop: "1px solid #E8E8E8", paddingTop: "24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.9rem", color: status.includes("Error") || status.includes("failed") ? "#DC2626" : "#059669", fontWeight: 500 }}>
                            {status}
                        </span>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: loading ? "#9CA3AF" : "#CCFF00",
                                color: "#000000", border: "none", borderRadius: "8px", padding: "12px 24px",
                                fontSize: "0.95rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px",
                                cursor: loading ? "not-allowed" : "pointer", transition: "background 0.15s"
                            }}
                            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#bfe600"; }}
                            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#CCFF00"; }}
                        >
                            <Save size={18} />
                            {loading ? "Saving..." : "Save Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
