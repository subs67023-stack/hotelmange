import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button } from '../components/ui/Components';
import { formatCurrency, formatDate } from '../utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Download, Trash2, FileJson } from 'lucide-react';

export default function Reports() {
    const { transactions, exportData, clearAllData } = useApp();

    const chartData = useMemo(() => {
        // 1. Daily Income vs Expense (Last 7 Days)
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toISOString().split('T')[0];
        });

        const dailyData = last7Days.map(date => {
            const txs = transactions.filter(t => t.date.split('T')[0] === date);
            const income = txs.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + parseFloat(t.amount), 0);
            const expense = txs.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + parseFloat(t.amount), 0);
            return {
                date: formatDate(date),
                activeDate: date,
                Income: income,
                Expense: expense
            };
        });

        // 2. Expense Distribution (Pie Chart)
        const expenses = transactions.filter(t => t.type === 'EXPENSE');
        const categories = ['MARKET', 'PIGMI', 'SALARY'];
        const pieData = categories.map(cat => ({
            name: cat,
            value: expenses.filter(t => t.category === cat).reduce((sum, t) => sum + parseFloat(t.amount), 0)
        })).filter(d => d.value > 0);

        // 3. Balance Trend (Last 30 transactions or days)
        // Simplified: Running balance of last 20 transactions reversed to show chronological
        const sortedTxs = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
        let runningBalance = 0;
        const balanceData = sortedTxs.map(t => {
            const amount = parseFloat(t.amount);
            if (t.type === 'INCOME') runningBalance += amount;
            else runningBalance -= amount;
            return {
                date: formatDate(t.date),
                balance: runningBalance
            };
        }); // Take last 20 points if too many

        return { dailyData, pieData, balanceData };
    }, [transactions]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-800">Financial Reports</h1>
                <div className="flex gap-2">
                    <Button onClick={exportData} variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                        <FileJson size={18} />
                        Export Data
                    </Button>
                    <Button onClick={clearAllData} variant="danger">
                        <Trash2 size={18} />
                        Reset System
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Bar Chart */}
                <Card className="h-80">
                    <h3 className="font-bold text-slate-700 mb-4">Daily Income vs Expense (Last 7 Days)</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData.dailyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={val => `₹${val}`} />
                            <Tooltip formatter={(value) => formatCurrency(value)} cursor={{ fill: '#f1f5f9' }} />
                            <Legend />
                            <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                {/* Pie Chart */}
                <Card className="h-80">
                    <h3 className="font-bold text-slate-700 mb-4">Expense Distribution</h3>
                    <div className="flex items-center justify-center h-full pb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData.pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Balance History */}
                <Card className="h-80 lg:col-span-2">
                    <h3 className="font-bold text-slate-700 mb-4">Balance History Timeline</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData.balanceData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={val => `₹${val}`} />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Line type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
}
