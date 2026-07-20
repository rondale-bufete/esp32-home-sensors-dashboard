import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request) {
    try {
        const body = await request.json();
        const { temperature, humidity } = body;

        if (typeof temperature !== "number" || typeof humidity !== "number") {
            return NextResponse.json(
                { error: "temperature and humidity must be numbers" },
                { status: 400 }
            );
        }
        if (temperature < -40 || temperature > 80 || humidity < 0 || humidity > 100) {
            return NextResponse.json(
                { error: "Reading out of plausible range, rejected" },
                { status: 422 }
            );
        }

        const supabase = createAdminClient();
        const { error } = await supabase
            .from("readings")
            .insert({ temperature, humidity });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
}

export async function GET() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from("readings")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ readings: data });
}