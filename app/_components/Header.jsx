'use client'
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserButton, useUser } from '@clerk/nextjs'

function Header() {
  const { user, isSignedIn } = useUser();

  return (
    <div className='p-5 flex justify-between border shadow-lg'>
      <Image src={"./logo.svg"}
        alt='logo'
        width={120}
        height={80}
      />
      {
        isSignedIn ? <div><UserButton />
          <Link href={'/dashboard'}>
            <Button>Dashboard</Button>
          </Link></div>
          :
          <Link href={'/sign-in'}>
            <Button>Get Started!</Button>
          </Link>

      }
    </div>
  )
}

export default Header