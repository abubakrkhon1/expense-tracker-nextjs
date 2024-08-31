'use client'
import { db } from '@/utils/dbConfig';
import { Expenses } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Trash } from 'lucide-react';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

function ExpenseListTable({ expenseList, refreshData }) {
    const deleteExpense = async (expense) => {
        const result = await db.delete(Expenses).where(eq(Expenses.id, expense.id)).returning();
        if (result) {
            toast('Expense Deleted!');
            refreshData();
        }
    }

    return (
        <div className='mt-3'>
            <h2 className='font-bold text-xl mb-3'>Latest Expenses</h2>
            <div className={`grid grid-cols-4 bg-slate-300 p-2`}>
                <h2 className='font-bold'>Name</h2>
                <h2 className='font-bold'>Amount</h2>
                <h2 className='font-bold'>Date</h2>
                <h2 className='font-bold'>Action</h2>
            </div>

            {expenseList.map((expense, index) => {
                const date = new Date(expense.createdAt).toLocaleString();
                return (
                    <div key={expense.id || index} className={`grid grid-cols-4 bg-slate-100 p-2`}>
                        <h2 className='p-1'>{expense.name}</h2>
                        <h2 className='p-1'>${expense.amount}</h2>
                        <h2 className='p-1'>{date}</h2>
                        <div className='p-1 flex justify-center'>
                            <Trash className='text-red-600 cursor-pointer text-end' onClick={() => deleteExpense(expense)} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default ExpenseListTable;
