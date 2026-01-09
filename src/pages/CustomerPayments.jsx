import React from 'react';
import TransactionModule from '../components/TransactionModule';

export default function CustomerPayments() {
    const fields = [
        { name: 'name', label: 'Customer Name', type: 'text', required: true },
        { name: 'notes', label: 'Payment Notes / Mode', type: 'text' },
    ];

    return (
        <TransactionModule
            title="Customer Payments"
            category="CUSTOMER_PAYMENT"
            type="INCOME"
            fields={fields}
        />
    );
}
