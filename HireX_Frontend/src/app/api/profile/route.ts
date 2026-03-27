import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/db";
import { User } from "@/lib/models/User";
import { auth } from "@/lib/auth/auth";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const user = await User.findOne({ email: session.user.email }).select("-password -resetOtp -resetOtpExpires");
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({ profile: user }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const user = await User.findOne({ email: session.user.email });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const updates = await request.json();
        delete updates.password;
        delete updates.role;
        delete updates.email;

        const updatedUser = await User.findByIdAndUpdate(user._id, { $set: updates }, { new: true }).select("-password -resetOtp");

        return NextResponse.json({ message: "Profile updated", profile: updatedUser }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
