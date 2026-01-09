import React from 'react';
import { cn } from '../../utils/helpers';

export function Card({ children, className }) {
    return (
        <div className={cn("bg-white rounded-xl shadow-sm border border-slate-100 p-6", className)}>
            {children}
        </div>
    );
}

export function Button({ children, variant = 'primary', className, ...props }) {
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20",
        secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50",
        danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-red-100",
        outline: "border-2 border-slate-200 text-slate-600 hover:border-slate-300",
    };

    return (
        <button
            className={cn(
                "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

export function Input({ label, error, className, ...props }) {
    return (
        <div className="space-y-1">
            {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
            <input
                className={cn(
                    "w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all",
                    error && "border-red-500 focus:ring-red-100",
                    className
                )}
                {...props}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

export function Select({ label, options, error, className, ...props }) {
    return (
        <div className="space-y-1">
            {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
            <select
                className={cn(
                    "w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white",
                    error && "border-red-500 focus:ring-red-100",
                    className
                )}
                {...props}
            >
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
