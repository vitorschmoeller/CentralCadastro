"use client"

import {FiUser, FiLogOut, FiLock, FiLoader} from 'react-icons/fi'
import Link from "next/link"
import { colors } from '@/utils/colors'
import {signIn, signOut, useSession} from "next-auth/react"
export function Header(){
    const {data, status} = useSession()
    
    async function handleLogin(){
        await signIn()
    }

    async function handleLogOut(){
        await signOut()
    }

    
    return(
        <header className="py-4 w-full h-20 shadow-sm">
            <div className="mx-auto max-w-[1280px]">
                <nav className='flex items-center justify-between'>
                    <Link href="/">
                        <h1 className='text-2xl font-bold hover:tracking-widest duration-300'>
                            <span className="text-purple-200">CENTRAL</span> CADASTROS
                        </h1>
                    </Link>
                    
                    {status === "loading" && (
                        <FiLoader size={26} color={colors.black} className="animate-spin"/>
                    )}

                    {status === "unauthenticated" && (
                        <button title='login' type='button' onClick={handleLogin}>
                            <FiLock size={26} color='black'/>
                        </button>
                    )}

                    {status === "authenticated" && (
                        <div className='flex gap-3'>
                        <Link href="/dashboard">
                            <FiUser size={26} color={colors.black}/>
                        </Link>

                        <button type='button' title='Deslogar'>
                            <FiLogOut size={26} color={colors.black} onClick={handleLogOut}/>
                        </button>
                    </div>
                    )}
                    
                </nav>
            </div>
        </header>
    )
}