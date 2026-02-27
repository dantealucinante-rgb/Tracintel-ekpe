import { NextResponse } from "next/server";
import { checkModelHealth } from "@/lib/ai/models";

export async function GET() {
    try {
        const health = await checkModelHealth();
        return NextResponse.json(health);
    } catch (error) {
        console.error("Health check failed:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
