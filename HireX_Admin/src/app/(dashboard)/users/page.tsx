"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Trash2, Search, User as UserIcon, Calendar, MapPin, Briefcase } from "lucide-react";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/admin/users`, {
        headers: { Authorization: `Bearer ${session?.user?.accessToken || ''}` },
        withCredentials: true
      });
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchUsers();
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to completely erase this candidate? All associated applications will be destroyed.")) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.accessToken || ''}` },
        withCredentials: true
      });
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete user.");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/20 dark:border-slate-800/60 shadow-sm">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400">
              <UserIcon size={20} />
            </div>
            <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
              Candidates Registry
            </h2>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md ml-12">
            View, moderate, and manage job seekers registered on the platform.
          </p>
        </div>
        
        <div className="relative w-full sm:w-80 group">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl bg-white/60 dark:bg-[#0b1120]/60 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 backdrop-blur-md transition-all shadow-sm group-hover:shadow-md group-hover:border-slate-300 dark:group-hover:border-slate-600"
          />
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 absolute left-4 top-3 transition-colors group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400" />
        </div>
      </div>

      {/* Glass Data Table */}
      <div className="bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/80 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 rounded-3xl overflow-hidden shadow-lg shadow-slate-200/20 dark:shadow-black/20 backdrop-blur-xl">
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-600 dark:text-slate-300 border-b border-slate-200/50 dark:border-slate-700/50 uppercase text-xs tracking-wider font-semibold">
              <tr>
                <th className="px-8 py-5">Profile</th>
                <th className="px-6 py-5">Location</th>
                <th className="px-6 py-5">Experience</th>
                <th className="px-6 py-5">Registered</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50 dark:divide-slate-800/50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-500 font-medium">
                    No candidates found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm border border-white/50 dark:border-slate-600/30 group-hover:shadow-md transition-all group-hover:scale-105">
                          {user.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white drop-shadow-sm">{user.fullName}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
                        <MapPin size={14} className="mr-2 text-slate-400 drop-shadow-sm" />
                        {user.location?.city || user.location?.country ? (
                          `${user.location.city || ''}${user.location.city && user.location.country ? ', ' : ''}${user.location.country || ''}`
                        ) : (
                          <span className="text-slate-400 italic">Global / Not Set</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                       <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100/50 dark:bg-slate-800/50 w-max px-3 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                         <Briefcase size={14} className="mr-2 text-indigo-400" />
                         {user.experienceYears} Years
                       </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300">
                         <Calendar size={14} className="mr-2 text-slate-400" />
                         {new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300 border border-transparent hover:border-red-200 dark:hover:border-red-500/20 group-hover:opacity-100 opacity-60"
                        title="Delete Candidate"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
