import React from 'react';
import TransactionModule from '../components/TransactionModule';

export default function Pigmi() {
    const fields = [
        { name: 'name', label: 'Bank / Pigmi Name', type: 'text', required: true },
        { name: 'notes', label: 'Reference Number', type: 'text' },
    ];

    return (
        <TransactionModule
            title="Pigmi / Deposits"
            category="PIGMI"
            type="EXPENSE"
            fields={fields}
        />
    );
}
