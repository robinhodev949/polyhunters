import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyMessage, getAddress, isAddress } from "viem";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error("Missing Supabase credentials in environment");
            return NextResponse.json({ error: "Server storage configuration error" }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        const formData = await req.formData();
        const file = formData.get("file") as File;
        const wallet = formData.get("wallet") as string;
        const signature = formData.get("signature") as string;
        const message = formData.get("message") as string;

        if (!file || !wallet || !signature || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!isAddress(wallet)) {
            return NextResponse.json({ error: "Invalid wallet address format" }, { status: 400 });
        }

        const normalizedWallet = getAddress(wallet);

        // Verify EVM signature
        const isValid = await verifyMessage({
            address: normalizedWallet,
            message: message,
            signature: signature as `0x${string}`,
        });

        if (!isValid) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });

        // Convert file to buffer for Supabase
        const buffer = await file.arrayBuffer();
        const fileExt = file.name.split('.').pop() || 'png';
        const fileName = `${normalizedWallet}-${uuidv4()}.${fileExt}`;

        // Upload to Supabase Storage 'avatars' bucket
        const { data, error } = await supabase.storage
            .from("avatars")
            .upload(fileName, buffer, {
                contentType: file.type,
                upsert: true,
            });

        if (error) {
            console.error("Supabase storage error:", error);
            return NextResponse.json({ error: "Failed to upload image to storage" }, { status: 500 });
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(fileName);

        return NextResponse.json({ url: publicUrl });
    } catch (e: any) {
        console.error("Upload error:", e);
        return NextResponse.json({ error: "Server upload error", details: e.message }, { status: 500 });
    }
}
