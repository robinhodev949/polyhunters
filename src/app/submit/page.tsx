"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SubmitRedirectPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/studio");
    }, [router]);

    return (
        <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", color: "#6B6B6B" }}>
            <div style={{ textAlign: "center" }}>
                <div className="spinner" style={{ border: "3px solid #E8E8E8", borderTopColor: "#165DFC", borderRadius: "50%", width: "24px", height: "24px", animation: "spin 1s linear infinite", margin: "0 auto 16px" }}></div>
                <p>Redirecting to Creator Studio...</p>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
            `}} />
        </div>
    );
}
