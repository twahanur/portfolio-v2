"use client";

import { useState, useEffect } from "react";
import { Menu, X, Home, User, Briefcase, Activity, BookOpen, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SystemStatusBadge from "./SystemStatusBadge";
import GlobalSearchModal from "./GlobalSearchModal";

const NAV_ITEMS = [
    { href: "#Home", label: "Home", icon: Home },
    { href: "#About", label: "About", icon: User },
    { href: "#Portofolio", label: "Portofolio", icon: Briefcase },
    { href: "#Activities", label: "Activities", icon: Activity },
    { href: "#Blog", label: "Tech Talk", icon: BookOpen },
    { href: "#Contact", label: "Contact", icon: Send },
];

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            const sections = NAV_ITEMS.map(item => {
                const section = document.querySelector(item.href) as any;
                if (section) {
                    return {
                        id: item.href.replace("#", ""),
                        offset: section.offsetTop - 550,
                        height: section.offsetHeight
                    };
                }
                return null;
            }).filter(Boolean);

            const currentPosition = window.scrollY;
            const active = sections.find(section => 
                currentPosition >= section.offset && 
                currentPosition < section.offset + section.height
            );

            if (active) {
                setActiveSection(active.id);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const scrollToSection = (e: React.MouseEvent, href: string) => {
        e.preventDefault();
        const section = document.querySelector(href) as any;
        if (section) {
            const top = section.offsetTop - 100;
            window.scrollTo({
                top: top,
                behavior: "smooth"
            });
        }
        setIsOpen(false);
    };

    return (
        <nav
        className={`sticky w-full top-0 z-50 transition-all duration-500 ${
            isOpen
                ? "bg-[#030014] opacity-100 border-b border-indigo-500/20"
                : scrolled
                ? "bg-white/70 dark:bg-[#030014]/70 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/40 shadow-lg shadow-indigo-950/20"
                : "bg-transparent"
        }`}
    >
        <div className="mx-auto px-4 sm:px-6 lg:px-[10%]">
            <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <a
                        href="#Home"
                        onClick={(e) => scrollToSection(e, "#Home")}
                        className="text-xl font-extrabold bg-gradient-to-r from-[#a855f7] via-[#818cf8] to-[#6366f1] bg-clip-text text-transparent flex items-center gap-2 hover:opacity-90 transition-opacity"
                    >
                        <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                        Twahanur
                    </a>
                </div>
    
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    <div className="flex items-center space-x-6">
                        {NAV_ITEMS.map((item) => (
                            <a
                                key={item.label}
                                href={item.href}
                                onClick={(e) => scrollToSection(e, item.href)}
                                className="group relative px-1 py-2 text-sm font-medium"
                            >
                                <span
                                    className={`relative z-10 transition-colors duration-300 ${
                                        activeSection === item.href.substring(1)
                                            ? "bg-gradient-to-r from-[#6366f1] to-[#a855f7] bg-clip-text text-transparent font-semibold"
                                            : "text-slate-600 dark:text-[#e2d3fd] group-hover:text-slate-900 dark:group-hover:text-white"
                                    }`}
                                >
                                    {item.label}
                                </span>
                                <span
                                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7] transform origin-left transition-transform duration-300 ${
                                        activeSection === item.href.substring(1)
                                            ? "scale-x-100"
                                            : "scale-x-0 group-hover:scale-x-100"
                                    }`}
                                />
                            </a>
                        ))}
                    </div>

                    {/* Live System Status & Search */}
                    <div className="flex items-center gap-3">
                      <SystemStatusBadge />
                      <GlobalSearchModal />
                    </div>
                </div>
    
                {/* Mobile Menu Toggle Button */}
                <div className="md:hidden flex items-center gap-2">
                    <GlobalSearchModal />
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle menu"
                        className="relative p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all duration-300 active:scale-95"
                    >
                        {isOpen ? (
                            <X className="w-5 h-5 text-indigo-400" />
                        ) : (
                            <Menu className="w-5 h-5 text-slate-300" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    
        {/* Modern Interactive Mobile Menu Overlay */}
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="md:hidden fixed top-[64px] left-0 right-0 z-40 bg-[#030014]/95 backdrop-blur-2xl border-b border-indigo-500/20 shadow-2xl shadow-indigo-950/60 overflow-hidden"
                >
                    <div className="p-4 sm:p-6 space-y-4 max-h-[calc(100vh-80px)] overflow-y-auto">
                        {/* Status Widget inside Drawer */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Navigation & System
                            </span>
                            <SystemStatusBadge />
                        </div>

                        {/* Navigation Links with Icons */}
                        <div className="space-y-1.5 py-1">
                            {NAV_ITEMS.map((item, index) => {
                                const Icon = item.icon;
                                const isActive = activeSection === item.href.substring(1);
                                return (
                                    <motion.a
                                        key={item.label}
                                        href={item.href}
                                        onClick={(e) => scrollToSection(e, item.href)}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.04 + 0.05, duration: 0.25 }}
                                        className={`flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                                            isActive
                                                ? "bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/10 text-white border border-indigo-500/40 shadow-lg shadow-indigo-500/10 font-semibold"
                                                : "text-slate-300 hover:text-white hover:bg-slate-900/80 hover:border hover:border-slate-800"
                                        }`}
                                    >
                                        <div
                                            className={`p-2 rounded-lg transition-colors ${
                                                isActive
                                                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-md"
                                                    : "bg-slate-900 border border-slate-800 text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-500/30"
                                            }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className="flex-1 text-base">{item.label}</span>
                                        {isActive && (
                                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                                        )}
                                    </motion.a>
                                );
                            })}
                        </div>

                        {/* Mobile CTA Button */}
                        <div className="pt-3 border-t border-slate-800/80">
                            <a
                                href="#Contact"
                                onClick={(e) => scrollToSection(e, "#Contact")}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all"
                            >
                                <span>Get in Touch</span>
                                <Send className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </nav>
    );
};

export default Navbar;