"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal, Settings, Power, Sun, Moon } from "lucide-react";
import { Agent } from "@/lib/agents";

interface TerminalViewProps {
    agent: Agent;
    onStop: () => void;
}

export function TerminalView({ agent, onStop }: TerminalViewProps) {
    const [logs, setLogs] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isDarkTheme, setIsDarkTheme] = useState(true);

    useEffect(() => {
        // Initial boot sequence
        const bootLogs = [
            `[SYS] Initializing OpenClaw environment for node [${agent.openClawHash.substring(0, 12)}...]`,
            `[SYS] Connecting to Polymarket Polygon RPC...`,
            `[SYS] Authenticated as ${agent.name}`,
            `[DATA] Subscribing to market feeds: ${agent.tags.join(", ")}`,
            `[EXEC] Engine ready. Commencing predictive analysis.`
        ];

        let i = 0;
        const bootInterval = setInterval(() => {
            if (i < bootLogs.length) {
                setLogs(prev => [...prev, `<span class="log-info">${bootLogs[i]}</span>`]);
                i++;
            } else {
                clearInterval(bootInterval);
                startSimulation();
            }
        }, 800);

        return () => clearInterval(bootInterval);
    }, [agent]);

    const startSimulation = () => {
        // Simulate live trading logs
        const possibleActions = [
            () => `<span class="log-timestamp">[${new Date().toLocaleTimeString()}]</span> <span class="log-info">[SCAN]</span> Analyzing 4 new markets in ${agent.tags[0]}...`,
            () => `<span class="log-timestamp">[${new Date().toLocaleTimeString()}]</span> <span class="log-warn">[CALC]</span> Probability divergence detected: Model says 64%, Market at 58%`,
            () => `<span class="log-timestamp">[${new Date().toLocaleTimeString()}]</span> <span class="log-trade">[EXEC]</span> BUY 500 YES shares @ 0.58c (Hash: 0x${Math.random().toString(16).substr(2, 8)}...)`,
            () => `<span class="log-timestamp">[${new Date().toLocaleTimeString()}]</span> <span class="log-success">[FILL]</span> Order filled instantly via Polygon mainnet.`,
            () => `<span class="log-timestamp">[${new Date().toLocaleTimeString()}]</span> <span class="log-info">[INFO]</span> Awaiting resolution for 12 active positions.`,
            () => `<span class="log-timestamp">[${new Date().toLocaleTimeString()}]</span> <span class="log-profit">[REVENUE]</span> Market resolved YES. Payout: +$142.50 USDC`,
        ];

        const simInterval = setInterval(() => {
            const randomAction = possibleActions[Math.floor(Math.random() * possibleActions.length)];
            setLogs(prev => [...prev, randomAction()]);
        }, 2500);

        // Store interval ID on window so a stop button can theoretically clear it
        (window as any).__simInterval = simInterval;
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <div style={{
            background: isDarkTheme ? "#0A0A0A" : "#F9FAFB",
            borderRadius: "12px",
            border: isDarkTheme ? "1px solid #262626" : "1px solid #E5E7EB",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "450px"
        }}>
            {/* Terminal Header */}
            <div style={{
                background: isDarkTheme ? "#171717" : "#F3F4F6",
                padding: "12px 16px",
                borderBottom: isDarkTheme ? "1px solid #262626" : "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#EF4444" }}></div>
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#EAB308" }}></div>
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#22C55E" }}></div>
                    </div>
                    <div style={{ color: isDarkTheme ? "#A3A3A3" : "#4B5563", fontSize: "0.85rem", fontFamily: "monospace", display: "flex", alignItems: "center", gap: "6px" }}>
                        <Terminal size={14} /> OpenClaw Shell — {agent.name} <span className="cursor-blink">_</span>
                    </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {/* Theme Toggle Button */}
                    <button 
                        onClick={() => setIsDarkTheme(!isDarkTheme)}
                        style={{
                            background: "transparent", border: "none", color: isDarkTheme ? "#A3A3A3" : "#4B5563", cursor: "pointer", display: "flex", alignItems: "center"
                        }}
                        title={isDarkTheme ? "Light Mode" : "Dark Mode"}
                    >
                        {isDarkTheme ? <Sun size={14} /> : <Moon size={14} />}
                    </button>

                    <button style={{ background: "transparent", border: "none", color: isDarkTheme ? "#A3A3A3" : "#4B5563", cursor: "pointer" }}><Settings size={14} /></button>
                    
                    <button
                        onClick={() => {
                            if ((window as any).__simInterval) clearInterval((window as any).__simInterval);
                            onStop();
                        }}
                        style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(239, 68, 68, 0.1)", color: "#EF4444", border: "1px solid rgba(239, 68, 68, 0.2)", borderRadius: "4px", padding: "4px 8px", fontSize: "0.75rem", cursor: "pointer" }}
                    >
                        <Power size={12} /> Stop Node
                    </button>
                </div>
            </div>

            {/* Terminal Body */}
            <div
                ref={scrollRef}
                className="terminal-scroll"
                style={{
                    flex: 1,
                    padding: "16px",
                    overflowY: "auto",
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    fontSize: "0.85rem",
                    lineHeight: "1.6",
                    color: isDarkTheme ? "#D4D4D8" : "#1F2937"
                }}
            >
                {logs.map((log, index) => (
                    <div key={index} dangerouslySetInnerHTML={{ __html: log }} style={{ marginBottom: "4px" }} />
                ))}
            </div>
            
            {/* Inject log styles for Light/Dark terminal views compatibility */}
            <style dangerouslySetInnerHTML={{ __html: `
                .log-timestamp { color: ${isDarkTheme ? "#71717A" : "#6B7280"}; }
                .log-info { color: ${isDarkTheme ? "#3B82F6" : "#2563EB"}; }
                .log-warn { color: ${isDarkTheme ? "#F59E0B" : "#D97706"}; }
                .log-trade { color: ${isDarkTheme ? "#8B5CF6" : "#7C3AED"}; }
                .log-success { color: ${isDarkTheme ? "#10B981" : "#059669"}; }
                .log-profit { color: ${isDarkTheme ? "#10B981" : "#059669"}; font-weight: 700; }
            `}} />
        </div>
    );
}
