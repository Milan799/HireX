"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Trash2, MessageSquare, Mail, Calendar, User as UserIcon } from "lucide-react";

export default function AdminMessagesPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/admin/messages", {
        headers: { Authorization: `Bearer ${session?.user?.accessToken || ''}` },
        withCredentials: true
      });
      setMessages(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) fetchMessages();
  }, [session]);

  const handleDelete = async (id: string) => {
    if (!confirm("Permanently delete this message?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/messages/${id}`, {
        headers: { Authorization: `Bearer ${session?.user?.accessToken || ''}` },
        withCredentials: true
      });
      setMessages(messages.filter((m) => m._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete message.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Premium Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md p-6 rounded-3xl border border-white/20 dark:border-slate-800/60 shadow-sm relative overflow-hidden">
        
        {/* Glow effect on header */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 w-full flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <div className="p-2 bg-pink-100 dark:bg-pink-500/20 rounded-xl text-pink-600 dark:text-pink-400 shadow-inner">
                <MessageSquare size={20} />
              </div>
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300">
                Support Communications
              </h2>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md ml-12">
              Review messages and inquiries submitted via the platform's contact form.
            </p>
          </div>
          <div className="hidden sm:flex items-center text-xs font-semibold uppercase tracking-widest text-pink-500 dark:text-pink-400 bg-pink-50 dark:bg-pink-500/10 px-4 py-2 border border-pink-200 dark:border-pink-500/30 rounded-full">
            {messages.length} Tickets
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
             <div key={i} className="bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 rounded-3xl p-6 h-64 animate-pulse bg-slate-200/20 dark:bg-slate-800/20 border border-slate-200/50 dark:border-slate-700/50"></div>
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 flex flex-col items-center justify-center min-h-[400px] rounded-3xl text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-800/50">
          <MessageSquare className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-4" />
          <p className="font-medium text-lg">Inbox Zero</p>
          <p className="text-sm">No new contact messages available.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {messages.map((msg) => (
            <div key={msg._id} className="bg-white/80 dark:bg-[#0B1120]/80 backdrop-blur-xl shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 rounded-3xl p-6 flex flex-col border border-slate-200/50 dark:border-slate-800/50 group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
              
              {/* Subtle accent hover bar */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="flex justify-between items-start mb-5">
                <div className="flex items-center space-x-3 max-w-[85%]">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-pink-500 dark:text-pink-400 flex-shrink-0 group-hover:scale-110 transition-transform">
                     <UserIcon size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">{msg.name}</h3>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 group/email hover:text-indigo-500 transition-colors">
                      <Mail size={10} className="mr-1" />
                      <a href={`mailto:${msg.email}`} className="truncate">{msg.email}</a>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 p-2 rounded-xl transition-all border border-transparent hover:border-red-200 dark:hover:border-red-500/20"
                  title="Delete message"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <div className="bg-slate-50/50 dark:bg-[#0b1120]/50 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-4 flex-1 mb-4">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap line-clamp-6 group-hover:line-clamp-none transition-all duration-300">
                  {msg.message}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-auto pt-2 border-t border-slate-100 dark:border-slate-800/80">
                 <div className="flex items-center">
                    <Calendar size={12} className="mr-1.5 opacity-70" />
                    {new Date(msg.createdAt).toLocaleDateString(undefined, {
                      weekday: 'short', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                 </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
