"use client";

import { useState, useEffect, useRef } from "react";
import axiosClient from "@/lib/axios/axiosClientInstance";
import { Bell, Check, Clock, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useAppSelector } from "@/lib/store/hooks";
import { io } from "socket.io-client";

interface Notification {
    _id: string;
    title: string;
    message: string;
    isRead: boolean;
    link?: string;
    createdAt: string;
}

export default function NotificationDropdown() {
    const { data: user } = useAppSelector((state) => state.user);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const res = await axiosClient.get("/notifications");
            if (res.data.success) {
                setNotifications(res.data.data);
            }
        } catch (error: any) {
            if (error.name === 'CanceledError' || error.message === 'canceled') return;
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        if (user?._id) {
            fetchNotifications();
        }
    }, [user?._id]);

    useEffect(() => {
        if (!user?._id) return;
        
        const socketUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "http://localhost:5000";
        const socket = io(socketUrl);
        
        socket.emit("join", user._id);
        
        socket.on("newNotification", (newNotif: Notification) => {
            setNotifications(prev => {
                // Ensure no duplicate notifications by checking ID
                if (prev.some(n => n._id === newNotif._id)) return prev;
                return [newNotif, ...prev];
            });
        });
        
        return () => {
            socket.disconnect();
        };
    }, [user?._id]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await axiosClient.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await axiosClient.put(`/notifications/read-all`);
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error("Failed to mark all as read", error);
        }
    };

    const clearAllNotifications = async () => {
        try {
            await axiosClient.delete(`/notifications/clear-all`);
            setNotifications([]);
        } catch (error) {
            console.error("Failed to clear notifications", error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                aria-label="Notifications"
            >
                <Bell size={20} className="text-slate-600 dark:text-slate-300" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-[#0a0a0c]"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-[#121216] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden z-50 origin-top-right"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 backdrop-blur-md">
                            <h3 className="font-bold text-slate-800 dark:text-white">Notifications</h3>
                            <div className="flex items-center gap-3">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 flex items-center gap-1 transition-colors"
                                    >
                                        <Check size={14} /> Read all
                                    </button>
                                )}
                                {notifications.length > 0 && (
                                    <button
                                        onClick={clearAllNotifications}
                                        className="text-xs font-semibold text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 flex items-center gap-1 transition-colors"
                                    >
                                        <Trash2 size={13} /> Clear
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="max-h-96 overflow-y-auto custom-scrollbar flex flex-col">
                            {notifications.length === 0 ? (
                                <div className="p-8 flex flex-col items-center justify-center text-center">
                                    <Bell size={24} className="text-slate-300 dark:text-slate-600 mb-2" />
                                    <p className="text-sm font-medium text-slate-500">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => {
                                            if (!notification.isRead) markAsRead(notification._id);
                                        }}
                                        className={`group px-4 py-4 border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors cursor-pointer relative ${!notification.isRead ? 'bg-violet-50/50 dark:bg-violet-500/10' : ''}`}
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm ${!notification.isRead ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                                                    {notification.title}
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
                                                        <Clock size={10} /> {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                    </span>
                                                    {notification.link && (
                                                        <Link href={notification.link} className="flex items-center gap-1 text-[10px] uppercase font-bold text-violet-500 hover:text-violet-600 transition-colors">
                                                            View <ExternalLink size={10} />
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                            {!notification.isRead && (
                                                <div className="w-2 h-2 rounded-full bg-violet-600 shrink-0 mt-1.5" />
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
