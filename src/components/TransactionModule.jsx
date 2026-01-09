import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Button, Input, Select } from './ui/Components';
import { Trash2, Edit2, Plus, Save, X, Search } from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

export default function TransactionModule({
    title,
    category,
    type,
    fields = [],
    categories = [] // For Market Expenses dropdown
}) {
    const { transactions, addTransaction, updateTransaction, deleteTransaction } = useApp();
    const [isEditing, setIsEditing] = useState(null);
    const [formData, setFormData] = useState({});
    const [searchTerm, setSearchTerm] = useState('');

    // Filter transactions for this module
    const moduleTransactions = transactions.filter(t => t.category === category);

    // Filtered by search
    const filteredTransactions = moduleTransactions.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setFormData({});
        setIsEditing(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = {
            ...formData,
            type,
            category,
            amount: parseFloat(formData.amount),
            date: formData.date || new Date().toISOString()
        };

        if (isEditing) {
            updateTransaction(isEditing, data);
        } else {
            addTransaction(data);
        }
        resetForm();
    };

    const handleEdit = (tx) => {
        setIsEditing(tx.id);
        setFormData({
            ...tx,
            date: tx.date.split('T')[0] // Format for input type="date"
        });
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this record?')) {
            deleteTransaction(id);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
            {/* Left Side: Form */}
            <div className="w-full lg:w-1/3">
                <Card className="h-full overflow-y-auto">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        {isEditing ? <Edit2 size={20} /> : <Plus size={20} />}
                        {isEditing ? 'Edit Transaction' : 'Add New Entry'}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Date"
                            type="date"
                            name="date"
                            required
                            value={formData.date || new Date().toISOString().split('T')[0]}
                            onChange={handleInputChange}
                        />

                        <Input
                            label={fields.find(f => f.name === 'name')?.label || "Name"}
                            type="text"
                            name="name"
                            placeholder="Enter name..."
                            required
                            value={formData.name || ''}
                            onChange={handleInputChange}
                        />

                        {categories.length > 0 && (
                            <Select
                                label="Category"
                                name="subCategory"
                                value={formData.subCategory || ''}
                                onChange={handleInputChange}
                                options={[
                                    { value: '', label: 'Select Category' },
                                    ...categories.map(c => ({ value: c, label: c }))
                                ]}
                                required
                            />
                        )}

                        <Input
                            label="Amount (₹)"
                            type="number"
                            name="amount"
                            placeholder="0.00"
                            required
                            min="0"
                            step="0.01"
                            value={formData.amount || ''}
                            onChange={handleInputChange}
                        />

                        {fields.filter(f => !['name', 'amount', 'date'].includes(f.name)).map(field => (
                            <Input
                                key={field.name}
                                label={field.label}
                                type={field.type || 'text'}
                                name={field.name}
                                value={formData[field.name] || ''}
                                onChange={handleInputChange}
                                required={field.required}
                            />
                        ))}

                        <div className="pt-4 flex gap-2">
                            <Button type="submit" className="flex-1">
                                <Save size={18} />
                                {isEditing ? 'Update' : 'Save Entry'}
                            </Button>
                            {isEditing && (
                                <Button type="button" variant="secondary" onClick={resetForm}>
                                    <X size={18} />
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </form>
                </Card>
            </div>

            {/* Right Side: List */}
            <div className="w-full lg:w-2/3 flex flex-col gap-4">
                {/* Search Bar */}
                <Card className="p-4 flex items-center gap-2">
                    <Search className="text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search records..."
                        className="flex-1 outline-none text-slate-700 placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Card>

                {/* Table */}
                <Card className="flex-1 p-0 overflow-hidden flex flex-col">
                    <div className="overflow-x-auto flex-1">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100 sticky top-0">
                                <tr>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Name / Details</th>
                                    {categories.length > 0 && <th className="px-6 py-4">Category</th>}
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 overflow-y-auto">
                                {filteredTransactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{formatDate(tx.date)}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-800">{tx.name}</div>
                                            {tx.notes && <div className="text-xs text-slate-500">{tx.notes}</div>}
                                        </td>
                                        {categories.length > 0 && (
                                            <td className="px-6 py-4 text-slate-600">
                                                <span className="bg-slate-100 px-2 py-1 rounded text-xs">{tx.subCategory}</span>
                                            </td>
                                        )}
                                        <td className={`px-6 py-4 text-right font-bold whitespace-nowrap ${type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {formatCurrency(tx.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(tx)}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(tx.id)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTransactions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            No records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="p-4 border-t border-slate-100 bg-slate-50 text-right font-medium text-slate-600">
                        Total: <span className="text-slate-900 font-bold ml-2">
                            {formatCurrency(filteredTransactions.reduce((sum, t) => sum + parseFloat(t.amount || 0), 0))}
                        </span>
                    </div>
                </Card>
            </div>
        </div>
    );
}
