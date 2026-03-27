import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/db";
import { Job } from "@/lib/models/Job";
import { User } from "@/lib/models/User";
import { auth } from "@/lib/auth/auth";

export async function GET(request: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(request.url);
        const keyword = searchParams.get("keyword") || "";
        const location = searchParams.get("location") || "";
        const limit = parseInt(searchParams.get("limit") || "10", 10);
        const skip = parseInt(searchParams.get("skip") || "0", 10);
        const employerId = searchParams.get("employerId");

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: any = {};

        // If not requesting an employer's specific jobs, only show Active jobs
        if (!employerId) {
            query.status = "Active";
        } else {
            query.employerId = employerId;
        }

        if (keyword) {
            query.$or = [
                { title: { $regex: keyword, $options: "i" } },
                { company: { $regex: keyword, $options: "i" } },
                { skillsRequired: { $regex: keyword, $options: "i" } },
            ];
        }
        if (location) {
            query.location = { $regex: location, $options: "i" };
        }

        const jobs = await Job.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("employerId", "companyName companyWebsite email");

        const total = await Job.countDocuments(query);

        return NextResponse.json({ jobs, total, skip, limit }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const user = await User.findOne({ email: session.user.email });
        if (!user || user.role !== "recruiter") {
            return NextResponse.json({ error: "Recruiter access required." }, { status: 403 });
        }

        const body = await request.json();
        const newJob = await Job.create({
            ...body,
            employerId: user._id,
        });

        return NextResponse.json({ message: "Job posted successfully", job: newJob }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
