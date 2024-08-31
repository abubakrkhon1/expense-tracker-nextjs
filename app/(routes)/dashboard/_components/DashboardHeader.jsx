import { UserButton } from '@clerk/nextjs';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';


function DashboardHeader({ toggleSideNav }) {

  return (
    <div className='p-5 shadow-sm border-b flex justify-between items-center'>
      <div className='flex items-center'>
        <Button onClick={toggleSideNav} className='md:hidden h-9 w-10 mr-2'>
          <Menu className='h-full w-full' />
          <span className='sr-only'>Toggle Sidebar</span>
        </Button>
      </div>
      <div>
        <UserButton />
      </div>
    </div>
  );
}

export default DashboardHeader;
