import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateId } from '../utils/helpers';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
    // Load initial state from LocalStorage
    const [transactions, setTransactions] = useState(() => {
        try {
            const saved = localStorage.getItem('hotel_transactions');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse transactions", e);
            return [];
        }
    });

    const [employees, setEmployees] = useState(() => {
        try {
            const saved = localStorage.getItem('hotel_employees');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error("Failed to parse employees", e);
            return [];
        }
    });

    // Save to LocalStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('hotel_transactions', JSON.stringify(transactions));
    }, [transactions]);

    useEffect(() => {
        localStorage.setItem('hotel_employees', JSON.stringify(employees));
    }, [employees]);

    // Transaction Actions
    const addTransaction = (data) => {
        const newTx = { ...data, id: generateId(), createdAt: new Date().toISOString() };
        setTransactions(prev => [newTx, ...prev]);
    };

    const updateTransaction = (id, updatedData) => {
        setTransactions(prev => prev.map(tx => tx.id === id ? { ...tx, ...updatedData } : tx));
    };

    const deleteTransaction = (id) => {
        setTransactions(prev => prev.filter(tx => tx.id !== id));
    };

    // Employee Actions
    const addEmployee = (data) => {
        const newEmp = { ...data, id: generateId() };
        setEmployees(prev => [...prev, newEmp]);
    };

    const updateEmployee = (id, updatedData) => {
        setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, ...updatedData } : emp));
    };

    const deleteEmployee = (id) => {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
    };

    // Global Actions
    const clearAllData = () => {
        if (window.confirm("Are you sure you want to delete ALL data? This cannot be undone.")) {
            setTransactions([]);
            setEmployees([]);
            localStorage.removeItem('hotel_transactions');
            localStorage.removeItem('hotel_employees');
        }
    };

    const exportData = () => {
        const data = {
            transactions,
            employees,
            exportedAt: new Date().toISOString(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `hotel_data_${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const value = {
        transactions,
        employees,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        clearAllData,
        exportData
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
