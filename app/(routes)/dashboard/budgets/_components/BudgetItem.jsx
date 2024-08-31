import Link from 'next/link';
import React from 'react';

function BudgetItem({ budget }) {
    const calculateProgressPerc = () => {
        if (!budget.amount || budget.amount === 0) {
            return '0%'; // Avoid division by zero
        }
        const perc = (budget.totalSpend / budget.amount) * 100;
        return `${perc.toFixed(2)}%`;
    }

    const totalSpend = parseFloat(budget.totalSpend) || 0;
    const amount = parseFloat(budget.amount) || 0;

    return (
        <Link href={'/dashboard/expenses/' + budget?.id}>
            <div className='p-5 border rounded-lg hover:shadow-lg cursor-pointer h-[150px]'>
                <div className='flex gap-2 items-center justify-between'>
                    <div className='flex gap-2 items-center'>
                        <h2 className='text-2xl bg-slate-100 rounded-full'>{budget?.icon}</h2>
                        <div>
                            <h2 className='font-bold'>{budget.name}</h2>
                            <h2 className='text-sm text-gray-500'>{budget.totalItem || 0} Item</h2>
                        </div>
                    </div>
                    <h2 className={`font-bold text-primary text-lg`}>${amount.toFixed(2)}</h2>
                </div>
                <div className='mt-6'>
                    <div className='flex items-center justify-between mb-1'>
                        <h2 className='text-xs text-slate-400'>${totalSpend.toFixed(2)} spent</h2>
                        <h2 className='text-xs text-slate-400'>${(amount - totalSpend).toFixed(2)} remaining</h2>
                    </div>
                    <div className='w-full bg-slate-300 h-2 rounded-full'>
                        <div className='bg-primary h-2 rounded-full' style={
                            { width: calculateProgressPerc() }
                        }>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default BudgetItem;
