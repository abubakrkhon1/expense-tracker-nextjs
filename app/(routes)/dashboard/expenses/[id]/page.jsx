'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import BudgetItem from '../../budgets/_components/BudgetItem';
import AddExpense from './_components/AddExpense';
import ExpenseListTable from './_components/ExpenseListTable';
import { Button } from '@/components/ui/button';
import { MoveLeft, Trash } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';
import EditBudget from './_components/EditBudget';

function ExpensesScreen({ params }) {
    const { user } = useUser();
    const [budgetInfo, setBudgetInfo] = useState({});
    const [expenseList, setExpenseList] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (user) {
            getBudgetInfo();
        }
    }, [user, params.id]);

    const getBudgetInfo = async () => {
        try {
            const result = await db.select({
                ...getTableColumns(Budgets),
                totalSpend: sql`sum(CAST(${Expenses.amount} AS NUMERIC))`.mapWith(Number),
                totalItem: sql`count(${Expenses.id})`.mapWith(Number)
            }).from(Budgets)
                .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
                .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
                .where(eq(Budgets.id, parseInt(params.id)))
                .groupBy(Budgets.id);

            setBudgetInfo(result[0]);
            getExpensesList();
        } catch (error) {
            console.error('Error fetching budget info:', error);
        }
    };

    const getExpensesList = async () => {
        const result = await db.select().from(Expenses)
            .where(eq(Expenses.budgetId, params.id))
            .orderBy(desc(Expenses.id));

        setExpenseList(result);
    };

    const remainingAmount = (budgetInfo.amount - (budgetInfo.totalSpend || 0)).toFixed(2);

    const deleteBudget = async () => {
        const deleteExpense = await db.delete(Expenses).where(eq(Expenses.budgetId, params.id)).returning();

        if (deleteExpense) {
            const result = await db.delete(Budgets).where(eq(Budgets.id, params.id)).returning();
            toast('Budget Deleted Successfully!');
            router.replace('/dashboard/budgets');
        }
    };

    return (
        <div className='p-10'>
            <div className='flex items-center mb-4'>
                <MoveLeft onClick={() => router.back()} className='mr-4 cursor-pointer'/>
                <h2 className='text-2xl font-bold flex-grow'>My Expenses</h2>
                <div className='flex gap-2'>
                    <EditBudget budgetInfo={budgetInfo} refreshData={() => getBudgetInfo()} />
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className='flex items-center gap-2' variant='destructive'>
                                <Trash className='block' /> {/* Show only icon on smaller screens */}
                                <span className='hidden md:inline'>Delete</span> {/* Show text only on medium and larger screens */}
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your budget along with expenses from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction className={'text-white'} onClick={() => deleteBudget()}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 mt-6 gap-5'>
                {budgetInfo.name ? <BudgetItem budget={budgetInfo} /> : <div className='h-[150px] w-full bg-slate-200 rounded-lg animate-pulse'></div>}
                <AddExpense budgetId={params.id} user={user} budgetAmount={remainingAmount} refreshData={() => getBudgetInfo()} />
            </div>
            <div className='mt-4'>
                <ExpenseListTable expenseList={expenseList} refreshData={() => getBudgetInfo()} />
            </div>
        </div>
    );
}

export default ExpensesScreen;
