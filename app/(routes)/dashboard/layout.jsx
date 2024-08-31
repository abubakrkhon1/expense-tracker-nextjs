'use client';

import React, { useEffect, useState } from 'react';
import SideNav from './_components/SideNav';
import DashboardHeader from './_components/DashboardHeader';
import { db } from '@/utils/dbConfig';
import { Budgets } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

function DashboardLayout({ children }) {
    const user = useUser();
    const router = useRouter();
    const [isSideNavVisible, setIsSideNavVisible] = useState(false); // Default is hidden

    useEffect(() => {
        if (user) {
            checkUserBudgets();
        }
    }, [user]);

    const checkUserBudgets = async () => {
        const result = await db.select().from(Budgets).where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress));
    };

    const toggleSideNav = () => {
        setIsSideNavVisible(!isSideNavVisible);
    };

    return (
        <div className='relative'>
            <SideNav isSideNavVisible={isSideNavVisible} toggleSideNav={toggleSideNav} />
            <div className={`transition-all duration-300 ease-in-out ${isSideNavVisible ? 'ml-64' : ''} md:ml-64`}>
                <DashboardHeader toggleSideNav={toggleSideNav} />
                {children}
            </div>
        </div>
    );
}

export default DashboardLayout;
