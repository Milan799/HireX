import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/db";
import { Job } from "@/lib/models/Job";
import { Application } from "@/lib/models/Application";
import { User } from "@/lib/models/User";
import { auth } from "@/lib/auth/auth";

export async function GET(request: Request) {
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

        // 1. Active Jobs
        const activeJobsCount = await Job.countDocuments({ 
            employerId: user._id, 
            status: "Active" 
        });

        // Get all Job IDs owned by this employer
        const employerJobs = await Job.find({ employerId: user._id }).select("_id");
        const jobIds = employerJobs.map(job => job._id);

        // 2. Total Applications
        const totalApplications = await Application.countDocuments({
            jobId: { $in: jobIds }
        });

        // 3. Candidates Hired (Assuming 'Offer' means hired)
        const hiredCandidates = await Application.countDocuments({
            jobId: { $in: jobIds },
            status: "Offer"
        });

        // 4. Total Views (Not modeled currently, returning 0 or mock data)
        const totalViews = activeJobsCount * 124; // Dummy value based on active jobs to provide somewhat realistic visual UI feedback until views model arises.

        const stats = {
            activeJobs: activeJobsCount,
            totalApplications,
            hiredCandidates,
            totalViews
        };

        return NextResponse.json({ stats }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
