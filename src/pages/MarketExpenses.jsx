import React from 'react';
import TransactionModule from '../components/TransactionModule';

export default function MarketExpenses() {
    const fields = [
        { name: 'name', label: 'Item Name', type: 'text', required: true },
        { name: 'notes', label: 'Notes', type: 'text' },
    ];

    const categories = [
        'Grocery',
        'Vegetables',
        'Gas',
        'Maintenance',
        'Dairy',
        'Meat/Fish',
        'Others'
    ];

    return (
        <TransactionModule
            title="Market Expenses"
            category="MARKET"
            type="EXPENSE"
            fields={fields}
            categories={categories}
        />
    );
}
