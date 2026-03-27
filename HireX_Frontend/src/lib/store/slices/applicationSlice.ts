import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/lib/axios/axiosClientInstance";

export const fetchMyApplications = createAsyncThunk(
    "applications/fetchMyApplications",
    async (_, { rejectWithValue }) => {
        try {
            const res = await axiosClient.get("/applications");
            return res.data.applications;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message);
        }
    }
);

export const applyToJob = createAsyncThunk(
    "applications/applyToJob",
    async (
        { jobId, coverLetter }: { jobId: string; coverLetter?: string },
        { rejectWithValue }
    ) => {
        try {
            const res = await axiosClient.post("/applications", { jobId, coverLetter });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message);
        }
    }
);

export const fetchJobApplications = createAsyncThunk(
    "applications/fetchJobApplications",
    async (jobId: string, { rejectWithValue }) => {
        try {
            const res = await axiosClient.get(`/applications?jobId=${jobId}`);
            return res.data.applications;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message);
        }
    }
);

export const updateApplicationStatus = createAsyncThunk(
    "applications/updateStatus",
    async ({ applicationId, status }: { applicationId: string; status: string }, { rejectWithValue }) => {
        try {
            const res = await axiosClient.put("/applications", { applicationId, status });
            return res.data.application;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || err.response?.data?.error || err.message);
        }
    }
);

const applicationSlice = createSlice({
    name: "application",
    initialState: {
        applications: [] as any[],
        status: "idle",
        error: null as string | null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMyApplications.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchMyApplications.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.applications = action.payload;
            })
            .addCase(fetchMyApplications.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload as string;
            })
            // Job Applications
            .addCase(fetchJobApplications.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchJobApplications.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.applications = action.payload;
            })
            // Update Status
            .addCase(updateApplicationStatus.fulfilled, (state, action) => {
                // Update the specific application in the local state
                const idx = state.applications.findIndex((app: any) => app._id === action.payload._id);
                if (idx !== -1) {
                    state.applications[idx] = action.payload;
                }
            });
    },
});

export default applicationSlice.reducer;
