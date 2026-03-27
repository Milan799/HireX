import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/db";
import { Job } from "@/lib/models/Job";
import { User } from "@/lib/models/User";
import { auth } from "@/lib/auth/auth";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        await connectToDatabase();
        const { id } = await props.params;
        
        const job = await Job.findById(id).populate("employerId", "companyName companyWebsite email");
        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }
        
        return NextResponse.json({ job }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
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

        const { id } = await props.params;
        const job = await Job.findById(id);
        
        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        if (job.employerId.toString() !== user._id.toString()) {
            return NextResponse.json({ error: "Unauthorized to update this job." }, { status: 403 });
        }

        const body = await request.json();
        
        const updatedJob = await Job.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        ).populate("employerId", "companyName companyWebsite email");

        return NextResponse.json({ message: "Job updated successfully", job: updatedJob }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
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

        const { id } = await props.params;
        const job = await Job.findById(id);
        
        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        if (job.employerId.toString() !== user._id.toString()) {
            return NextResponse.json({ error: "Unauthorized to delete this job." }, { status: 403 });
        }

        await Job.findByIdAndDelete(id);

        return NextResponse.json({ message: "Job deleted successfully", id }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
