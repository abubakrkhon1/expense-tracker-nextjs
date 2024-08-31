'use client'
import { Button } from '@/components/ui/button'
import { PenBox } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import EmojiPicker from 'emoji-picker-react'
import { useUser } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'

function EditBudget({ budgetInfo, refreshData }) {
    const [emojiIcon, setEmojiIcon] = useState(budgetInfo?.icon);
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

    const [name, setName] = useState(budgetInfo?.name);
    const [amount, setAmount] = useState(budgetInfo?.amount);

    const { user } = useUser();

    useEffect(() => {
        if (budgetInfo) {
            setEmojiIcon(budgetInfo.icon || '📊');
            setName(budgetInfo.name || '');
            setAmount(budgetInfo.amount || '');
        }
    }, [budgetInfo]);

    const onUpdateBudget = async () => {
        if (user) {
            const result = await db.update(Budgets).set({
                name: name,
                amount: amount,
                icon: emojiIcon
            }).where(eq(Budgets.id, budgetInfo.id))

            if (result) toast("Budget Updated Successfully!")
            refreshData();
        }
    }
    return (
        <div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className={'flex gap-1 text-white'}> 
                        <PenBox className='block text-white' />
                        <span className='hidden md:inline'>Edit</span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Budget</DialogTitle>
                        <DialogDescription>
                            <div className='mt-4'>
                                <Button className="text-lg" variant="outline" onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>{emojiIcon}</Button>
                                <div className='absolute z-20'>
                                    <EmojiPicker open={openEmojiPicker} onEmojiClick={(e) => { setEmojiIcon(e.emoji); setOpenEmojiPicker(false) }} />
                                </div>
                                <div className='mt-2'>
                                    <h2 className={`text-black font-medium my-1`}>Budget Name</h2>
                                    <Input placeholder="e.g Home Decor" defaultValue={budgetInfo.name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className='mt-2'>
                                    <h2 className={`text-black font-medium my-1 `}>Budget Amount</h2>
                                    <Input placeholder="e.g $5000" type="number" defaultValue={budgetInfo.amount} onChange={(e) => setAmount(e.target.value)} />
                                </div>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose asChild>
                            <Button disabled={!(amount && name)} className={`mt-5 w-full bg-primary hover:bg-blue-800 text-white`} onClick={() => onUpdateBudget()}>Update Budget</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default EditBudget