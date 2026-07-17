"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal, Settings, Power } from "lucide-react";
import { Agent } from "@/lib/agents";

interface TerminalViewProps {
    agent: Agent;
    onStop: () => void;
}

export function TerminalView({ agent, onStop }: TerminalViewProps) {
    const [logs, setLogs] = useState<string[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

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
        <div className="bg-neutral-950 rounded-xl border border-neutral-800 overflow-hidden flex flex-col h-[450px]">
            {/* Terminal Header */}
            <div className="bg-neutral-900 px-4 py-3 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-error"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-success"></div>
                    </div>
                    <div className="text-neutral-400 text-[0.85rem] font-mono flex items-center gap-1.5">
                        <Terminal size={14} /> OpenClaw Shell — {agent.name} <span className="cursor-blink">_</span>
                    </div>
                </div>
                <div className="flex gap-2.5">
                    <button className="bg-transparent border-none text-neutral-400 cursor-pointer"><Settings size={14} /></button>
                    <button
                        onClick={() => {
                            if ((window as any).__simInterval) clearInterval((window as any).__simInterval);
                            onStop();
                        }}
                        className="flex items-center gap-1 bg-error/10 text-error border border-error/20 rounded px-2 py-1 text-[0.75rem] cursor-pointer"
                    >
                        <Power size={12} /> Stop Node
                    </button>
                </div>
            </div>

            {/* Terminal Body */}
            <div
                ref={scrollRef}
                className="terminal-scroll flex-1 p-4 overflow-y-auto font-mono text-[0.85rem] leading-relaxed text-neutral-300"
            >
                {logs.map((log, index) => (
                    <div key={index} dangerouslySetInnerHTML={{ __html: log }} className="mb-1" />
                ))}
            </div>
        </div>
    );
}
