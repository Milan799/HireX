"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UploadCloud, CheckCircle2, Building2, Phone, MapPin, Globe, Loader2, AlertCircle } from "lucide-react";
import { notify } from "@/lib/utils";
import axiosClient from "@/lib/axios/axiosClientInstance";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchCurrentUser } from "@/lib/store/slices/userSlice";

export default function KycOnboardingPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { data: user } = useAppSelector((state) => state.user);
    const { data: session, update } = useSession();

    const [formData, setFormData] = useState({
        companyName: "",
        fullName: "",
        phone: "",
        city: "",
        country: "",
        industry: "",
        website: "",
        bio: "",
        documentType: "Company Registration"
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                companyName: user.companyId?.name || user.companyName || prev.companyName,
                fullName: user.fullName || prev.fullName,
                phone: user.companyId?.phone || user.phone || prev.phone,
                city: user.companyId?.location?.city || user.location?.city || prev.city,
                country: user.companyId?.location?.country || user.location?.country || prev.country,
                industry: user.companyId?.industry || prev.industry,
                website: user.companyId?.website || user.website || prev.website,
                bio: user.companyId?.description || user.bio || prev.bio,
                documentType: user.companyId?.kycDocumentType || prev.documentType,
            }));
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Check size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                notify("File size must be less than 5MB", "error");
                if (fileInputRef.current) fileInputRef.current.value = "";
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) {
            notify("Please upload a verification document.", "error");
            return;
        }

        try {
            setIsSubmitting(true);
            const submitData = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value);
            });
            submitData.append("verificationDocument", selectedFile);

            const res = await axiosClient.post("/kyc/submit", submitData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            if (res.data?.success) {
                notify("KYC Submitted successfully! Redirecting...", "success");

                // Force session refresh so middleware unblocks the dashboard
                await update({ hasCompany: true });
                await dispatch(fetchCurrentUser());

                // Hard redirect to force full re-evaluation
                window.location.href = "/employer/dashboard";
            }
        } catch (error: any) {
            console.error("KYC Submit error details:", error?.response?.data || error.message || error);
            notify(error?.response?.data?.message || "Failed to submit KYC. The server returned an error.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 dark:bg-[#0a0a0c]">
            <div className="w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row dark:bg-[#121216] dark:border dark:border-white/5">

                {/* Left Sidebar Info */}
                <div className="bg-gradient-to-br from-violet-600 to-indigo-800 p-10 text-white md:w-2/5 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <h1 className="text-3xl font-black mb-2">Welcome to HireX</h1>
                        <p className="text-violet-100 font-medium mb-12">Just one last step before you can start aggressively building your team.</p>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-white/20 p-2 rounded-xl border border-white/10"><Building2 size={20} /></div>
                                <div>
                                    <h3 className="font-bold text-lg">Company Profile</h3>
                                    <p className="text-violet-200 text-sm">Tell us about your organization to help candidates understand your brand.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="bg-white/20 p-2 rounded-xl border border-white/10"><CheckCircle2 size={20} /></div>
                                <div>
                                    <h3 className="font-bold text-lg">Identity Verification</h3>
                                    <p className="text-violet-200 text-sm">Upload standard documentation to verify your legitimacy. Security is our top priority.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 bg-white/10 rounded-2xl p-4 border border-white/10 backdrop-blur-md relative z-10">
                        <p className="text-sm font-medium flex items-center gap-2 text-violet-100">
                            <AlertCircle size={16} className="text-amber-300" /> After submission, you can immediately post jobs while our team reviews the documents.
                        </p>
                    </div>
                </div>

                {/* Right Side Form */}
                <div className="md:w-3/5 p-8 sm:p-12">
                    <h2 className="text-2xl font-black text-slate-900 mb-6 dark:text-white">Complete KYC Onboarding</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Company Legal Name *</label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none"><Building2 size={16} className="text-slate-400" /></div>
                                    <input required name="companyName" value={formData.companyName} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-sm font-bold text-slate-900 outline-none focus:border-violet-500 focus:bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-violet-500 transition-all" placeholder="Acme Corp Ltd." />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Recruiter Full Name *</label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none"><Building2 size={16} className="text-slate-400" /></div>
                                    <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-sm font-bold text-slate-900 outline-none focus:border-violet-500 focus:bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-violet-500 transition-all" placeholder="John Doe" disabled/>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone Number *</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone size={16} className="text-slate-400" /></div>
                                    <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-sm font-bold text-slate-900 outline-none focus:border-violet-500 focus:bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-violet-500 transition-all" placeholder="+91 12345 67890" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Website URL</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Globe size={16} className="text-slate-400" /></div>
                                    <input name="website" value={formData.website} onChange={handleInputChange} type="url" className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-sm font-bold text-slate-900 outline-none focus:border-violet-500 focus:bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-violet-500 transition-all" placeholder="https://acme.com" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">City *</label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none"><MapPin size={16} className="text-slate-400" /></div>
                                    <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-sm font-bold text-slate-900 outline-none focus:border-violet-500 focus:bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-violet-500 transition-all" placeholder="e.g. Bangalore" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Country *</label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 pointer-events-none"><MapPin size={16} className="text-slate-400" /></div>
                                    <input required name="country" value={formData.country} onChange={handleInputChange} type="text" className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-sm font-bold text-slate-900 outline-none focus:border-violet-500 focus:bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-violet-500 transition-all" placeholder="e.g. India" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Industry *</label>
                            <select required name="industry" value={formData.industry} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none hover:border-violet-300 focus:border-violet-500 focus:bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:border-violet-500/50 dark:focus:border-violet-500 transition-all cursor-pointer">
                                <option value="" disabled>Select Industry</option>
                                <option value="IT Jobs">IT Jobs</option>
                                <option value="Sales Jobs">Sales Jobs</option>
                                <option value="Marketing Jobs">Marketing Jobs</option>
                                <option value="Data Science Jobs">Data Science Jobs</option>
                                <option value="HR Jobs">HR Jobs</option>
                                <option value="Engineering Jobs">Engineering Jobs</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Company Description / Bio *</label>
                            <textarea required name="bio" value={formData.bio} onChange={handleInputChange as any} rows={3} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 outline-none focus:border-violet-500 focus:bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:focus:border-violet-500 transition-all" placeholder="Briefly describe your company's mission and culture..."></textarea>
                        </div>

                        <div className="my-6 border-t border-slate-200 dark:border-white/10"></div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Document Type *</label>
                            <select required name="documentType" value={formData.documentType} onChange={handleInputChange} className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-3 text-sm font-bold text-slate-900 outline-none hover:border-violet-300 focus:border-violet-500 focus:bg-white dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:border-violet-500/50 dark:focus:border-violet-500 transition-all cursor-pointer">
                                <option value="Company Registration">Company Registration Certificate</option>
                                <option value="GST Certificate">GST / VAT Certificate</option>
                                <option value="PAN / Tax ID">PAN / Tax ID Card</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Upload Document * (PDF / Images)</label>
                            <div onClick={() => fileInputRef.current?.click()} className={`w-full flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${selectedFile ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10" : "border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20 dark:hover:bg-white/10"}`}>
                                <div className="space-y-2 text-center flex flex-col items-center">
                                    <div className={`p-3 rounded-full ${selectedFile ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-slate-200 dark:bg-white/10 text-slate-500"}`}>
                                        {selectedFile ? <CheckCircle2 size={24} /> : <UploadCloud size={24} />}
                                    </div>
                                    <div className="text-sm">
                                        {selectedFile ? (
                                            <span className="font-bold text-emerald-700 dark:text-emerald-400">{selectedFile.name}</span>
                                        ) : (
                                            <span className="font-bold text-slate-600 dark:text-slate-300">Click to upload <span className="font-medium text-slate-500">or drag and drop</span></span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-400 font-medium">PNG, JPG, PDF up to 5MB</p>
                                </div>
                            </div>
                            <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" onChange={handleFileChange} />
                        </div>

                        <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 rounded-xl text-white font-black hover:shadow-xl hover:shadow-violet-900/20 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100">
                            {isSubmitting ? <><Loader2 size={18} className="animate-spin" /> Uploading securely...</> : "Submit Registration & KYC"}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}
