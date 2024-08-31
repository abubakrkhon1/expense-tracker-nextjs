import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import React, { useState } from 'react';
import { toast } from 'sonner';

function AddExpense({ budgetId, user, refreshData, budgetAmount }) {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');

    const addNewExpense = async () => {
        const amountNumber = parseFloat(amount);

        // Validate amount
        if (isNaN(amountNumber) || amountNumber <= 0) {
            toast("Amount must be a positive number.", { style: { background: 'red', color: 'white' } });
            return;
        }

        if (amountNumber > budgetAmount) {
            toast("Amount exceeds the remaining budget!", { style: { background: 'red', color: 'white' } });
            return;
        }

        try {
            const result = await db.insert(Expenses).values({
                name: name,
                amount: amountNumber,
                budgetId: budgetId,
                user: user?.primaryEmailAddress?.emailAddress
            }).returning({ insertedId: Budgets.id });

            if (result) {
                refreshData();
                toast('New Expense Added!');
            }
        } catch (error) {
            console.error('Error adding expense:', error);
            toast("Error adding expense. Please try again.", { style: { background: 'red', color: 'white' } });
        }
    };

    return (
        <div className='border p-5 rounded-lg'>
            <h2 className='font-bold text-lg'>Add Expense</h2>
            <div className='mt-2'>
                <h2 className={`text-black font-medium my-1`}>Expense Name</h2>
                <Input
                    placeholder="e.g Bedroom Decor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className='mt-2'>
                <h2 className={`text-black font-medium my-1`}>Expense Amount</h2>
                <Input
                    placeholder="e.g 1000"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <Button
                disabled={!(name && amount)}
                onClick={addNewExpense}
                className={`mt-5 w-full text-white`}
            >
                Add New Expense
            </Button>
        </div>
    );
}

export default AddExpense;
