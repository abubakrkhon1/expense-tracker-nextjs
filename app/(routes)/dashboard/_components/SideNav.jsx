import { UserButton } from '@clerk/nextjs';
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck, X } from 'lucide-react'; // Import X icon for hiding
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

function SideNav({ isSideNavVisible, toggleSideNav }) { // Accept props for visibility and toggle function
    const menuList = [
        {
            id: 1,
            name: 'Dashboard',
            icon: LayoutGrid,
            path: '/dashboard'
        },
        {
            id: 2,
            name: 'Budgets',
            icon: PiggyBank,
            path: '/dashboard/budgets'
        },
        {
            id: 3,
            name: 'Upgrade',
            icon: ShieldCheck,
            path: '/dashboard/upgrade'
        },
    ];

    const path = usePathname();

    return (
        <>
            {/* Sidebar for all screens */}
            <div
                className={`fixed top-0 left-0 h-screen w-64 p-5 border shadow-sm bg-white z-50 transition-transform duration-300 ease-in-out ${isSideNavVisible ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:w-64 md:block`}
                style={{ backgroundColor: 'white'}} // Ensure background color is solid
            >
                <div className='flex items-center justify-between'>
                    <Image src={'/logo.svg'} alt='logo' width={130} height={100} />
                    <button onClick={toggleSideNav} className='md:hidden p-2'>
                        <X className='h-6 w-6' />
                        <span className='sr-only'>Hide Sidebar</span>
                    </button>
                </div>
                <div className='mt-5'>
                    {menuList.map((menu, index) => (
                        <Link key={index} href={menu.path}>
                            <h2 className={`flex mb-2 gap-2 items-center text-black font-medium p-5 cursor-pointer rounded-md hover:text-primary hover:bg-blue-200 ${path === menu.path && 'bg-primary text-white'}`}>
                                <menu.icon />
                                {menu.name}
                            </h2>
                        </Link>
                    ))}
                </div>
                <div className='fixed bottom-0 p-5 flex items-center'>
                    <UserButton />
                    <h1 className='ml-2 text-lg font-bold'>Profile</h1>
                </div>
            </div>
            {/* Background overlay for small screens */}
            {isSideNavVisible && (
                <div
                    onClick={toggleSideNav}
                    className='fixed inset-0 bg-black opacity-50 z-40 md:hidden'
                ></div>
            )}
        </>
    );
}

export default SideNav;
