import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/db";
import { Application } from "@/lib/models/Application";
import { User } from "@/lib/models/User";
import { Job } from "@/lib/models/Job";
import { auth } from "@/lib/auth/auth";

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const user = await User.findOne({ email: session.user.email });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const { searchParams } = new URL(request.url);
        const jobId = searchParams.get("jobId");

        if (user.role === "recruiter") {
            if (!jobId) return NextResponse.json({ error: "Job ID required" }, { status: 400 });

            const job = await Job.findById(jobId);
            if (!job || job.employerId.toString() !== user._id.toString()) {
                return NextResponse.json({ error: "Unauthorized access to job" }, { status: 403 });
            }

            const applications = await Application.find({ jobId })
                .populate("candidateId", "fullName email resumeUrl skills experience education phone location")
                .sort({ createdAt: -1 });
            return NextResponse.json({ applications }, { status: 200 });
        } else {
            const applications = await Application.find({ candidateId: user._id })
                .populate("jobId", "title company location status")
                .sort({ createdAt: -1 });
            return NextResponse.json({ applications }, { status: 200 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const user = await User.findOne({ email: session.user.email });
        if (!user || user.role !== "candidate") {
            return NextResponse.json({ error: "Only candidates can apply." }, { status: 403 });
        }

        const body = await request.json();
        const { jobId, coverLetter } = body;

        const existingApp = await Application.findOne({ candidateId: user._id, jobId });
        if (existingApp) {
            return NextResponse.json({ error: "Already applied to this job." }, { status: 400 });
        }

        const application = await Application.create({
            candidateId: user._id,
            jobId,
            resumeUrl: user.resumeUrl,
            coverLetter,
            status: "Pending",
        });

        return NextResponse.json({ message: "Applied successfully", application }, { status: 201 });
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
        if (!user || user.role !== "recruiter") {
            return NextResponse.json({ error: "Only recruiters can update status." }, { status: 403 });
        }

        const body = await request.json();
        const { applicationId, status } = body;

        const application = await Application.findById(applicationId).populate("jobId");
        if (!application) return NextResponse.json({ error: "Application not found" }, { status: 404 });

        // Ensure the recruiter owns the job
        if ((application.jobId as any).employerId.toString() !== user._id.toString()) {
            return NextResponse.json({ error: "Unauthorized to update this application" }, { status: 403 });
        }

        application.status = status;
        await application.save();

        return NextResponse.json({ message: "Status updated successfully", application }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
