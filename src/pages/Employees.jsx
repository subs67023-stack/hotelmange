import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Input } from '../components/ui/Components';
import { Plus, Trash2, Edit2, UserCheck, Wallet, IndianRupee } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function Employees() {
    const { employees, addEmployee, updateEmployee, deleteEmployee, addTransaction, transactions } = useApp();
    const [activeTab, setActiveTab] = useState('manage'); // 'manage' or 'salary'

    // States for Employee Form
    const [empForm, setEmpForm] = useState({});
    const [isEditingEmp, setIsEditingEmp] = useState(null);

    // States for Salary Payment
    const [payModalOpen, setPayModalOpen] = useState(null); // Employee ID
    const [salaryForm, setSalaryForm] = useState({ date: new Date().toISOString().split('T')[0], amount: '' });

    // --- Employee Management Logic ---
    const handleEmpSubmit = (e) => {
        e.preventDefault();
        if (isEditingEmp) {
            updateEmployee(isEditingEmp, empForm);
        } else {
            addEmployee(empForm);
        }
        setEmpForm({});
        setIsEditingEmp(null);
    };

    const startEditEmp = (emp) => {
        setIsEditingEmp(emp.id);
        setEmpForm(emp);
    };

    const deleteEmp = (id) => {
        if (window.confirm("Delete employee? This won't delete their payment history.")) {
            deleteEmployee(id);
        }
    };

    // --- Salary Payment Logic ---
    const handlePayClick = (emp) => {
        setPayModalOpen(emp.id);
        setSalaryForm({
            date: new Date().toISOString().split('T')[0],
            amount: emp.salary || ''
        });
    };

    const submitSalary = (e) => {
        e.preventDefault();
        const emp = employees.find(e => e.id === payModalOpen);
        if (!emp) return;

        addTransaction({
            type: 'EXPENSE',
            category: 'SALARY',
            amount: parseFloat(salaryForm.amount),
            date: salaryForm.date,
            name: `${emp.name} (Salary)`,
            subCategory: emp.role,
            notes: `Salary Payment - ${emp.role}`,
            details: {
                employeeId: emp.id,
                role: emp.role
            }
        });

        setPayModalOpen(null);
        setSalaryForm({ date: '', amount: '' });
        window.alert(`Salary of ${formatCurrency(salaryForm.amount)} paid to ${emp.name}`);
    };

    // Get Salary History
    const salaryHistory = transactions.filter(t => t.category === 'SALARY');

    return (
        <div className="space-y-6">
            <div className="flex gap-4 border-b border-slate-200 pb-2">
                <button
                    onClick={() => setActiveTab('manage')}
                    className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'manage' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    Manage Employees
                </button>
                <button
                    onClick={() => setActiveTab('salary')}
                    className={`pb-2 px-4 font-medium transition-colors ${activeTab === 'salary' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                    Salary Payments
                </button>
            </div>

            {activeTab === 'manage' && (
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Add Employee Form */}
                    <div className="w-full lg:w-1/3">
                        <Card>
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <UserCheck size={20} />
                                {isEditingEmp ? 'Edit Employee' : 'Add Employee'}
                            </h3>
                            <form onSubmit={handleEmpSubmit} className="space-y-4">
                                <Input label="Name" required value={empForm.name || ''} onChange={e => setEmpForm({ ...empForm, name: e.target.value })} />
                                <Input label="Role" required value={empForm.role || ''} onChange={e => setEmpForm({ ...empForm, role: e.target.value })} />
                                <Input label="Base Salary (₹)" type="number" value={empForm.salary || ''} onChange={e => setEmpForm({ ...empForm, salary: e.target.value })} />
                                <Button type="submit" className="w-full">{isEditingEmp ? 'Update' : 'Add Employee'}</Button>
                                {isEditingEmp && <Button type="button" variant="secondary" className="w-full mt-2" onClick={() => { setIsEditingEmp(null); setEmpForm({}); }}>Cancel</Button>}
                            </form>
                        </Card>
                    </div>

                    {/* Employee List */}
                    <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {employees.length === 0 && (
                            <div className="col-span-2 text-center text-slate-400 py-12">No employees added yet.</div>
                        )}
                        {employees.map(emp => (
                            <Card key={emp.id} className="flex justify-between items-center group">
                                <div>
                                    <h4 className="font-bold text-slate-800">{emp.name}</h4>
                                    <p className="text-sm text-slate-500">{emp.role}</p>
                                    <p className="text-sm font-medium text-blue-600 mt-1">{emp.salary ? formatCurrency(emp.salary) : 'No Salary Set'}</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => startEditEmp(emp)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={16} /></button>
                                    <button onClick={() => deleteEmp(emp.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {activeTab === 'salary' && (
                <div className="space-y-8">
                    {/* Pay Salary Section */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Wallet size={20} />
                            Pay Salaries
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {employees.map(emp => (
                                <Card key={emp.id} className="border-l-4 border-l-blue-500">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="font-bold">{emp.name}</h4>
                                            <p className="text-sm text-slate-500">{emp.role}</p>
                                        </div>
                                        <div className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Active</div>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="font-bold text-slate-700">{formatCurrency(emp.salary || 0)}</span>
                                        <Button size="sm" onClick={() => handlePayClick(emp)}>Pay Now</Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Salary History Table */}
                    <Card className="p-0 overflow-hidden">
                        <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700">Payment History</div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Employee</th>
                                        <th className="px-6 py-3">Role</th>
                                        <th className="px-6 py-3 text-right">Amount Paid</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {salaryHistory.map(tx => (
                                        <tr key={tx.id}>
                                            <td className="px-6 py-3">{formatDate(tx.date)}</td>
                                            <td className="px-6 py-3 font-medium text-slate-800">{tx.name.replace(' (Salary)', '')}</td>
                                            <td className="px-6 py-3 text-slate-500">{tx.subCategory}</td>
                                            <td className="px-6 py-3 text-right font-bold text-rose-600">-{formatCurrency(tx.amount)}</td>
                                        </tr>
                                    ))}
                                    {salaryHistory.length === 0 && <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-400">No salary payments recorded.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* Salary Payment Modal */}
            {payModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <Card className="w-full max-w-md animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold mb-4">Confirm Salary Payment</h3>
                        <p className="text-slate-500 mb-6">Payment for: <span className="font-bold text-slate-800">{employees.find(e => e.id === payModalOpen)?.name}</span></p>
                        <form onSubmit={submitSalary} className="space-y-4">
                            <Input label="Payment Date" type="date" required value={salaryForm.date} onChange={e => setSalaryForm({ ...salaryForm, date: e.target.value })} />
                            <Input label="Amount" type="number" required value={salaryForm.amount} onChange={e => setSalaryForm({ ...salaryForm, amount: e.target.value })} />
                            <div className="flex gap-2 justify-end mt-6">
                                <Button type="button" variant="secondary" onClick={() => setPayModalOpen(null)}>Cancel</Button>
                                <Button type="submit">Confirm Payment</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </div>
    );
}
