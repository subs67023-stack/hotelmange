import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Components';
import { ArrowUpRight, ArrowDownRight, IndianRupee, Activity } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function Dashboard() {
    const { transactions } = useApp();

    const stats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const currentMonth = new Date().getMonth();

        let dailyIncome = 0;
        let dailyExpense = 0;
        let monthlyIncome = 0;
        let monthlyExpense = 0;
        let totalBalance = 0;

        transactions.forEach(tx => {
            const txDate = tx.date.split('T')[0];
            const txMonth = new Date(tx.date).getMonth();
            const amount = parseFloat(tx.amount);

            if (tx.type === 'INCOME') {
                totalBalance += amount;
                if (txDate === today) dailyIncome += amount;
                if (txMonth === currentMonth) monthlyIncome += amount;
            } else {
                totalBalance -= amount;
                if (txDate === today) dailyExpense += amount;
                if (txMonth === currentMonth) monthlyExpense += amount;
            }
        });

        return {
            dailyIncome,
            dailyExpense,
            monthlyBalance: monthlyIncome - monthlyExpense,
            totalBalance
        };
    }, [transactions]);

    const recentTransactions = transactions.slice(0, 5);

    const StatCard = ({ title, amount, icon: Icon, color, trend }) => (
        <Card className="relative overflow-hidden">
            <div className={`absolute top-0 right-0 p-4 opacity-10 ${color}`}>
                <Icon size={100} />
            </div>
            <div className="relative z-10">
                <p className="text-slate-500 font-medium mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800">{formatCurrency(amount)}</h3>
                <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    <span className="ml-1 font-medium">{trend === 'up' ? 'Income' : 'Expense'}</span>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
                <p className="text-slate-500">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Today's Income"
                    amount={stats.dailyIncome}
                    icon={ArrowUpRight}
                    color="text-emerald-500"
                    trend="up"
                />
                <StatCard
                    title="Today's Expenses"
                    amount={stats.dailyExpense}
                    icon={ArrowDownRight}
                    color="text-rose-500"
                    trend="down"
                />
                <StatCard
                    title="Monthly Balance"
                    amount={stats.monthlyBalance}
                    icon={Activity}
                    color="text-blue-500"
                    trend={stats.monthlyBalance >= 0 ? 'up' : 'down'}
                />
                <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-none">
                    <p className="text-blue-100 font-medium mb-1">Total Balance</p>
                    <h3 className="text-3xl font-bold">{formatCurrency(stats.totalBalance)}</h3>
                    <div className="mt-2 text-blue-100 text-sm flex items-center gap-2">
                        <IndianRupee size={16} />
                        <span>Net Cash in Hand</span>
                    </div>
                </Card>
            </div>

            {/* Recent Activity */}
            <h2 className="text-lg font-bold text-slate-800 mt-8">Recent Transactions</h2>
            <Card className="p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {recentTransactions.length > 0 ? (
                                recentTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{formatDate(tx.date)}</td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{tx.name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                                {tx.category.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className={`px-6 py-4 text-right font-bold whitespace-nowrap
                      ${tx.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {tx.type === 'INCOME' ? '+' : '-'} {formatCurrency(tx.amount)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                        No transactions yet. Start adding data!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
