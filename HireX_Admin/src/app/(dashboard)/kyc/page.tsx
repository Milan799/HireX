"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Search, ShieldCheck, FileText, Check, X, ExternalLink, Building2 } from "lucide-react";

export default function AdminKycPage() {
    const { data: session } = useSession();
    const [documents, setDocuments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Rejection Modal State
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
    const [rejectionReason, setRejectionReason] = useState("");

    const fetchPendingKyc = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/kyc/admin/pending`, {
                headers: { Authorization: `Bearer ${session?.user?.accessToken || ''}` },
                withCredentials: true
            });
            setDocuments(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) fetchPendingKyc();
    }, [session]);

    const handleEvaluate = async (docId: string, status: "verified" | "rejected", reason?: string) => {
        if (status === "verified" && !confirm("Are you sure you want to approve this company? They will immediately gain hiring privileges.")) {
            return;
        }

        try {
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/kyc/admin/evaluate/${docId}`, {
                status,
                rejectionReason: reason || ""
            }, {
                headers: { Authorization: `Bearer ${session?.user?.accessToken || ''}` },
                withCredentials: true
            });

            // Remove from list
            setDocuments(documents.filter((doc) => doc._id !== docId));
            if (status === "rejected") {
                setIsRejectModalOpen(false);
                setRejectionReason("");
            }
        } catch (err) {
            console.error("Evaluation failed", err);
            alert("Failed to evaluate document.");
        }
    };

    const openRejectModal = (docId: string) => {
        setSelectedDocId(docId);
        setRejectionReason("");
        setIsRejectModalOpen(true);
    };

    const submitRejection = () => {
        if (!rejectionReason.trim()) {
            alert("Please provide a rejection reason.");
            return;
        }
        if (selectedDocId) {
            handleEvaluate(selectedDocId, "rejected", rejectionReason);
        }
    };

    const filteredDocs = documents.filter((d) =>
        d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.recruiterId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">

            {/* Premium Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/20 dark:border-slate-800/60 shadow-sm">
                <div>
                    <div className="flex items-center space-x-3 mb-1">
                        <div className="p-2 bg-amber-100 dark:bg-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400">
                            <ShieldCheck size={20} />
                        </div>
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                            KYC Approvals
                        </h2>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md ml-12">
                        Review and verify pending company registrations and identity documents.
                    </p>
                </div>

                <div className="relative w-full sm:w-80 group">
                    <input
                        type="text"
                        placeholder="Search company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl bg-white/60 dark:bg-[#0b1120]/60 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 backdrop-blur-md transition-all shadow-sm group-hover:shadow-md group-hover:border-slate-300 dark:group-hover:border-slate-600"
                    />
                    <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-4 top-3 transition-colors group-focus-within:text-amber-500 dark:group-focus-within:text-amber-400" />
                </div>
            </div>

            {/* Glass Data Table */}
            <div className="bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/20 dark:shadow-black/20 backdrop-blur-xl">
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-600 dark:text-slate-300 border-b border-slate-200/50 dark:border-slate-700/50 uppercase text-xs tracking-wider font-semibold">
                            <tr>
                                <th className="px-8 py-5">Company Identity</th>
                                <th className="px-6 py-5">Contact Details</th>
                                <th className="px-6 py-5">Submitted Document</th>
                                <th className="px-6 py-5">Date</th>
                                <th className="px-8 py-5 text-right">Evaluation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center">
                                        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    </td>
                                </tr>
                            ) : filteredDocs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-slate-500 font-medium">
                                        No pending KYC requests found.
                                    </td>
                                </tr>
                            ) : (
                                filteredDocs.map((doc) => (
                                    <tr key={doc._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-8 py-5">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 to-indigo-50 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-indigo-500 dark:text-indigo-400 shadow-sm border border-white/50 dark:border-slate-600/30 group-hover:shadow-md transition-all group-hover:scale-105">
                                                    <Building2 size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white drop-shadow-sm flex items-center gap-2">
                                                        {doc.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate max-w-[200px]" title={doc.location}>{doc.location}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col gap-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                                                <span>{doc.recruiterId?.email || "No email"}</span>
                                                <span className="text-slate-500 text-xs">{doc.recruiterId?.phone || "No phone provided"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <a href={doc.kycFileUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 w-max px-3 py-2 rounded-xl border border-indigo-200/50 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors">
                                                <FileText size={16} className="mr-2" />
                                                {doc.kycDocumentType}
                                                <ExternalLink size={12} className="ml-2 opacity-50" />
                                            </a>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
                                                {new Date(doc.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEvaluate(doc._id, "verified")}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 rounded-lg transition-colors border border-emerald-200/50 dark:border-emerald-500/20"
                                                >
                                                    <Check size={14} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => openRejectModal(doc._id)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 dark:text-rose-400 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-lg transition-colors border border-rose-200/50 dark:border-rose-500/20"
                                                >
                                                    <X size={14} /> Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Rejection Modal overlay */}
            {isRejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#12121a] p-8 rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-200 dark:border-white/10 relative pb-10">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Reject Company KYC</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Please provide a reason to help the employer understand why their document was rejected.</p>

                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="w-full h-32 p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 text-sm outline-none focus:border-rose-500 dark:focus:border-rose-500 dark:text-white resize-none mb-6 font-medium"
                            placeholder="E.g., The uploaded GST certificate is blurred and illegible."
                        />

                        <div className="flex justify-end gap-3 w-full">
                            <button onClick={() => setIsRejectModalOpen(false)} className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition">Cancel</button>
                            <button onClick={submitRejection} className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition">Confirm Rejection</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
