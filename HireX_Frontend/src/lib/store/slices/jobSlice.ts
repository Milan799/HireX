import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios/axiosClientInstance";

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchJobs = createAsyncThunk(
    "jobs/fetchJobs",
    async (
        params: { keyword?: string; location?: string; skip?: number; limit?: number; employerId?: string; sortBy?: string; sortOrder?: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosClient.get("/jobs", { params });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message);
        }
    }
);

export const fetchJobById = createAsyncThunk(
    "jobs/fetchJobById",
    async (id: string, { rejectWithValue }) => {
        try {
            const res = await axiosClient.get(`/jobs/${id}`);
            return res.data.job;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message);
        }
    }
);

export const createJob = createAsyncThunk(
    "jobs/createJob",
    async (payload: any, { rejectWithValue }) => {
        try {
            const res = await axiosClient.post("/jobs", payload);
            return res.data.job;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message);
        }
    }
);

export const updateJob = createAsyncThunk(
    "jobs/updateJob",
    async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
        try {
            const res = await axiosClient.put(`/jobs/${id}`, data);
            return res.data.job;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message);
        }
    }
);

export const deleteJob = createAsyncThunk(
    "jobs/deleteJob",
    async (id: string, { rejectWithValue }) => {
        try {
            await axiosClient.delete(`/jobs/${id}`);
            return id; // Return deleted ID for optimistic update
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message);
        }
    }
);

export const fetchEmployerStats = createAsyncThunk(
    "jobs/fetchEmployerStats",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosClient.get("/jobs/employer-stats");
            return res.data.stats;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message);
        }
    }
);

// ─── Slice ────────────────────────────────────────────────────────────────────

const jobSlice = createSlice({
    name: "job",
    initialState: {
        jobs: [] as any[],
        selectedJob: null as any,
        total: 0,
        stats: null as any,
        status: "idle" as "idle" | "loading" | "succeeded" | "failed",
        statsStatus: "idle" as "idle" | "loading" | "succeeded" | "failed",
        error: null as string | null,
    },
    reducers: {
        clearSelectedJob: (state) => {
            state.selectedJob = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchJobs
            .addCase(fetchJobs.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchJobs.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.jobs = action.payload.jobs;
                state.total = action.payload.total;
            })
            .addCase(fetchJobs.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            // fetchJobById
            .addCase(fetchJobById.fulfilled, (state, action) => {
                state.selectedJob = action.payload;
            })
            // createJob — optimistic prepend
            .addCase(createJob.fulfilled, (state, action) => {
                if (action.payload) {
                    state.jobs = [action.payload, ...state.jobs];
                    state.total += 1;
                }
            })
            // updateJob — update in place
            .addCase(updateJob.fulfilled, (state, action) => {
                if (action.payload) {
                    const idx = state.jobs.findIndex((j) => j._id === action.payload._id);
                    if (idx !== -1) state.jobs[idx] = action.payload;
                    if (state.selectedJob?._id === action.payload._id) {
                        state.selectedJob = action.payload;
                    }
                }
            })
            // deleteJob — remove from list
            .addCase(deleteJob.fulfilled, (state, action) => {
                state.jobs = state.jobs.filter((j) => j._id !== action.payload);
                state.total = Math.max(0, state.total - 1);
            })
            // employer stats
            .addCase(fetchEmployerStats.pending, (state) => {
                state.statsStatus = "loading";
            })
            .addCase(fetchEmployerStats.fulfilled, (state, action) => {
                state.stats = action.payload;
                state.statsStatus = "succeeded";
            })
            .addCase(fetchEmployerStats.rejected, (state) => {
                state.statsStatus = "failed";
            });
    },
});

export const { clearSelectedJob } = jobSlice.actions;
export default jobSlice.reducer;
