import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { LinkIcon, LogOut } from 'lucide-react'
import { UrlState } from '@/context'
import useFetch from '@/hooks/use-fetch'
import { logout } from '@/db/apiAuth'
import { BarLoader } from 'react-spinners'


const Header = () => {
    const navigate = useNavigate()

    const { user, fetchUser } = UrlState()
    const { loading, fn: fnLogout } = useFetch(logout)

    
    return (
        <>
            <nav className='py-4 flex justify-between items-center'>
                <Link to={'/'}>
                    <img src='/logo.png' className='h-16' />
                </Link>
                <div>
                    {
                        !user ? (<Button onClick={() => {navigate('/auth')}}>Login</Button>) 
                        :
                        (<DropdownMenu>
                            <DropdownMenuTrigger className='w-10 rounded-full overflow-hidden'>
                                <Avatar>
                                    <AvatarImage src={user?.user_metadata?.profile_pic} className="object-cover" />
                                    <AvatarFallback>DG</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => {navigate('/dashboard')}}>
                                    <LinkIcon size={16} className='mr-2'/>
                                    <span>My Links</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className='text-red-400'>
                                    <LogOut size={16} className='mr-2'/>
                                    <span onClick={() => {
                                        fnLogout().then(() => {
                                            fetchUser()
                                            navigate('/')
                                        })
                                    }}>Logout</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        )
                    }
                </div>
                
            </nav>
            {loading && <BarLoader color='#36d7b7' width={"100%"} className='mb-4'/>}
        </>
    )
}

export default Header